import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocket(server: any): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join-admin", () => {
        socket.join("admin");
        console.log("Admin joined:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return io;
}

export function getSocket(): SocketIOServer | null {
  return io;
}

export function emitNewOrder(order: any): void {
  if (io) {
    io.to("admin").emit("new-order", {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.name,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items?.length || 0,
    });
  }
}
