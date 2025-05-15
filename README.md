# 🏨 Hotel Microservices Project

Ce projet est une application de réservation d’hôtel conçue en **architecture microservices**. Les services sont exposés via **gRPC**, **GraphQL**, **REST**, et **Kafka**, et sont orchestrés à l'aide de **Docker** et **Docker Compose**.

---

## 🛠️ Technologies Utilisées

- **Node.js** : Environnement d'exécution JavaScript côté serveur.  
- **Express** : Framework minimal pour la création d'applications web et API RESTful.  
- **Apollo Server** : Serveur GraphQL pour exposer les APIs GraphQL.  
- **gRPC** : Communication interservices performante via Protocol Buffers.  
- **Kafka** : Système de messagerie pour la communication asynchrone.  
- **Docker** : Conteneurisation des services.  
- **Docker Compose** : Orchestration multi-conteneurs.  
- **OpenRouter + LLMClient (Deepseek Free)** : Intégration d’un chatbot LLM intelligent.  

---

## 📦 Architecture des Microservices

### 1. `user-service`

Gère la création, l’authentification et la gestion des utilisateurs.

- ✅ Création d'utilisateur  
- ✅ Connexion utilisateur  
- ✅ Modification & suppression  
- ✅ Envoi de message de bienvenue via **Kafka**

**Communication** : gRPC, Kafka  
**Port** : `50051`

---

### 2. `reservation-service`

Permet de réserver, consulter et annuler une réservation.

- ✅ Création de réservation  
- ✅ Consultation & annulation  

**Communication** : gRPC  
**Port** : `50052`

---

### 3. `room-service`

Gère les chambres d’hôtel disponibles.

- ✅ Création de chambres  
- ✅ Récupération par ID  
- ✅ Liste des chambres disponibles  

**Communication** : gRPC  
**Port** : `50053`

---

### 4. `apiGateway`

Centralise tous les appels vers les microservices via **REST** et **GraphQL**.

- ✅ APIs REST & GraphQL  
- ✅ Authentification  
- ✅ Gestion des utilisateurs et réservations  

**Communication** : gRPC  
**Port** : `3000`

---

### 5. `notification-service` avec Kafka

**Kafka** permet de transmettre des événements entre services :

- **Producer** (`user-service`) :
  - Envoie un message sur le topic `user-login` à la connexion d’un utilisateur.

- **Consumer** (`notification-service`) :
  - Écoute les notifications et affiche un message de bienvenue.

---

### 6. 🤖 Intégration Chatbot OpenRouter (LLM Deepseek Free)

Un **chatbot intelligent** est intégré dans le projet via **[OpenRouter](https://openrouter.ai/)** et le **LLMClient** pour interagir avec un LLM (modèle : Deepseek Free).

Fonctionnalités :

- Communication avec un agent IA via une route dédiée.
- Utilisation d’une API JS (`llmClient.js`) pour envoyer des messages au LLM.
- Basé sur le modèle Deepseek de OpenRouter avec clé API configurable.
- Exemples : question sur les chambres, aide utilisateur, résumé de réservation, etc.

---

## 🧪 Test de l’API Rooms

Un fichier de test HTML (`test-rooms.html`) est également disponible pour interagir avec l’API des chambres :

- Créer une chambre
- Lister toutes les chambres
- Voir les détails d’une chambre via l'API Gateway (REST ou GraphQL)

---

## 🔧 Installation et Déploiement

### Prérequis

- Docker & Docker Compose  
- Kafka  
- Clé API OpenRouter (gratuite via https://openrouter.ai)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://votre-repository.git
cd hotel-microservices

# 2. Lancer tous les services
docker-compose up --build

# 3. Accéder au gateway
http://localhost:3000
