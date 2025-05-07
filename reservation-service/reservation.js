const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const reservations = []; // base en mémoire

const reservationProtoPath = 'reservation.proto';
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProto = grpc.loadPackageDefinition(reservationProtoDefinition).reservation;

const reservationService = {
  CreateReservation: (call, callback) => {
    const { user_id, room_number, start_date, end_date } = call.request;

    const reservation = {
      reservation_id: uuidv4(),
      user_id,
      room_number,
      start_date,
      end_date,
    };

    reservations.push(reservation);
    console.log("Réservation créée :", reservation);

    callback(null, reservation);
  },

  GetReservationById: (call, callback) => {
    const { reservation_id } = call.request;
    const reservation = reservations.find(r => r.reservation_id === reservation_id);

    if (!reservation) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    callback(null, reservation);
  },

  GetReservationsByUser: (call, callback) => {
    const { user_id } = call.request;
    const userReservations = reservations.filter(r => r.user_id === user_id);

    callback(null, { reservations: userReservations });
  },

  CancelReservation: (call, callback) => {
    const { reservation_id } = call.request;
    const index = reservations.findIndex(r => r.reservation_id === reservation_id);

    if (index === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    reservations.splice(index, 1);
    console.log(`Réservation ${reservation_id} supprimée`);

    callback(null, { message: 'Réservation annulée avec succès' });
  }
};

const server = new grpc.Server();
server.addService(reservationProto.ReservationService.service, reservationService);

const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Erreur de démarrage du service de réservation :', err);
    return;
  }
  console.log(` Reservation microservice lancé sur le port ${port}`);
});
