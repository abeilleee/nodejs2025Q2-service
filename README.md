# 🎵 Home Library Service

A comprehensive REST API for managing a personal music library with artists, albums, tracks, and favorites.

## 🚀 Technologies & Stack

![NESTJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![](https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/class--validator-000000?style=for-the-badge&logo=&logoColor=white)
![](https://img.shields.io/badge/class--transformer-000000?style=for-the-badge&logo=&logoColor=white)
![](https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![](https://img.shields.io/badge/yaml-CB171E?style=for-the-badge&logo=yaml&logoColor=white)

## 🐳 Quick Start with Docker

1. Clone the repository

```
git clone https://github.com/abeilleee/nodejs2025Q2-service.git
```

2. Configure Environment Variables, create a .env file in the project root

```
copy env.example .env
```

3. Start the Application (open Docker Desktop to run the app)

```
# Build images and start all services
npm run docker:build
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

## 🗄️ Database Management

### Prisma Commands

```
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Apply migrations in production
npm run prisma:deploy

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## 🐋 Docker Configuration

### Services

app - NestJS application (Node.js)

postgres - PostgreSQL database

### Volumes

postgres_data - PostgreSQL data persistence

app_logs - Application logs

### Network

Custom bridge network for secure inter-container communication.

### Check Image Size

```
npm run size:check
```

## 📚 API Documentation

After starting the application, you can explore the interactive API documentation with Open API:

```
http://localhost:4000/api
```

Features:

📖 Interactive API documentation

🔍 Test endpoints directly from the browser

📝 Request/Response schemas

🎯 Try-it-out functionality

## 🆘 Troubleshooting

### Database Connection Issues

```
# Check running containers
docker-compose ps

# Check database logs
docker-compose logs postgres

# Recreate containers
npm run docker:down
npm run docker:up
```

### Migration Issues

```
# Reset database (use with caution)
docker-compose down -v
docker-compose up -d
docker-compose exec app npm run prisma:migrate
```

## 🧪 Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

## 🔧 Auto-fix and format

```
npm run lint
```

```
npm run format
```
