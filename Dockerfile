# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

# Build backend image with frontend assets
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
