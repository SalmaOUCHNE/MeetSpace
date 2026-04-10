# Smart Meeting Room Reservation System

## Tech Stack
- Java 17+ / Spring Boot 3.2
- Spring Data JPA / Spring Security (JWT)
- MySQL / Maven / Lombok

## Setup

1. **MySQL**: Create database `meeting_room_db` (or let `createDatabaseIfNotExist=true` handle it)
2. **Configure** `src/main/resources/application.properties` with your MySQL credentials
3. **Run**:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or open in IntelliJ IDEA and run `MeetingRoomReservationApplication`

## API Endpoints

### Auth (Public)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Rooms (ADMIN: CUD, USER: Read)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/{id}` | Get room by ID |
| GET | `/api/rooms/available?date=&startTime=&endTime=` | Available rooms |
| POST | `/api/rooms` | Create room (ADMIN) |
| PUT | `/api/rooms/{id}` | Update room (ADMIN) |
| DELETE | `/api/rooms/{id}` | Delete room (ADMIN) |

### Reservations (Authenticated)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/reservations` | Create reservation |
| PATCH | `/api/reservations/{id}/cancel` | Cancel reservation |
| GET | `/api/reservations/my` | My reservations |

### Example: Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Example: Create Reservation
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
