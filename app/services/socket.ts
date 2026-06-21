import { ClientInboundMessageSchema, ClientOutboundMessageSchema, JoinRaceSessionResponseMessageSchema, JoinRaceSessionResponseSchema, type ClientInboundMessage, type ClientOutboundMessage } from "@exium1/nex-gate-local-shared"
import { Value } from "@sinclair/typebox/value"

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
    console.log("ISTFG")
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

    if (!Value.Check(ClientOutboundMessageSchema, msg)) {
      const errors = [...Value.Errors(JoinRaceSessionResponseMessageSchema, msg)]
      console.log(errors)
      return;
    }

    const inboundMsg = msg as ClientOutboundMessage;
    const requestId = "requestId" in inboundMsg ? inboundMsg.requestId : undefined;

    // If it has a requestId and we're waiting on it, resolve the promise
    if (requestId && this.pending.has(requestId)) {
      const pending = this.pending.get(requestId)!
      clearTimeout(pending.timeout)
      this.pending.delete(requestId)

      if (msg.type === 'ERROR') {
        pending.reject(new Error(msg.message))
      } else {
        pending.resolve(msg.payload)
      }
      return
    }

    // Otherwise broadcast to subscribers
    this.handlers.forEach(h => h(msg))
  }
}

export const socketService = new SocketService();