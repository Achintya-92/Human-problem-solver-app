# Visual Architecture Diagram

## Page Structure & Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CATEGORY NAVIGATION BAR                  │
│  🏠 All | 💼 Career | 🧠 Mental Health | 📚 Education | ...│
└─────────────────────────────────────────────────────────────┘
                           ↓ (user clicks)
┌─────────────────────────────────────────────────────────────┐
│                      CATEGORY PAGE                          │
│  ┌─────────────────────────────────────────────────────────┐
│  │ Category Header                                         │
│  │ "Career"                                                │
│  │ Description & "Share Experience" Button                 │
│  └─────────────────────────────────────────────────────────┘
│  ┌──────────────────────┬──────────────────────────────────┐
│  │                      │                                  │
│  │   COMMUNITY FEED     │        SIDEBAR                  │
│  │  (Main Content)      │  ┌─────────────────────────────┐│
│  │                      │  │ AI Recommendations Panel    ││
│  │  [Search Bar]        │  ├─────────────────────────────┤│
│  │                      │  │ Category Stats              ││
│  │  [Problem Card 1]    │  │ • Active members: 1.2K      ││
│  │  [Problem Card 2]    │  │ • Problems: 342             ││
│  │  [Problem Card 3]    │  │ • Solutions: 1.8K           ││
│  │  [Problem Card 4]    │  ├─────────────────────────────┤│
│  │  [Problem Card 5]    │  │ Pro Tips                    ││
│  │                      │  │ Search similar problems     ││
│  │  [Load More...]      │  │ before posting              ││
│  │                      │  └─────────────────────────────┘│
│  │  (Infinite Scroll)   │                                  │
│  │                      │                                  │
│  └──────────────────────┴──────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Community Problem Card Structure

```
┌──────────────────────────────────────────────────────────────┐
│                    USER PROFILE SECTION                      │
│  ┌────────┐                                                  │
│  │ Avatar │ Sarah Chen     ⭐ Trust: 87                      │
│  │        │ @sarahchen    Posted 2 hours ago                │
│  └────────┘                                                  │
├──────────────────────────────────────────────────────────────┤
│                      PROBLEM CONTENT                         │
│                                                              │
│  How to prepare for a technical interview at FAANG?         │
│                                                              │
│  I have an interview coming up at Google next month.         │
│  What are the best resources and strategies to prepare?      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                          TAGS                                │
│  [Career]  [Anxious]  [FAANG]  [preparation]  [interview]   │
├──────────────────────────────────────────────────────────────┤
│                    INTERACTIVE FOOTER                        │
│  💬 23 comments   👍 156 votes   [👍 Like] [👎 Dislike] [💬] │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (layout.tsx)
├── ThemeProvider
├── AuthProvider
├── CategoryNavigation (Global)
│   └── Category tabs with routing
│
└── main
    ├── Home Page (/)
    │   └── HomeFeed
    │       ├── SearchBar
    │       ├── CategoryTabs
    │       └── ProblemCard (original style)
    │
    └── Category Page (/categories/[category])
        └── CategoryPage
            ├── Category Header
            ├── SearchBar
            ├── CommunityFeed
            │   ├── Fetch Logic
            │   ├── Pagination
            │   └── CommunityProblemCard × N
            │       ├── Avatar Section
            │       ├── Content Section
            │       ├── Tags Section
            │       └── Interactive Footer
            └── Sidebar
                ├── AIRecommendationPanel
                ├── CategoryStats
                └── ProTips
```

## Data Flow Diagram

```
User Action
    ↓
┌─────────────────────────────────────┐
│   Click Category in Navigation       │
│   e.g., /categories/career           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   CategoryPage Component Mounts      │
│   - Renders header                   │
│   - Renders search bar               │
│   - Passes category slug to feed     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   CommunityFeed useEffect Triggers   │
│   - Sets page = 1                    │
│   - Makes API call                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   API Request Sent                   │
│   GET /api/problems?category=career  │
│       &page=1&limit=10               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   Response Received                  │
│   Parse: items, total, page, limit   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   State Updated                      │
│   - items: [ProblemListItem...]      │
│   - hasMore: true/false              │
│   - loading: false                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   Render CommunityProblemCard × N    │
│   - Display problem data             │
│   - Attach event handlers            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   User Interacts (Like/Dislike)      │
│   - Click like button                │
│   - API POST /api/problems/{id}/vote │
│   - Update local state               │
│   - Visual feedback                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   Infinite Scroll Triggered          │
│   - User scrolls down                │
│   - Load more problems               │
│   - Append to existing items         │
└─────────────────────────────────────┘
```

## File Organization

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout with CategoryNav
│   │   ├── page.tsx                      ← Home page
│   │   ├── globals.css                   ← Theme variables & styles
│   │   └── categories/
│   │       ├── layout.tsx                ← Category layout wrapper
│   │       └── [category]/
│   │           └── page.tsx              ← Dynamic category page
│   │
│   ├── components/
│   │   ├── CategoryNavigation.tsx        ← Global category tabs
│   │   ├── CategoryPage.tsx              ← Category page template
│   │   ├── CommunityFeed.tsx             ← Infinite scroll feed
│   │   ├── CommunityProblemCard.tsx      ← Problem card with profile
│   │   ├── pages/
│   │   │   └── HomeFeed.tsx              ← Enhanced home feed
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   │
│   └── lib/
│       ├── api.ts                        ← API client
│       ├── types.ts                      ← TypeScript types
│       └── ...
│
├── TAB_STRUCTURE_DOCUMENTATION.md      ← Detailed documentation
├── QUICK_START_TABS.md                 ← Quick start guide
└── API_DATA_FORMATS.md                 ← API reference
```

## Theme & Styling System

```
CSS Variables (globals.css)
    ↓
Tailwind Config (tailwind.config.js)
    ↓
Component Classes
    ↓
┌─────────────────────────────────────┐
│ Light Mode                          │
│ --primary: #3B82F6 (Blue)          │
│ --background: #FFFFFF              │
│ --foreground: #111827              │
└─────────────────────────────────────┘
       OR
┌─────────────────────────────────────┐
│ Dark Mode (.dark)                   │
│ --primary: #3B82F6 (Blue)          │
│ --background: #09090B              │
│ --foreground: #F4F4F5              │
└─────────────────────────────────────┘
    ↓
Components render with
<div className="bg-[rgb(var(--primary))]">
```

## User Journey Map

```
NEW USER
    ↓
1. Land on Home Page (/)
    ↓
2. See Category Navigation Bar
    ↓
3. Click "Career" Category
    ↓
4. Navigate to /categories/career
    ↓
5. See Category Header + Description
    ↓
6. Browse Problems in Feed
    ↓
7. Read Problem Cards
    ├── See user profile
    ├── Read problem description
    ├── View tags
    └── See interaction counts
    ↓
8. Interact with Problems
    ├── Like helpful problems
    ├── Flag misleading problems
    └── Click to view full discussion
    ↓
9. Search for Similar Problems
    ├── Type in search bar
    ├── See filtered results
    └── Check if solution exists
    ↓
10. Click "Share Experience"
    ├── Navigate to problem creation
    ├── Post own problem
    └── Help other community members

RETURNING USER
    ↓
1. Visit site
    ↓
2. See personalized feed
    ↓
3. Browse/interact with problems
    ↓
4. Build reputation through helpful votes
    ↓
5. Earn trust badges
```

## Performance Considerations

```
Initial Load
├── Load Category Navigation (static)
├── Render category page skeleton
├── Fetch problems (page 1, limit 10)
└── Load 1st set of cards

Subsequent Interactions
├── Type in search → Debounce → New fetch
├── Click category → Reset pagination → Fetch
├── Scroll down → Load next page (append)
├── Like button → Optimistic update → API call
└── Dislike button → Optimistic update → API call

Caching
├── Categories (revalidate on mount)
├── Problems (new fetch on category change)
├── User data (cached in auth provider)
└── Votes (optimistic update, sync with API)
```

---

This visual architecture shows how all components work together to create a cohesive community solutions platform.
