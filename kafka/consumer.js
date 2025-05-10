const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'login-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-login', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(` Message Kafka reçu : ${message.value.toString()}`);
    },
  });
};

run().catch(console.error);
