FROM node:16-alpine
RUN apk add --no-cache python3 make g++ 
WORKDIR /app
COPY package*.json ./
USER node
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "./db.js"]
