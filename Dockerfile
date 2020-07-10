FROM node:12.18.0

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package.json .

RUN npm install

COPY . .