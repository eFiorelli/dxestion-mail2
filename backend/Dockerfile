FROM node:10

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

ENV NODE_ENV prod
ENV MONGO_URI mongodb://mongo:27017/angular-node-test

EXPOSE 3000 8081

CMD [ "npm", "start" ]