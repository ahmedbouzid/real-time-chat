# Stage

FROM node:18 As development

WORKDIR /dev2/chatfrontend/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@16.1.5

COPY . .

RUN npm run build

EXPOSE 4200
