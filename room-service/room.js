const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const rooms = [];

const roomProtoPath = 'room.proto';
const roomDef = protoLoader.loadSync(roomProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const roomProto = grpc.loadPackageDefinition(roomDef).room;

const roomService = {
  CreateRoom: (call, callback) => {
    const {  type, price } = call.request;
    const room = { room_id: uuidv4(), type, price };
    rooms.push(room);
    console.log('Room created:', room);
    callback(null, room);
  },

  GetRoomById: (call, callback) => {
    const room = rooms.find(r => r.room_id === call.request.room_id);
    if (!room) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'Room not found' });
    }
    callback(null, room);
  },

  ListRooms: (_, callback) => {
    callback(null, { rooms });
  }
};

const server = new grpc.Server();
server.addService(roomProto.RoomService.service, roomService);

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log(' Room microservice running on port 50053');
});
