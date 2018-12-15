FROM node:8

WORKDIR /Users/simon/dockerApp

COPY package*.json ./

COPY . /Users/simon/dockerApp

EXPOSE 3000

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install --yes nodejs
RUN node -v
RUN npm -v
RUN npm install --production

RUN node ./start.js