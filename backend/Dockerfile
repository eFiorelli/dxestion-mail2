FROM node:10.12-slim

#Create app directory
WORKDIR /user/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN mkdir server/config/ssl_certs
RUN npm install pm2 -g

ENV NODE_ENV prod
ENV MONGO_URI mongodb://mongo:27017/nuClient
ENV DB_USERNAME nuclient1
ENV DB_PWD nuclient.1/1
ENV DB_NAME nuClient
ENV SEED dxestion0180-nuclient

EXPOSE 3000 8080

# CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "server/server.js" ]
