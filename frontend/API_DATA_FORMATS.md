# API Integration & Data Formats

## Problem List Response Format

### Request:
```
GET /api/problems?category=career&page=1&limit=10&sort=trending&q=job+interview
```

### Response:
```json
{
  "items": [
    {
      "id": "problem_001",
      "title": "How to prepare for a technical interview at a FAANG company?",
      "description": "I have an interview coming up at Google next month. What are the best resources and strategies to prepare?",
      "tags": ["FAANG", "preparation", "interview"],
      "emotionTag": "anxious",
      "anonymous": false,
      "createdAt": "2026-05-24T10:30:00Z",
      "category": {
        "id": "cat_001",
        "name": "Career",
        "slug": "career"
      },
      "user": {
        "id": "user_001",
        "name": "Sarah Chen",
        "username": "sarahchen",
        "avatarUrl": "https://example.com/avatars/sarah.jpg",
        "trustScore": {
          "score": 87,
          "helpfulVotes": 245,
          "workedForMeVotes": 156,
          "misleadingReports": 2
        }
      },
      "_count": {
        "solutions": 12,
        "comments": 23,
        "votes": 156
      }
    },
    {
      "id": "problem_002",
      "title": "Career switch from finance to tech - is it worth it?",
      "description": "I'm thinking about leaving my finance job to learn programming. What should I consider?",
      "tags": ["career-change", "finance", "tech"],
      "emotionTag": "uncertain",
      "anonymous": false,
      "createdAt": "2026-05-23T15:45:00Z",
      "category": {
        "id": "cat_001",
        "name": "Career",
        "slug": "career"
      },
      "user": {
        "id": "user_002",
        "name": "John Rodriguez",
        "username": "johnrodriguez",
        "avatarUrl": "https://example.com/avatars/john.jpg",
        "trustScore": {
          "score": 62,
          "helpfulVotes": 98,
          "workedForMeVotes": 45,
          "misleadingReports": 0
        }
      },
      "_count": {
        "solutions": 8,
        "comments": 31,
        "votes": 89
      }
    }
  ],
  "total": 342,
  "page": 1,
  "limit": 10
}
```

## Vote Submission

### Request:
```
POST /api/problems/{problemId}/vote
Content-Type: application/json

{
  "type": "helpful"
}
```

**Valid types:**
- `"helpful"` - Mark as helpful/upvote
- `"misleading"` - Report as misleading

### Response:
```json
{
  "success": true,
  "voteCount": 157,
  "userVote": "helpful"
}
```

## Remove Vote

### Request:
```
DELETE /api/problems/{problemId}/vote
```

### Response:
```json
{
  "success": true,
  "voteCount": 156
}
```

## Categories List

### Request:
```
GET /api/categories
```

### Response:
```json
{
  "categories": [
    {
      "id": "cat_001",
      "name": "Career",
      "slug": "career"
    },
    {
      "id": "cat_002",
      "name": "Mental Health",
      "slug": "mental-health"
    },
    {
      "id": "cat_003",
      "name": "Education",
      "slug": "education"
    },
    {
      "id": "cat_004",
      "name": "Relationships",
      "slug": "relationships"
    },
    {
      "id": "cat_005",
      "name": "Finance",
      "slug": "finance"
    },
    {
      "id": "cat_006",
      "name": "Health",
      "slug": "health"
    }
  ]
}
```

## TypeScript Types

### ProblemListItem
```typescript
type ProblemListItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  emotionTag?: string | null;
  anonymous: boolean;
  createdAt: string;
  category: Category;
  user: UserMini;
  _count: {
    solutions: number;
    comments: number;
    votes: number;
  };
};
```

### Category
```typescript
type Category = {
  id: string;
  name: string;
  slug: string;
};
```

### UserMini
```typescript
type UserMini = {
  id: string;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  trustScore?: TrustScore | null;
};
```

### TrustScore
```typescript
type TrustScore = {
  score: number;              // 0-100 score
  helpfulVotes: number;       // Times marked helpful
  workedForMeVotes: number;   // Times marked "worked for me"
  misleadingReports: number;  // Misleading reports
};
```

## Component Props

### CommunityFeed
```typescript
interface CommunityFeedProps {
  category?: string;      // e.g., "career"
  searchQuery?: string;   // e.g., "job interview"
}
```

### CommunityProblemCard
```typescript
interface CommunityProblemCardProps {
  problem: ProblemListItem;
}
```

### CategoryPage
```typescript
interface CategoryPageProps {
  categoryName: string;       // e.g., "Career"
  categorySlug: string;       // e.g., "career"
  categoryDescription: string; // Category description
}
```

## Error Handling

All API calls include error handling:

```typescript
api
  .get<{ items: ProblemListItem[] }>("/api/problems")
  .then((data) => {
    // Success - data is typed
  })
  .catch((error) => {
    toast.error(error.message); // Show error toast
    // Fallback state is set (empty array, etc)
  });
```

## Loading States

### Skeleton Loader
While fetching problems, skeleton placeholders are shown:
```
[Avatar] [Name] [Date]
[Title]
[Description line 1]
[Description line 2]
[Tags]
[Buttons]
```

### Empty State
When no problems found:
```
"No problems found"
"Try a different category or search term, or be the first to post."
```

## Pagination

Infinite scroll uses page-based pagination:

```
Request Page 1: /api/problems?page=1&limit=10
Request Page 2: /api/problems?page=2&limit=10
...
```

Continue fetching until `page * limit >= total`

## Query Parameters

| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| `category` | string | No | `"career"` |
| `q` | string | No | `"job interview"` |
| `sort` | string | No | `"trending"` or `"latest"` |
| `page` | number | No | `1` |
| `limit` | number | No | `10` |

## Notes

- Avatar URLs are optional; initials are generated if not provided
- Trust scores above 50 are considered "trusted"
- Emotion tags are set by the system (detected from problem text)
- Anonymous problems hide user profile information
- Vote counts update in real-time on the UI
