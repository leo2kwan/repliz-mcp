FROM node:20-slim

WORKDIR /app

# Salin SEMUA file terlebih dahulu agar folder src/ tersedia
COPY . .

# Install dependencies tanpa memicu skrip prepare/build prematur
RUN npm install --ignore-scripts

# Build TypeScript
RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start:http"]
