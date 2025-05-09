# 🏨 **Hotel Microservices Project**

Ce projet est une application de **réservation d’hôtel** conçue en **architecture microservices**. Les services sont exposés via **gRPC**, **GraphQL**, et **REST** et sont orchestrés à l'aide de **Docker** et **Docker Compose**.

## 🛠️ **Technologies Utilisées**

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework minimal pour la création d'applications web et API RESTful.
- **Apollo Server** : Serveur GraphQL pour exposer les APIs GraphQL.
- **gRPC** : Utilisé pour la communication entre microservices à haute performance avec **Protocol Buffers**.
- **Docker** : Conteneurisation des services pour une gestion et une orchestration simplifiées.
- **Docker Compose** : Pour définir et gérer les services multi-conteneurs.

---

## 📦 **Architecture des Microservices**

### 1. **`user-service`**
Le service **user-service** gère les utilisateurs de l'application. Il offre des fonctionnalités de gestion des utilisateurs comme la création, la connexion, la modification et la suppression de comptes. Ce service est exposé via **gRPC**.

- **Fonctionnalités** :
  - Création d'utilisateur
  - Connexion utilisateur
  - Modification des informations de l'utilisateur
  - Suppression du compte utilisateur
- **Communication** : gRPC
- **Port** : `50051`

### 2. **`reservation-service`**
Le service **reservation-service** gère les réservations d'hôtels. Il permet aux utilisateurs de créer, consulter et annuler des réservations. Il est également exposé via **gRPC**.

- **Fonctionnalités** :
  - Création d'une réservation
  - Consultation des réservations
  - Annulation des réservations
- **Communication** : gRPC
- **Port** : `50052`

### 3. **`apiGateway`**
Le **apiGateway** centralise l'accès aux différents microservices. Il expose une API en **REST** et **GraphQL** et interagit avec les services **user-service** et **reservation-service** via gRPC.

- **Fonctionnalités** :
  - Exposition d'APIs **REST** et **GraphQL**
  - Authentification et gestion des utilisateurs
  - Gestion des réservations via l'API GraphQL
  - Communication avec les microservices via gRPC
- **Port** : `3000`

---

## 🔧 **Installation et Déploiement**

### Prérequis
Avant de commencer, assurez-vous d'avoir installé **Docker** et **Docker Compose** sur votre machine.

### 1. **Cloner le projet**
```bash
git clone https://votre-repository.git
cd hotel-microservices
