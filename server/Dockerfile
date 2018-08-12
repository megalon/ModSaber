# Alpine Node Image
FROM node:10-alpine

# Create app directory
WORKDIR /usr/app

# Copy package info
COPY package.json package-lock.json ./

# Install app dependencies
RUN apk add --no-cache tini bash git openssh && \
  npm ci && \
  apk del bash git openssh

# Bundle app source
COPY . .

# Start Node.js
EXPOSE 3000
VOLUME ["/usr/app/src/store"]
VOLUME ["/usr/app/src/logs"]
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "."]
