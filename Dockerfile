FROM node:18-alpine

WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

EXPOSE 3000

# Run as non-root user (security)
USER node

CMD ["node", "app.js"]