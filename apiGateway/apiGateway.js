const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config(); 

const { queryLLMWithImage } = require('./llmClient'); 

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const userProtoPath = './protos/user.proto';
const reservationProtoPath = './protos/reservation.proto';
const roomProtoPath = './protos/room.proto';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load proto files
const userProtoDef = protoLoader.loadSync(userProtoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const reservationProtoDef = protoLoader.loadSync(reservationProtoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const roomProtoDef = protoLoader.loadSync(roomProtoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

const userProto = grpc.loadPackageDefinition(userProtoDef).user;
const reservationProto = grpc.loadPackageDefinition(reservationProtoDef).reservation;
const roomProto = grpc.loadPackageDefinition(roomProtoDef).room;

// gRPC Clients
const clientUsers = new userProto.UserService('user-service:50051', grpc.credentials.createInsecure());
const clientReservations = new reservationProto.ReservationService('reservation-service:50052', grpc.credentials.createInsecure());
const clientRooms = new roomProto.RoomService('room-service:50053', grpc.credentials.createInsecure());

// Apollo GraphQL
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  app.use('/graphql', expressMiddleware(server));
});

// ===== REST ROUTES =====

// --- User ---
app.get('/users/:id', (req, res) => {
  clientUsers.GetUserById({ user_id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  clientUsers.CreateUser({ name, email, password }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  clientUsers.LoginUser({ email, password }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

// --- Reservation ---
app.post('/reservations', (req, res) => {
  const { user_id, room_number, start_date, end_date } = req.body;
  clientReservations.CreateReservation({ user_id, room_number, start_date, end_date }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.get('/reservations/:id', (req, res) => {
  clientReservations.GetReservationById({ reservation_id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.get('/reservations/user/:user_id', (req, res) => {
  clientReservations.GetReservationsByUser({ user_id: req.params.user_id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.reservations);
  });
});

app.delete('/reservations/:id', (req, res) => {
  clientReservations.CancelReservation({ reservation_id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json({ message: response.message });
  });
});

// --- Room ---
app.post('/rooms', (req, res) => {
  const { room_number, type, price } = req.body;
  clientRooms.CreateRoom({ room_number, type, price }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.get('/rooms/:id', (req, res) => {
  clientRooms.GetRoomByNumber({ room_number: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.get('/rooms', (req, res) => {
  clientRooms.ListRooms({}, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.rooms);
  });
});

// --- LLM Endpoint ---
app.post('/llm-image', async (req, res) => {
  const { prompt, imageUrl } = req.body;
  const response = await queryLLMWithImage(prompt, imageUrl);
  res.json({ output: response });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
