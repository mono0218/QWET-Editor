FROM node:18.19.0-slim

WORKDIR /usr/src/app
COPY . .

RUN npm install

RUN apt-get update

RUN apt-get install -y openssl

RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]