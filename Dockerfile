FROM node:26-alpine
WORKDIR /app
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
