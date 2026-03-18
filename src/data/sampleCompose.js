export const sampleComposeYaml = `version: "3.8"

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - frontend
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - NODE_ENV=production
    depends_on:
      - db
    networks:
      - frontend
      - backend
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - backend
    restart: unless-stopped

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  db-data:
    driver: local
`;
