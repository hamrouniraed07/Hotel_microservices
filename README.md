# 🏨 Hotel Microservices Project

Ce projet est une application de réservation d'hôtel construite en **architecture microservices**, en utilisant **gRPC**, **GraphQL**, **REST**, et **Docker**.

---

## 📦 Microservices

### 1. `user-service`
- Gère les utilisateurs : création, login, modification, suppression
- Exposé via **gRPC**
- Port : `50051`

### 2. `reservation-service`
- Gère les réservations d’hôtel : création, consultation, annulation
- Exposé via **gRPC**
- Port : `50052`

### 3. `apiGateway`
- Sert d’**API Gateway REST & GraphQL**
- Communique avec les services via gRPC
- Exposé sur le port `3000`

---

## ⚙️ Technologies utilisées

- Node.js
- Express
- Apollo Server (GraphQL)
- gRPC & Protocol Buffers
- Docker & Docker Compose


---



