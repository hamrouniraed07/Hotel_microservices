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
