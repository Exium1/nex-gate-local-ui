import { SocketService } from "~/services/socket"

export enum Role {
  Director = 'director',
  Spectator = 'spectator'
}

export type JoinResponse = {
  client: {
    id: string,
    role: Role
  },
  session: {
    startedAt: number,
    mode: string
  }
}

export class Client {
  id: string | null = null
  role: Role = Role.Spectator
  socket: SocketService = new SocketService()

  async join(): Promise<JoinResponse> {
    await this.socket.connect()  // waits for onopen before resolving

    try {
      const res = await this.socket.request<JoinResponse>('join', {})
      this.role = res.client.role;
      return res;
    } catch (e) {
      throw new Error("Couldn't join from client.")
    }
  }

  leave() {
    this.socket.disconnect();
  }
}

export const client = new Client();