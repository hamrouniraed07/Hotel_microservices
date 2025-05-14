FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./protos ./protos

COPY . .

EXPOSE 3000

# Définir les variables d'environnement nécessaires à OpenRouter (optionnel si tu utilises un .env)
ENV OPENROUTER_API_KEY="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"
ENV HTTP_REFERER="http://localhost:3000"
ENV X_TITLE="Hotel Microservices App"

CMD ["node", "apiGateway.js"]
