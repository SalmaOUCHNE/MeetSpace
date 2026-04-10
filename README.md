# 🚀 Smart Meeting Room Reservation System (MeetSpace)

A modern full-stack web application for managing and reserving meeting rooms efficiently.  
Built with a professional SaaS-style frontend and a secure Spring Boot backend.

---

## 🧩 Tech Stack

### 🔙 Backend
- Java 17+
- Spring Boot 3.2
- Spring Data JPA
- Spring Security (JWT Authentication)
- MySQL
- Maven
- Lombok

### 🎨 Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Framer Motion (animations)
- ShadCN UI components

---

## ⚙️ Setup Guide

### 1️⃣ Database (MySQL)

Create database:

```sql
CREATE DATABASE meeting_room_db;
```

Or use:

```properties
createDatabaseIfNotExist=true
```

---

### 2️⃣ Backend Configuration

Edit file:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meeting_room_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=9090
```

---

### 3️⃣ Run Backend

```bash
./mvnw spring-boot:run
```

Or run from IntelliJ:

```
MeetingRoomReservationApplication
```

Backend runs on:

```
http://localhost:9090
```

---

### 4️⃣ Run Frontend

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:8082
```

---

## 🔐 Authentication

- JWT-based authentication  
- Token stored in frontend  
- Protected routes for authenticated users  

---

## 👤 Roles

| Role  | Permissions                  |
|-------|-----------------------------|
| USER  | View rooms, reserve, cancel |
| ADMIN | Full CRUD on rooms          |

To make a user ADMIN:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 📡 API Endpoints

### 🔑 Auth (Public)

| Method | URL                  | Description       |
|--------|----------------------|------------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login & get JWT   |

---

### 🏢 Rooms

| Method | URL                                              | Description         |
|--------|--------------------------------------------------|---------------------|
| GET    | `/api/rooms`                                     | Get all rooms       |
| GET    | `/api/rooms/{id}`                                | Get room by ID      |
| GET    | `/api/rooms/available?date=&startTime=&endTime=` | Available rooms     |
| POST   | `/api/rooms`                                     | Create room (ADMIN) |
| PUT    | `/api/rooms/{id}`                                | Update room (ADMIN) |
| DELETE | `/api/rooms/{id}`                                | Delete room (ADMIN) |

---

### 📅 Reservations

| Method | URL                             | Description            |
|--------|---------------------------------|------------------------|
| POST   | `/api/reservations`             | Create reservation     |
| PATCH  | `/api/reservations/{id}/cancel` | Cancel reservation     |
| GET    | `/api/reservations/my`          | Get user reservations  |

---

## 📦 Example Requests

### 🔹 Register

```json
POST /api/auth/register
{
  "name": "Salma Aicha",
  "email": "meetspace@example.com",
  "password": "password123"
}
```

---

### 🔹 Login

```json
POST /api/auth/login
{
  "email": "meetspace@example.com",
  "password": "password123"
}
```

---

### 🔹 Create Reservation

```json
POST /api/reservations
Authorization: Bearer <token>

{
  "roomId": 1,
  "date": "2024-12-20",
  "startTime": "09:00",
  "endTime": "10:30"
}
```

---

## 🖥️ Frontend Pages

| Page               | URL                | Description      |
|--------------------|--------------------|------------------|
| 🏠 Dashboard       | `/dashboard`       | Stats & welcome  |
| 🚪 Rooms           | `/rooms`           | Rooms list       |
| 📅 Reserve         | `/reserve`         | Booking form     |
| 📋 My Reservations | `/my-reservations` | User bookings    |
| 🔍 Available Rooms | `/available-rooms` | Filter by time   |
| ⚙️ Admin Rooms     | `/admin/rooms`     | Manage rooms     |

---

## 🎨 Features

- ✨ Modern SaaS UI Design  
- 📊 Dashboard with statistics  
- 🧠 Smart room availability filtering  
- 🔐 Secure JWT authentication  
- ⚡ Fast frontend (Vite)  
- 🎬 Smooth animations (Framer Motion)  
- 📱 Responsive design  

---

## 📂 Project Structure

```
MeetSpace/
│
├── meeting-room-reservation BACKEND/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
├── smart-room-booker FRONTEND/
│   ├── src/
│   ├── public/
│   └── package.json
```

---

## ⚠️ Important Notes

- Backend must be running before frontend  
- Default backend port: **9090**  
- Frontend auto-connects to backend  
- Without backend → login will fail  

---

## 👩‍💻 Author

**Salma Ouchne** -
**Aicha Zeidane**

---

## ⭐ Project Goal

This project demonstrates:

- Full-stack development (React + Spring Boot)  
- Authentication & authorization (JWT)  
- Clean architecture  
- Modern UI/UX design  
- Real-world SaaS application structure  

---
