FROM node:16-alpine
RUN apk add --no-cache python3 make g++ 
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json .
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD ["node", "./db.js"]

