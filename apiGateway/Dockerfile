FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
 
COPY ./protos ./protos
 
COPY . .

EXPOSE 3000

CMD ["node", "apiGateway.js"]
