FROM node:18.16.0-alpine3.17

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+) and yarn.lock because we are using yarn
COPY package*.json yarn.lock ./

# Run yarn without generating a yarn.lock file
RUN yarn --pure-lockfile
COPY . .

EXPOSE 8000

CMD [ "yarn", "dev" ]