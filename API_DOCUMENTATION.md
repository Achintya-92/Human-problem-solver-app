# HPSS REST API Documentation

Base URL: `http://localhost:5000/api`

All requests require `Content-Type: application/json` header.

---

## Authentication

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "username": null,
      "bio": null,
      "avatarUrl": null,
      "createdAt": "2026-05-25T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as signup

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "username": "johndoe",
      "bio": "Software developer",
      "avatarUrl": "https://...",
      "createdAt": "2026-05-25T10:00:00Z",
      "trustScore": {
        "score": 85,
        "helpfulVotes": 45,
        "workedForMeVotes": 32
      },
      "userBadges": [
        {
          "badge": {
            "name": "Rising Star",
            "description": "New member with great solutions"
          }
        }
      ],
      "_count": {
        "problems": 5,
        "solutions": 12
      }
    }
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## Problems

### List Problems
```http
GET /problems?sort=latest&category=coding-tech&q=react&page=1&limit=10
```

**Query Parameters:**
- `sort`: `latest` | `trending` (default: `latest`)
- `category`: category slug (optional)
- `q`: search query (optional)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 50)

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "How to optimize React performance?",
        "description": "My React app is slow...",
        "tags": ["react", "performance"],
        "emotionTag": "frustrated",
        "anonymous": false,
        "imageUrl": null,
        "voiceUrl": null,
        "createdAt": "2026-05-25T10:00:00Z",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "username": "johndoe",
          "avatarUrl": "https://..."
        },
        "category": {
          "id": "uuid",
          "name": "Coding & Tech",
          "slug": "coding-tech"
        },
        "_count": {
          "solutions": 3,
          "votes": 12
        }
      }
    ],
    "total": 125,
    "page": 1,
    "limit": 10
  }
}
```

### Create Problem
```http
POST /problems
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to learn React?",
  "description": "I'm new to React and want to learn best practices...",
  "categorySlug": "coding-tech",
  "tags": ["react", "javascript", "learning"],
  "anonymous": false,
  "emotionTag": "curious",
  "imageUrl": "https://example.com/image.jpg",
  "voiceUrl": null
}
```

**Response:** Problem object (same structure as above)

### Get Problem Detail
```http
GET /problems/[problemId]
```

**Response:**
```json
{
  "data": {
    "problem": {
      ...problem details...,
      "solutions": [
        {
          "id": "uuid",
          "content": "Here's how to optimize React...",
          "practicalSteps": "1. Use React.memo\n2. Lazy load...",
          "mistakes": "Common mistake is...",
          "timeline": "2-3 weeks",
          "results": "Reduced load time by 60%",
          "proofLinks": ["https://github.com/..."],
          "videoUrl": "https://youtube.com/...",
          "experienceType": "PERSONALLY_EXPERIENCED",
          "createdAt": "2026-05-24T15:30:00Z",
          "user": {
            "id": "uuid",
            "name": "Expert Jane",
            "username": "expertjane",
            "avatarUrl": "https://..."
          },
          "votes": [
            {
              "targetType": "SOLUTION_HELPFUL",
              "count": 45
            },
            {
              "targetType": "SOLUTION_WORKED_FOR_ME",
              "count": 32
            }
          ]
        }
      ]
    }
  }
}
```

### Add Solution
```http
POST /problems/[problemId]/solutions
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Here's my experience...",
  "practicalSteps": "Step 1: ...\nStep 2: ...",
  "mistakes": "Avoid doing...",
  "timeline": "3-4 weeks",
  "results": "Successfully implemented",
  "proofLinks": ["https://github.com/project"],
  "videoUrl": "https://youtube.com/video",
  "experienceType": "PERSONALLY_EXPERIENCED"
}
```

### Vote on Solution
```http
POST /problems/[problemId]/solutions/[solutionId]/vote
Authorization: Bearer {token}
Content-Type: application/json

{
  "kind": "helpful"  // or "worked" or "misleading"
}
```

---

## Experts

### List Experts
```http
GET /experts?category=coding-tech&verified=true&page=1&limit=10
```

**Query Parameters:**
- `category`: category slug (optional)
- `verified`: `true` | `false` (optional)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 50)

**Response:**
```json
{
  "data": {
    "experts": [
      {
        "id": "uuid",
        "specializations": ["React", "Node.js"],
        "yearsOfExperience": 8,
        "hourlyRate": 60,
        "bio": "Full-stack developer...",
        "profilePhotoUrl": "https://...",
        "averageRating": 4.8,
        "totalConsultations": 42,
        "completedConsultations": 41,
        "isVerified": true,
        "consultationTypes": ["CHAT", "VIDEO"],
        "user": {
          "id": "uuid",
          "name": "Expert Bob",
          "username": "expertbob",
          "avatarUrl": "https://..."
        },
        "category": {
          "name": "Coding & Tech",
          "slug": "coding-tech"
        }
      }
    ],
    "total": 25
  }
}
```

### Get Expert Profile
```http
GET /experts/[expertId]
```

**Response:** Expert object (detailed) with recent consultations

### Get My Expert Profile
```http
GET /experts/me
Authorization: Bearer {token}
```

### Create/Update Expert Profile
```http
PUT /experts/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "specializations": ["React", "Node.js", "TypeScript"],
  "yearsOfExperience": 8,
  "hourlyRate": 60,
  "bio": "Full-stack developer with...",
  "consultationTypes": ["CHAT", "VIDEO"],
  "whatsappLink": "https://wa.me/...",
  "contactEmail": "expert@example.com",
  "bookingLink": "https://calendly.com/expert",
  "categorySlug": "coding-tech"
}
```

---

## Consultations

### Book Consultation
```http
POST /consultations/experts/[expertId]/book
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "VIDEO",  // CHAT, CALL, VIDEO
  "scheduledAt": "2026-05-30T14:00:00Z",
  "notes": "I want to discuss..."
}
```

**Response:**
```json
{
  "data": {
    "consultation": {
      "id": "uuid",
      "type": "VIDEO",
      "status": "PENDING",
      "scheduledAt": "2026-05-30T14:00:00Z",
      "notes": "I want to discuss...",
      "createdAt": "2026-05-25T10:00:00Z",
      "expert": {
        "id": "uuid",
        "hourlyRate": 60,
        "user": {
          "id": "uuid",
          "name": "Expert Bob",
          "email": "bob@example.com"
        }
      },
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

### Get Consultation
```http
GET /consultations/[consultationId]
Authorization: Bearer {token}
```

### List My Consultations (as user)
```http
GET /consultations/user/my?page=1&limit=10
Authorization: Bearer {token}
```

### List My Consultations (as expert)
```http
GET /consultations/expert/my?status=PENDING&page=1&limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: `PENDING` | `CONFIRMED` | `COMPLETED` | `CANCELLED` (optional)

### Update Consultation (Expert only)
```http
PATCH /consultations/[consultationId]/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "CONFIRMED",  // PENDING, CONFIRMED, COMPLETED, CANCELLED
  "duration": 60,  // in minutes (for COMPLETED)
  "feedback": "Great session!",  // optional
  "rating": 5,  // 1-5 (for COMPLETED)
  "meetingLink": "https://zoom.us/j/..."
}
```

### Cancel Consultation (User only)
```http
POST /consultations/[consultationId]/cancel
Authorization: Bearer {token}
```

---

## Notifications

### Get Notifications
```http
GET /notifications?page=1&limit=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "SOLUTION_LIKED",
        "message": "John Doe liked your solution",
        "read": false,
        "link": "/problems/uuid",
        "createdAt": "2026-05-25T10:00:00Z",
        "sentBy": {
          "id": "uuid",
          "name": "John Doe",
          "avatarUrl": "https://..."
        }
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

### Get Unread Count
```http
GET /notifications/unread/count
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "unreadCount": 3
  }
}
```

### Mark as Read
```http
PATCH /notifications/[notificationId]/read
Authorization: Bearer {token}
```

### Mark All as Read
```http
POST /notifications/read-all
Authorization: Bearer {token}
```

### Delete Notification
```http
DELETE /notifications/[notificationId]
Authorization: Bearer {token}
```

---

## Categories

### List Categories
```http
GET /categories
```

**Response:**
```json
{
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Coding & Tech",
        "slug": "coding-tech",
        "createdAt": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## Users

### Get User Profile
```http
GET /users/[userId]
```

or by username:
```http
GET /users/[username]
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "username": "johndoe",
      "bio": "Developer",
      "avatarUrl": "https://...",
      "createdAt": "2026-05-25T10:00:00Z",
      "trustScore": {
        "score": 85,
        "helpfulVotes": 45
      },
      "userBadges": [...],
      "recentProblems": [...],
      "recentSolutions": [...]
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

**Common Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API is rate-limited:
- **General**: 30 requests/second per IP
- **Auth**: 10 requests/second per IP
- Limits reset every 60 seconds

**Headers:**
- `X-RateLimit-Limit`: Max requests
- `X-RateLimit-Remaining`: Requests left
- `X-RateLimit-Reset`: Reset timestamp

---

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days (configurable).

---

## Examples

### Complete Flow

1. **Sign up**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123",
    "name": "John Doe"
  }'
```

2. **Get current user**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

3. **List problems**
```bash
curl "http://localhost:5000/api/problems?category=coding-tech"
```

4. **Create problem**
```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "How to learn React?",
    "description": "...",
    "categorySlug": "coding-tech",
    "tags": ["react"]
  }'
```

---

For more examples, see Postman collection: [Link to collection]
