import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificacionesGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usuariosConectados = new Map<number, string[]>(); // usuarioId -> socketIds[]

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET', 'secret');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      const usuarioId = payload.sub;
      client.data.usuarioId = usuarioId;

      // Agregar socket a la lista de conexiones del usuario
      if (!this.usuariosConectados.has(usuarioId)) {
        this.usuariosConectados.set(usuarioId, []);
      }
      this.usuariosConectados.get(usuarioId)!.push(client.id);

      console.log(`✅ Usuario ${usuarioId} conectado (socket: ${client.id})`);
      console.log(`📊 Usuarios conectados: ${this.usuariosConectados.size}`);
    } catch (error) {
      console.error('❌ Error en autenticación WebSocket:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const usuarioId = client.data.usuarioId;

    if (usuarioId && this.usuariosConectados.has(usuarioId)) {
      const sockets = this.usuariosConectados.get(usuarioId);

      if (sockets) {
        const index = sockets.indexOf(client.id);

        if (index > -1) {
          sockets.splice(index, 1);
        }

        if (sockets.length === 0) {
          this.usuariosConectados.delete(usuarioId);
        }
      }

      console.log(`❌ Usuario ${usuarioId} desconectado (socket: ${client.id})`);
      console.log(`📊 Usuarios conectados: ${this.usuariosConectados.size}`);
    }
  }

  // Enviar notificación a un usuario específico
  enviarNotificacionAUsuario(usuarioId: number, notificacion: any) {
    const sockets = this.usuariosConectados.get(usuarioId);

    if (sockets && sockets.length > 0) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('nueva-notificacion', notificacion);
      });
      console.log(`📬 Notificación enviada a usuario ${usuarioId} (${sockets.length} conexiones)`);
    } else {
      console.log(`⚠️ Usuario ${usuarioId} no está conectado`);
    }
  }

  // Enviar notificación a múltiples usuarios
  enviarNotificacionAUsuarios(usuariosIds: number[], notificacion: any) {
    usuariosIds.forEach((usuarioId) => {
      this.enviarNotificacionAUsuario(usuarioId, notificacion);
    });
  }

  // Broadcast a todos los usuarios conectados
  enviarNotificacionATodos(notificacion: any) {
    this.server.emit('nueva-notificacion', notificacion);
    console.log(`📢 Notificación broadcast a todos los usuarios`);
  }
}
