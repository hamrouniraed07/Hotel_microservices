const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les protos
const userPackageDef = protoLoader.loadSync('./protos/user.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userPackageDef).user;

const reservationPackageDef = protoLoader.loadSync('./protos/reservation.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProto = grpc.loadPackageDefinition(reservationPackageDef).reservation;

// Créer les clients gRPC
const userClient = new userProto.UserService('user-service:50051', grpc.credentials.createInsecure());
const reservationClient = new reservationProto.ReservationService('reservation-service:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    getUserById: (_, { user_id }) => {
      return new Promise((resolve, reject) => {
        userClient.GetUserById({ user_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    getReservationById: (_, { reservation_id }) => {
      return new Promise((resolve, reject) => {
        reservationClient.GetReservationById({ reservation_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    reservationsByUser: (_, { user_id }) => {
      return new Promise((resolve, reject) => {
        reservationClient.GetReservationsByUser({ user_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response.reservations);
        });
      });
    }
  },

  Mutation: {
    createUser: (_, { name, email, password }) => {
      return new Promise((resolve, reject) => {
        userClient.CreateUser({ name, email, password }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    loginUser: (_, { email, password }) => {
      return new Promise((resolve, reject) => {
        userClient.LoginUser({ email, password }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    updateUser: (_, args) => {
      return new Promise((resolve, reject) => {
        userClient.updateUser(args, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    deleteUser: (_, { user_id }) => {
      return new Promise((resolve, reject) => {
        userClient.deleteUser({ user_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response.message);
        });
      });
    },

    createReservation: (_, args) => {
      return new Promise((resolve, reject) => {
        reservationClient.CreateReservation(args, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },

    cancelReservation: (_, { reservation_id }) => {
      return new Promise((resolve, reject) => {
        reservationClient.CancelReservation({ reservation_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response.message);
        });
      });
    }
  }
};

module.exports = resolvers;
