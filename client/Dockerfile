# Alpine Node Image
FROM node:10-alpine as builder

# Create app directory
WORKDIR /usr/app

# Copy package info
COPY package.json package-lock.json ./

# Install app dependencies
RUN apk add --no-cache bash git openssh && \
  npm ci && \
  apk del bash git openssh

# Bundle app source
COPY . .

# Build Source
RUN npm run lint && \
  npm run build

# Web Server
FROM nginx:alpine

# Copy Prod Build
COPY --from=builder /usr/app/build /usr/share/nginx/html

# Expose port and run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
