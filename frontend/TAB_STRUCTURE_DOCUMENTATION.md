# Tab Category Structure - Human Problem Solver System

## Overview

This document describes the comprehensive tab-based category structure for the Human Problem Solver System, featuring a Community Solutions Feed inspired by Reddit, Quora, and LinkedIn.

## Architecture

### 1. **Category Navigation Component** (`CategoryNavigation.tsx`)
- **Location**: Global navigation in the header
- **Features**:
  - Sticky horizontal scrollable tabs for all categories
  - Quick navigation between categories
  - Active state highlighting
  - Icons for visual recognition
  - Responsive design (icons only on mobile, full names on desktop)

- **Categories Included**:
  - 🏠 All (Home feed)
  - 💼 Career
  - 🧠 Mental Health
  - 📚 Education
  - 💕 Relationships
  - 💰 Finance
  - 🏋️ Health & Fitness
  - Other

### 2. **Community Feed Component** (`CommunityFeed.tsx`)
- **Features**:
  - Infinite scroll pagination for better UX
  - Dynamic loading with skeleton placeholders
  - Search query support
  - Category filtering
  - Trending/Latest sorting options

- **Props**:
  ```tsx
  interface CommunityFeedProps {
    category?: string;      // Category slug (e.g., "career")
    searchQuery?: string;   // Search term
  }
  ```

### 3. **Community Problem Card Component** (`CommunityProblemCard.tsx`)

The main card component displaying each problem in the feed with rich profile information and interactive elements.

#### Card Structure:

```
┌─────────────────────────────────────────────┐
│ [Avatar] Name | Trust Badge                │
│               Posted 2 hours ago            │
├─────────────────────────────────────────────┤
│ Problem Title                               │
│ Problem description (max 3 lines)           │
│                                             │
│ [Category Tag] [Emotion Tag] [Tag1] [Tag2] │
├─────────────────────────────────────────────┤
│ 💬 5 comments  👍 23 likes                  │
│ [Like] [Dislike] [Comment]                  │
└─────────────────────────────────────────────┘
```

#### User Profile Section:
- **Avatar**: Circular profile image or auto-generated initials
- **Name**: Clickable link to user profile (unless anonymous)
- **Trust Badge**: Visual indicator of user's helpfulness score
- **Posted Time**: Relative time (e.g., "2 hours ago")

#### Content Section:
- **Problem Title**: Main heading, clickable to problem detail page
- **Description**: Short excerpt (3 lines max)
- **Tags**:
  - Category tag (primary color badge)
  - Emotion tag (accent color badge)
  - Additional tags (border badges)

#### Interactive Footer:
- **Stats Display**:
  - Number of comments with icon
  - Number of likes/votes with icon

- **Action Buttons**:
  - 👍 **Like Button**: Toggle helpful vote
    - Active state: Blue background with primary color
    - Functionality: Add/remove helpful vote
    
  - 👎 **Dislike Button**: Toggle misleading report
    - Active state: Red background with red color
    - Functionality: Add/remove misleading vote
    
  - 💬 **Comment Button**: Navigate to problem detail/comments
    - Links to full problem discussion page

#### Interactive Features:
- **Like/Dislike Toggle**: Click to mark as helpful or misleading
- **Vote Counting**: Real-time count updates
- **Active State**: Visual feedback when user has voted
- **Comments Navigation**: Click to view full discussion

### 4. **Category Page Component** (`CategoryPage.tsx`)

A dedicated page for each category showing:

- **Category Header**:
  - Large category title
  - Category description
  - "Share your experience" CTA button

- **Search Bar**: Category-scoped search

- **Community Feed**: Infinite scroll feed of problems

- **Sidebar**:
  - **AI Recommendations Panel**: Contextual AI suggestions
  - **Category Info Card**:
    - Active members count
    - Problems shared count
    - Solutions provided count
  - **Pro Tips Card**: Best practices for the category
  - **General Sidebar**: Navigation and additional info

### 5. **Category Pages** (`/categories/[category]/page.tsx`)

Dynamic pages for each category with:
- Auto-generated static params for all categories
- SEO metadata generation
- Responsive layout
- Error handling for non-existent categories

## File Structure

```
frontend/src/
├── components/
│   ├── CategoryNavigation.tsx       # Global category tabs
│   ├── CategoryPage.tsx             # Category page layout
│   ├── CommunityFeed.tsx            # Infinite scroll feed
│   ├── CommunityProblemCard.tsx     # Individual problem card
│   └── pages/
│       └── HomeFeed.tsx             # Enhanced home feed
├── app/
│   ├── layout.tsx                   # Updated with navigation
│   └── categories/
│       ├── layout.tsx               # Category pages layout
│       └── [category]/
│           └── page.tsx             # Dynamic category page
└── lib/
    └── types.ts                     # TypeScript definitions
```

## Component Data Flow

```
CategoryNavigation
    ↓
(User clicks category)
    ↓
/categories/[category] Page
    ↓
CategoryPage Component
    ↓
├── Search Bar (filters CommunityFeed)
├── CommunityFeed (fetches problems)
│   ├── API: /api/problems?category=...
│   ├── Pagination & Infinite Scroll
│   └── CommunityProblemCard × N
│       ├── User Profile Info
│       ├── Problem Content
│       ├── Tags
│       └── Interactive Buttons
└── Sidebar
    ├── AIRecommendationPanel
    ├── Category Info
    └── Pro Tips
```

## API Integration

### Endpoints Used:

1. **Get Problems List**
   ```
   GET /api/problems?category=career&page=1&limit=10&sort=trending&q=search
   ```
   Response:
   ```json
   {
     "items": [ProblemListItem],
     "total": 342,
     "page": 1,
     "limit": 10
   }
   ```

2. **Vote on Problem**
   ```
   POST /api/problems/{problemId}/vote
   Body: { "type": "helpful" | "misleading" }
   ```

3. **Remove Vote**
   ```
   DELETE /api/problems/{problemId}/vote
   ```

4. **Get Categories**
   ```
   GET /api/categories
   ```

## Features Summary

### Community Solutions Feed Features:

✅ **Scrollable Problem Feed**
- Infinite scroll pagination
- Skeleton loading states
- Empty state handling

✅ **Rich Problem Cards**
- User profile information with avatar
- Trust score badges
- Relative timestamps
- Problem title and description
- Category and emotion tags
- Additional tags

✅ **Interactive Elements**
- 👍 Like/upvote functionality
- 👎 Dislike/report misleading
- 💬 Comment navigation
- Real-time vote count updates
- Active state feedback

✅ **Search & Filter**
- Category-based filtering
- Text search across problems
- Trending vs Latest sorting

✅ **User Experience**
- Responsive design
- Dark/light theme support
- Loading states
- Error handling
- No duplicate problems (users can search before posting)

## Dependencies Added

```json
{
  "date-fns": "^3.0.0",                    // Date formatting
  "react-infinite-scroll-component": "^6.1.0"  // Infinite scroll
}
```

## Styling

All components use the CSS variable system defined in `globals.css`:

- `--primary`: Main action color (blue)
- `--muted`: Background for badges
- `--border`: Border color
- `--card`: Card background
- `--muted-foreground`: Secondary text color

## Best Practices Implemented

1. **Performance**: 
   - Infinite scroll instead of pagination
   - Skeleton loading placeholders
   - Image optimization with Next.js Image

2. **Accessibility**:
   - Semantic HTML
   - ARIA labels on buttons
   - Keyboard navigation support

3. **UX**:
   - Visual feedback on interactions
   - Clear call-to-action buttons
   - Contextual information (trust badges, timestamps)
   - Search before posting to avoid duplicates

4. **Code Organization**:
   - Separated concerns (feed, card, page, navigation)
   - Reusable components
   - Type-safe with TypeScript

## Future Enhancements

- User filtering by expertise level
- Problem bookmarking/saving
- Advanced search filters
- Problem recommendations
- Community moderation tools
- Solution quality ratings
- Expert matching
