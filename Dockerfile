FROM node:20-slim

WORKDIR /app

# Salin dependencies manifest
COPY package*.json tsconfig.json ./

# Install dependensi dan build TypeScript
RUN npm install
COPY . .
RUN npm run build

# Cloud Run inject variable PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Jalankan server dalam mode HTTP
CMD ["npm", "run", "start:http"]
