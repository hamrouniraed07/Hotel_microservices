FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# ✅ Copie explicite du dossier contenant les .proto AVANT le reste
COPY ./protos ./protos

# ✅ Puis le reste du code
COPY . .

EXPOSE 3000

CMD ["node", "apiGateway.js"]
