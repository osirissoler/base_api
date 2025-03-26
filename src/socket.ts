import { Server as SocketIOServer, Socket as IOSocket } from "socket.io";

import http from "http"

let io: SocketIOServer;

export const initializeSocket = (server: http.Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: IOSocket) => {
    console.log("Client connected");

    socket.on("tableChat", async (item: any) => {
      console.log(item);
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

// Exportar el objeto io para uso en toda la aplicación
export const getSocketIO = () => {
  if (!io) {
    throw new Error("SocketIO not initialized. Call initializeSocket first.");
  }
  return io;
};
