FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3003

CMD [ "yarn", "start"]