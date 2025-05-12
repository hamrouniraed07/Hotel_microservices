const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

const sendWelcomeMessage = async (user) => {
  await producer.connect();
  await producer.send({
    topic: 'user-login',
    messages: [
      { value: `Welcome ${user.name}!` }
    ]
  });
  await producer.disconnect();
};

module.exports = sendWelcomeMessage;
