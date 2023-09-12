FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

RUN yarn run build

EXPOSE 4000

CMD [ "yarn", "run" , "start:prod" ]