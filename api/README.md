# Polymap API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-7.x-red)](https://mongoosejs.com/)
[![Typegoose](https://img.shields.io/badge/Typegoose-7.x-blue)](https://typegoose.github.io/typegoose/)
[![Redis](https://img.shields.io/badge/Redis-6.x-brightred)](https://redis.io/)


A REST API for managing geospatial data, built with Node.js, TypeScript and Clean Architecture.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a96044e3-3f8d-4d02-9856-75c292489c5b" width="400">
</p>

---

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Testing**: Jest + Supertest
- **Cache**: Redis
- **Logging**: Winston
- **Architecture**: Clean Architecture

---

## ⚙️ Installation & Running

### Clone the repository:
```bash
git clone https://github.com/caetanojpo/polymaps.git
```

### Access folder:
```bash
cd polymaps/api
```

### Install dependencies:
```bash
npm install
```

❗ You will need to configure the DB connection string in the `.env` file.

### Run the application:
```bash
npm run dev
```
The npm run dev command will automatically start the application along with the Docker containers using docker-compose up -d.
Alternatively, if you prefer, you can manually run the Docker containers with:
```bash
docker-compose up -d
```

---

## 🔧 Configuration

Create a `.env` file using the `.env.example` template. Replace placeholders with actual values:
```bash
# Server settings
PORT=8000
NODE_ENV=dev
LOG_LEVEL=info

# Database settings
DB_URI=mongodb://admin:admin@localhost:27017/oz_test?authSource=admin
DB_USER=admin
DB_PASS=oz_test

# CORS allowed origins
ALLOWED_ORIGINS=*

#AUTH
JWT_SECRET="oz_test123"
```

---

## 🧪 Testing

Run unit tests with Jest and Supertest:
```bash
npm test
```

---

## 📚 Documentation
Interactive Swagger:
``` bash
http://localhost:8000/docs/#/
```
Postman Collection:

You can access it directly from my drive:

```
https://drive.google.com/drive/folders/1lFwFZmqbQq1Zpypab4zF8njVtQFWcQfj?usp=sharing
```

---
## 📚 API Endpoints

### 1. Authentication
#### Base URL: `/api/v1/login`

- **POST** `/api/v1/login` - User login - ❌ No Authentication required

  Body Example:
  ``` json
  {
      "email": "test@test.com",
      "password": "Test123!"
  }
  ```

### 2. Users
#### Base URL: `/users`

- **POST** `/api/v1//users` - Create a new user - ❌ No Authentication required

  Body Example:
  ``` json
  {
      "name": "User Test",
      "email": "test@test.com",
      "password": "Test123!",
      "address": "Rio Brilhante, Região Geográfica Imediata de Dourados, Região Geográfica Intermediária de Dourados, Mato Grosso do Sul, Região Centro-Oeste, Brasil"
  }
  ```
  
- **GET** `/api/v1//users/:id` - Get user details by ID - ✅ Requires Authentication
  
- **GET** `/api/v1//users/email` - Get user details by Email - ✅ Requires Authentication
  
- **GET** `/api/v1//users` - Get all users - ✅ Requires Authentication
  
- **PUT** `/api/v1//users/:id` - Update user details  ✅ Requires Authentication

  Body Example:
  ``` json
  {
      "name": "tester",
      "address": "Rio Brilhante, Região Geográfica Imediata de Dourados, Região Geográfica Intermediária de Dourados, Mato Grosso do Sul, Região Centro-Oeste, Brasil"
  }
  ```
  
- **DELETE** `/api/v1//users/:id` - Delete user  ✅ Requires Authentication
  - Can have query hardDelete (boolean) `/api/v1//users/:id?hardDelete=false`

### 3. Regions
#### Base URL: `/api/v1/regions`

- **POST** `/api/v1/regions` - Save a new region  ✅ Requires Authentication

  Body Example:
  ``` json
  {
      "name": "Springfield Park",
      "coordinates": [
          [
              [
                  -122.431297,
                  37.773972
              ],
              [
                  -122.431300,
                  37.773975
              ],
              [
                  -122.431305,
                  37.773980
              ],
              [
                  -122.431297,
                  37.773972
              ]
          ]
      ],
      "owner": "67d2dcad534545aeb6ee7324"
  }
  ```
  
- **GET** `/api/v1/regions/:id` - Get region details  ✅ Requires Authentication
  
- **GET** `/api/v1/regions` - Get all regions  ✅ Requires Authentication
  - Can have query ownerId(string) to filter all regions from a user `/api/v1/regions?ownerId=67cf53eb9a14fd0f65e9496a`
    
- **POST** `/api/v1/regions/containing-point` - List all regions containg the informed point -  ✅ Requires Authentication

  Body Example:
  ``` json
  {
      "latitude":  -73.965355,
      "longitude": 40.782865
  }
  ```
  
- **POST** `/api/v1/regions/near` - List all regions near the informed point -  ✅ Requires Authentication
  - Can have query maxDistance(number) to set the distance for searching reagion `/api/v1/regions/near?maxDistance=5000`
  - Can have query ownerId(string) to filter all regions from a user  `api/v1/regions/near?maxDistance=5000&ownerId=67cf6230187563f281e9496a`
  
  Body Example:
  ``` json
  {
      "latitude":  -73.965355,
      "longitude": 40.782865
  }
  ```
    
- **PUT** `/api/v1/regions/:id` - Update region data  ✅ Requires Authentication

  Body Example:
  ``` json
  {
      "name": "Springfield Park Updated",
      "coordinates": [
          [
              [
                  -73.965355,
                  40.782865
              ],
              [
                  -73.965760,
                  40.783118
              ],
              [
                  -73.965370,
                  40.783375
              ],
              [
                  -73.965355,
                  40.782865
              ]
          ]
      ]
  }
  ```
  
- **DELETE** `/api/v1/regions/:id` - Delete a region  ✅ Requires Authentication
  - Can have query hardDelete (boolean) `/api/v1//users/:id?hardDelete=false`
    
---

## 📐 Architecture
Application structure:
``` bash
src/
├── application/
│   ├── dtos/
│   ├── use-cases/
├── config/
│   ├── locales/
│   ├── swagger/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── exceptions/
│   ├── types/
├── infrastructure/
│   ├── database/
│   │   ├── repositories/
│   │   ├── schemas/
│   ├── mappers/
│   ├── middlewares/
│   ├── services/
│   ├── validators/
├── presentation/
│   ├── controllers/
│   ├── routes/
├── utils/
tests/
├── integration/
├── mocks/
├── unit/
│   ├── controller/
│   ├── middlewares/
│   ├── repository/
│   ├── services/
│   ├── use-case/
│   ├── validators/
app.ts
index.ts
server.ts
docker-compose.yaml
```

---

### 🧑‍💻 Redis Cache
Redis is used in the Polymap API for caching frequently requested data, improving response time and reducing the load on the database.

Example usage:
```typescript
export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
    const key = `__express__${req.originalUrl}`;

    try {
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            res.send(JSON.parse(cachedData));
            return;
        } else {
            const originalSend = res.send.bind(res);

            res.send = (body: any): Response => {
                redisClient.set(key, JSON.stringify(body), { EX: 60 }).catch(console.error);
                return originalSend(body);
            };

            next();
        }
    } catch (err) {
        console.error("Cache middleware error:", err);
        next();
    }
}
```

---

## ⚙️ Additional Features
### Rate Limiting
To prevent abuse, the API uses a Redis-based rate limiter that restricts the number of requests per IP within a defined time window. This ensures fair usage and protects the server from overload.

### Graceful Shutdown
The API implements graceful shutdown, allowing active requests to complete before the server shuts down, minimizing disruptions during restarts or deployments.

### Clean Architecture
The API follows Clean Architecture, separating the application into layers for better maintainability and scalability:

- Presentation Layer: Manages HTTP requests and responses.
- Domain Layer: Contains core business logic and entities.
- Application Layer: Orchestrates use cases and business rules.
- Infrastructure Layer: Handles external systems like databases and caching (Redis).
- This structure ensures flexibility, testability, and ease of scaling.
---

## 🎉 Thank you for your interest!
I really appreciate your time exploring my API. If you have any questions, feedback, or run into any issues, feel free to reach out! 🚀

## 📬 Contact Information:
- Email: caetanojpo@gmail.com
- GitHub: https://github.com/caetanojpo
- LinkedIn: https://www.linkedin.com/in/caetanojpo

Looking forward to hearing from you!

