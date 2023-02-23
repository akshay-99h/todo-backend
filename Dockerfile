# setting the node version to fetch
FROM node:16

# setting the working directory
WORKDIR /app

# specifying to node that we are working in a production env
ENV NODE_ENV production

# copying the package.json and package-lock.json to the working directory
# \* is used for pattern matching
COPY package*.json ./

# installing the dependencies
RUN npm install

# copying the rest of the files to the working directory
# first dot is for copying from directory and second is for copying to
COPY . .

# installing pm2 that is used in production envs to ensure that an app does not crash 
# while in prod as in case of npm
RUN npm install -g pm2

# exposiong the port
EXPOSE 3000

CMD ["pm2-runtime","index.js"]
