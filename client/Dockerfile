# Alpine Node Image
FROM node:10-alpine

# Create app directory
WORKDIR /usr/app

# Copy package info
COPY package.json package-lock.json ./

# Install app dependencies
RUN apk add --no-cache bash git openssh tini && \
  npm ci && \
  apk del bash git openssh

# Bundle app source
COPY . .

# Build Source
RUN npm run lint && \
  npm run build

# Expose port and run
EXPOSE 3002
ENV NODE_ENV=production
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./ssr/bootstrap.js"]
