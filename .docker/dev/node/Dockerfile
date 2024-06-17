FROM node:20.14.0

# install system packages needed to manually build "canvas" dependency. (pre-built is not available to download anymore)
RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /app
