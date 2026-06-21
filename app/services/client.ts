import { Role, type JoinRaceSessionResponse } from "@exium1/nex-gate-local-shared"
import { SocketService } from "~/services/socket"

export class Client {
  id: string | null = null
  role: Role = Role.SPECTATOR
  socket: SocketService = new SocketService()

  async join(): Promise<JoinRaceSessionResponse> {
    await this.socket.connect()  // waits for onopen before resolving

    try {
      const res = await this.socket.request<JoinRaceSessionResponse>('JOIN', {
        role: Role.DIRECTOR
      })
      this.role = res.client.role;
      return res;
    } catch (e) {
      console.log(e);
      throw new Error("Couldn't join from client.")
    }
  }

  leave() {
    this.socket.disconnect();
  }
}

export const client = new Client();