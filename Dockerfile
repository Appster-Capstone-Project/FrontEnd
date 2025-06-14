# 1. Use Node base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy rest of the app
COPY . .

# 5. Expose Next.js port
EXPOSE 9002

# 6. Run in development mode
CMD ["npm", "run", "dev"]
