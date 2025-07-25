# 1. Use Node base image
FROM node:18-alpine

# 2. Install OpenSSL (needed for cert gen)
RUN apk add --no-cache openssl

# 3. Set working directory
WORKDIR /app

# 4. Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# 5. Copy rest of the app including custom server
COPY . .

# 6. Expose HTTPS port
EXPOSE 443

# 7. Start the app with custom server
CMD ["npm", "run", "dev:https"]
