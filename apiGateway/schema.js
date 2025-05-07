const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type User {
    user_id: String!
    name: String!
    email: String!
  }

  type Reservation {
    reservation_id: String!
    user_id: String!
    room_number: Int!
    start_date: String!
    end_date: String!
  }

  type Query {
    getUserById(user_id: String!): User
    getReservationById(reservation_id: String!): Reservation
    reservationsByUser(user_id: String!): [Reservation]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    updateUser(user_id: String!, name: String, email: String, password: String): User
    deleteUser(user_id: String!): String

    createReservation(user_id: String!, room_number: Int!, start_date: String!, end_date: String!): Reservation
    cancelReservation(reservation_id: String!): String
  }
`;

module.exports = typeDefs;
