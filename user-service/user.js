const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const users = []; // base en mémoire

const userProtoPath = 'user.proto';
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const userService = {
  createUser: (call, callback) => {
    const { name, email, password } = call.request;

    const user = {
      user_id: uuidv4(),
      name,
      email,
      password,
    };

    users.push(user);

    callback(null, {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    });
  },

  loginUser: (call, callback) => {
    const { email, password } = call.request;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Email ou mot de passe incorrect',
      });
    }

    callback(null, {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    });
  },

  getUserById: (call, callback) => {
    const { user_id } = call.request;
    const user = users.find(u => u.user_id === user_id);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Utilisateur non trouvé',
      });
    }

    callback(null, {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    });
  },

  updateUser: (call, callback) => {
    const { user_id, name, email, password } = call.request;
    const user = users.find(u => u.user_id === user_id);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Utilisateur non trouvé',
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;

    callback(null, {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    });
  },

  deleteUser: (call, callback) => {
    const { user_id } = call.request;
    const index = users.findIndex(u => u.user_id === user_id);

    if (index === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Utilisateur non trouvé',
      });
    }

    users.splice(index, 1);

    callback(null, {
      message: 'Utilisateur supprimé avec succès',
    });
  }
};

const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);

const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Erreur de démarrage :', err);
    return;
  }
  console.log(`✅ User microservice lancé sur le port ${port}`);
});
