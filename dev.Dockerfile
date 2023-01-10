FROM node:19-alpine3.16

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
EXPOSE 3000 9229
CMD npm run start:debug
