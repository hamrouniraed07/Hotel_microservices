const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// ✅ Chemins vers les fichiers .proto (strings, pas require)
const userProtoPath = './protos/user.proto';
const reservationProtoPath = './protos/reservation.proto';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Charger les fichiers proto
const userProtoDef = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProtoDef = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userProtoDef).user;
const reservationProto = grpc.loadPackageDefinition(reservationProtoDef).reservation;

// Clients gRPC
const clientUsers = new userProto.UserService('user-service:50051', grpc.credentials.createInsecure());
const clientReservations = new reservationProto.ReservationService('reservation-service:50052', grpc.credentials.createInsecure());

// Serveur Apollo
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server));
});

// Routes REST optionnelles (si tu veux avoir REST + GraphQL)

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

const port = 3000;
app.listen(port, () => {
  console.log(`🚪 API Gateway running on port ${port}`);
});
