let io;

function initSocket(serverIo) {
  io = serverIo;
}

function getIO() {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
}

module.exports = { initSocket, getIO };