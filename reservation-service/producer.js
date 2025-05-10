const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'reservation-service',
  brokers: ['kafka:9092'] // Correspond au nom du service Docker de Kafka
});

const producer = kafka.producer();

// Connexion à Kafka
const connect = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connecté (reservation-service)');
  } catch (err) {
    console.error('Erreur de connexion Kafka producer :', err);
  }
};

// Envoyer un événement Kafka
const sendReservationEvent = async (event) => {
  try {
    await producer.send({
      topic: 'reservation-events',
      messages: [
        {
          value: JSON.stringify(event),
        }
      ]
    });
    console.log(' Événement envoyé à Kafka :', event);
  } catch (err) {
    console.error('Erreur lors de l\'envoi à Kafka :', err);
  }
};

module.exports = {
  connect,
  sendReservationEvent
};
