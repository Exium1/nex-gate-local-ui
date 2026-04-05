// src/services/socket.ts
type PendingRequest = {
  resolve: (msg: unknown) => void
  reject: (err: Error) => void
  timeout: ReturnType<typeof setTimeout>
}

export class SocketService {
  private ws: WebSocket | null = null
  private handlers = new Set<(msg: any) => void>()
  private pending = new Map<number, PendingRequest>()
  requestCount = 1;

  connect(socketURL = `ws://${location.host.replace(location.port, "3001")}/ws`): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(socketURL)
      this.ws = ws

      ws.onopen = () => resolve()
      ws.onerror = (e) => reject(new Error('WebSocket failed to connect'))

      ws.onmessage = (event) => {
        this.onMessage(event.data)
      }

      ws.onclose = () => {
        console.log('Disconnected')
      }
    })
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }

  subscribe(func: (msg: any) => void): void {
    this.handlers.add(func)
  }

  unsubscribe(func: (msg: any) => void): void {
    this.handlers.delete(func);
  }

  send(msg: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  request<T>(type: string, payload: object, timeoutMs = 5000): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = this.requestCount++;

      const timeout = setTimeout(() => {
        this.pending.delete(requestId)
        reject(new Error(`Request ${type} timed out`))
      }, timeoutMs)

      this.pending.set(requestId, { resolve: resolve as any, reject, timeout })
      this.send({ type, payload, requestId })
    })
  }

  private onMessage(raw: any) {
    let msg: any
    try { msg = JSON.parse(raw) } catch { return }

    // If it has a requestId and we're waiting on it, resolve the promise
    if (msg.requestId && this.pending.has(msg.requestId)) {
      const pending = this.pending.get(msg.requestId)!
      clearTimeout(pending.timeout)
      this.pending.delete(msg.requestId)

      if (msg.type === 'error') {
        pending.reject(new Error(msg.message))
      } else {
        pending.resolve(msg)
      }
      return
    }

    // Otherwise broadcast to subscribers
    this.handlers.forEach(h => h(msg))
  }
}

export const socketService = new SocketService();