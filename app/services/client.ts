import { SocketService } from "~/services/socket"

export enum Role {
  Director = 'director',
  Spectator = 'spectator'
}

export class Client {
  id: string | null = null
  role: Role = Role.Spectator
  socket: SocketService = new SocketService()

  async join(role: Role = Role.Spectator): Promise<void> {
    await this.socket.connect()  // waits for onopen before resolving

    try {
      const res =await this.socket.request<{ role: Role }>('join', { role })
      this.role = res.role;
    } catch (e) {
      throw new Error("Couldn't join from client.")
    }
  }

  leave() {
    this.socket.disconnect();
  }
}

export const client = new Client();