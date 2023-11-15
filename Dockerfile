FROM node:16.14-alpine

WORKDIR /cinema-backend

EXPOSE 3071

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]