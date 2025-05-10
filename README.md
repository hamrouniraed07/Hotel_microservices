# 🏨 **Hotel Microservices Project**

Ce projet est une application de **réservation d’hôtel** conçue en **architecture microservices**. Les services sont exposés via **gRPC**, **GraphQL**, **REST**, et **Kafka**, et sont orchestrés à l'aide de **Docker** et **Docker Compose**.

## 🛠️ **Technologies Utilisées**

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework minimal pour la création d'applications web et API RESTful.
- **Apollo Server** : Serveur GraphQL pour exposer les APIs GraphQL.
- **gRPC** : Utilisé pour la communication entre microservices à haute performance avec **Protocol Buffers**.
- **Kafka** : Système de messagerie asynchrone pour la gestion des événements, utilisé pour les notifications.
- **Docker** : Conteneurisation des services pour une gestion et une orchestration simplifiées.
- **Docker Compose** : Pour définir et gérer les services multi-conteneurs.

---

## 📦 **Architecture des Microservices**

### 1. **`user-service`**
Le service **user-service** gère les utilisateurs de l'application. Il offre des fonctionnalités de gestion des utilisateurs comme la création, la connexion, la modification et la suppression de comptes. Ce service est exposé via **gRPC** et utilise Kafka pour envoyer des notifications de bienvenue lors de la connexion d'un utilisateur.

- **Fonctionnalités** :
  - Création d'utilisateur
  - Connexion utilisateur
  - Modification des informations de l'utilisateur
  - Suppression du compte utilisateur
  - Envoi de messages de bienvenue via Kafka
- **Communication** : gRPC, Kafka
- **Port** : `50051`

### 2. **`reservation-service`**
Le service **reservation-service** gère les réservations d'hôtels. Il permet aux utilisateurs de créer, consulter et annuler des réservations. Il est exposé via **gRPC**.

- **Fonctionnalités** :
  - Création d'une réservation
  - Consultation des réservations
  - Annulation des réservations
- **Communication** : gRPC
- **Port** : `50052`

### 3. **`room-service`**
Le service **room-service** gère les chambres d'hôtel. Il permet de créer des chambres, de consulter des informations sur une chambre spécifique et de lister toutes les chambres disponibles.

- **Fonctionnalités** :
  - Création d'une chambre
  - Consultation d'une chambre par ID
  - Liste de toutes les chambres disponibles
- **Communication** : gRPC
- **Port** : `50053`

### 4. **`apiGateway`**
Le **apiGateway** centralise l'accès aux différents microservices. Il expose une API en **REST** et **GraphQL** et interagit avec les services **user-service**, **reservation-service** et **room-service** via gRPC.

- **Fonctionnalités** :
  - Exposition d'APIs **REST** et **GraphQL**
  - Authentification et gestion des utilisateurs
  - Gestion des réservations via l'API GraphQL
  - Communication avec les microservices via gRPC
- **Port** : `3000`

### 5. **Kafka Integration**
Kafka est utilisé pour la communication asynchrone entre les services. Un **producer** envoie un message Kafka lorsque l'utilisateur se connecte, et un **consumer** reçoit ce message pour gérer les notifications.

- **Producer** (envoyé par le `user-service`) :
  - Envoie un message Kafka au topic `user-login` lorsqu'un utilisateur se connecte.
  - Le message contient une notification de bienvenue pour l'utilisateur.

- **Consumer** (dans le `notification-service`) :
  - Écoute les messages du topic `user-login`.
  - Affiche les notifications de bienvenue reçues via Kafka.

---

## 🔧 **Installation et Déploiement**

### Prérequis
Avant de commencer, assurez-vous d'avoir installé **Docker**, **Docker Compose** et **Kafka** sur votre machine.

### 1. **Cloner le projet**
```bash
git clone https://votre-repository.git
cd hotel-microservices
