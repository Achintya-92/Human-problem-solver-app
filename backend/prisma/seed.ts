import { prisma } from "./src/db/prisma";
import bcryptjs from "bcryptjs";

const categories = [
  { name: "Career", slug: "career" },
  { name: "Health", slug: "health" },
  { name: "Relationships", slug: "relationships" },
  { name: "Coding & Tech", slug: "coding-tech" },
  { name: "Education", slug: "education" },
  { name: "Communication Skills", slug: "communication" },
  { name: "Self Improvement", slug: "self-improvement" },
  { name: "Startups & Business", slug: "startups" },
];

const badges = [
  {
    name: "Placement Mentor",
    description: "Helped 10+ people get placements",
  },
  {
    name: "Coding Helper",
    description: "Provided 50+ coding solutions",
  },
  {
    name: "Health Guide",
    description: "Shared health advice that helped others",
  },
  {
    name: "Relationship Advisor",
    description: "Relationship wisdom shared",
  },
  {
    name: "Startup Mentor",
    description: "Mentored startup founders",
  },
  {
    name: "Rising Star",
    description: "New member with great solutions",
  },
];

async function seed() {
  console.log("🌱 Seeding database...\n");

  try {
    // Clear existing data (careful in production!)
    console.log("Clearing existing data...");
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.report.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.consultation.deleteMany();
    await prisma.expert.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.solution.deleteMany();
    await prisma.problem.deleteMany();
    await prisma.trustScore.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    // Seed categories
    console.log("📁 Creating categories...");
    const createdCategories = await Promise.all(
      categories.map((cat) =>
        prisma.category.create({
          data: cat,
        })
      )
    );

    // Seed badges
    console.log("🏆 Creating badges...");
    const createdBadges = await Promise.all(
      badges.map((badge) =>
        prisma.badge.create({
          data: badge,
        })
      )
    );

    // Seed users
    console.log("👥 Creating users...");
    const hashedPassword = await bcryptjs.hash("password123", 10);

    const users = [
      {
        email: "alice@example.com",
        name: "Alice Johnson",
        username: "alice_j",
        bio: "Career coach and mentor with 10+ years in tech",
        role: "EXPERT",
      },
      {
        email: "bob@example.com",
        name: "Bob Smith",
        username: "bob_dev",
        bio: "Full-stack developer passionate about helping others",
        role: "EXPERT",
      },
      {
        email: "carol@example.com",
        name: "Carol Davis",
        username: "carol_health",
        bio: "Health and wellness consultant",
        role: "EXPERT",
      },
      {
        email: "dave@example.com",
        name: "Dave Wilson",
        username: "dave_startup",
        bio: "Startup founder and investor",
        role: "EXPERT",
      },
      {
        email: "emma@example.com",
        name: "Emma Brown",
        username: "emma_user",
        bio: "Student learning to code",
        role: "USER",
      },
      {
        email: "frank@example.com",
        name: "Frank Miller",
        username: "frank_user",
        bio: "Working on personal growth",
        role: "USER",
      },
    ];

    const createdUsers = await Promise.all(
      users.map((user) =>
        prisma.user.create({
          data: {
            ...user,
            passwordHash: hashedPassword,
            trustScore: {
              create: {},
            },
          },
        })
      )
    );

    // Seed expert profiles
    console.log("👨‍💼 Creating expert profiles...");
    const expertUsers = createdUsers.filter((u) => u.role === "EXPERT");

    await prisma.expert.create({
      data: {
        userId: expertUsers[0].id, // Alice
        specializations: ["Career Development", "Job Search", "Interview Prep"],
        yearsOfExperience: 10,
        hourlyRate: 50,
        bio: "I've helped 50+ professionals transition to tech careers",
        isVerified: true,
        consultationTypes: ["CHAT", "CALL", "VIDEO"],
        whatsappLink: "https://wa.me/1234567890",
        contactEmail: "alice@example.com",
        bookingLink: "https://calendly.com/alice",
        categoryId: createdCategories.find((c) => c.slug === "career")?.id,
      },
    });

    await prisma.expert.create({
      data: {
        userId: expertUsers[1].id, // Bob
        specializations: ["React", "Node.js", "Full Stack Development", "Code Review"],
        yearsOfExperience: 8,
        hourlyRate: 60,
        bio: "Full-stack developer with experience in JavaScript, React, and Node.js",
        isVerified: true,
        consultationTypes: ["CHAT", "VIDEO"],
        whatsappLink: "https://wa.me/0987654321",
        contactEmail: "bob@example.com",
        bookingLink: "https://calendly.com/bob",
        categoryId: createdCategories.find((c) => c.slug === "coding-tech")?.id,
      },
    });

    await prisma.expert.create({
      data: {
        userId: expertUsers[2].id, // Carol
        specializations: ["Fitness", "Nutrition", "Mental Health", "Wellness"],
        yearsOfExperience: 12,
        hourlyRate: 45,
        bio: "Certified health and wellness coach",
        isVerified: true,
        consultationTypes: ["CHAT", "CALL"],
        whatsappLink: "https://wa.me/5555555555",
        contactEmail: "carol@example.com",
        bookingLink: "https://calendly.com/carol",
        categoryId: createdCategories.find((c) => c.slug === "health")?.id,
      },
    });

    await prisma.expert.create({
      data: {
        userId: expertUsers[3].id, // Dave
        specializations: ["Startup Strategy", "Fundraising", "Product Launch"],
        yearsOfExperience: 15,
        hourlyRate: 100,
        bio: "Serial entrepreneur with 3 successful exits",
        isVerified: true,
        consultationTypes: ["CALL", "VIDEO"],
        whatsappLink: "https://wa.me/9999999999",
        contactEmail: "dave@example.com",
        bookingLink: "https://calendly.com/dave",
        categoryId: createdCategories.find((c) => c.slug === "startups")?.id,
      },
    });

    // Seed problems
    console.log("❓ Creating sample problems...");
    const careerCategory = createdCategories.find((c) => c.slug === "career");
    const techCategory = createdCategories.find((c) => c.slug === "coding-tech");
    const healthCategory = createdCategories.find((c) => c.slug === "health");

    const problems = [
      {
        title: "How to transition from IT to Software Development?",
        description:
          "I have 5 years of IT support experience but want to become a software developer. What should I do?",
        categoryId: careerCategory?.id!,
        userId: createdUsers.find((u) => u.username === "emma_user")?.id!,
        tags: ["career-change", "learning", "tech"],
        emotionTag: "anxious",
      },
      {
        title: "React performance optimization techniques",
        description: "My React app is slow. What are the best practices for optimization?",
        categoryId: techCategory?.id!,
        userId: createdUsers.find((u) => u.username === "frank_user")?.id!,
        tags: ["react", "performance", "javascript"],
        emotionTag: "frustrated",
      },
      {
        title: "How to build healthy exercise habits?",
        description: "I want to start exercising regularly but keep giving up. Any advice?",
        categoryId: healthCategory?.id!,
        userId: createdUsers.find((u) => u.username === "emma_user")?.id!,
        tags: ["fitness", "habits", "motivation"],
        emotionTag: "determined",
      },
    ];

    const createdProblems = await Promise.all(
      problems.map((problem) =>
        prisma.problem.create({
          data: problem,
        })
      )
    );

    // Seed solutions
    console.log("💡 Creating sample solutions...");
    const solutions = [
      {
        problemId: createdProblems[0].id,
        userId: expertUsers[0].id, // Alice's solution
        content: "I helped many people make this transition. Here's my 3-step approach...",
        practicalSteps: "1. Learn JavaScript fundamentals\n2. Build 3 projects\n3. Apply to junior roles",
        timeline: "3-6 months",
        results: "Successfully transitioned to senior developer role",
        experienceType: "MENTOR",
      },
      {
        problemId: createdProblems[1].id,
        userId: expertUsers[1].id, // Bob's solution
        content: "React performance is all about proper memoization and code splitting...",
        practicalSteps: "1. Profile with DevTools\n2. Use React.memo for components\n3. Lazy load routes",
        timeline: "1-2 weeks",
        results: "Reduced load time from 5s to 1.2s",
        proofLinks: ["https://github.com/example/optimized"],
        experienceType: "PERSONALLY_EXPERIENCED",
      },
      {
        problemId: createdProblems[2].id,
        userId: expertUsers[2].id, // Carol's solution
        content: "Building habits takes 21-66 days. Here's what works...",
        practicalSteps: "1. Start with 15 minutes\n2. Same time daily\n3. Track progress",
        timeline: "8 weeks",
        results: "90% of people who follow this maintain their habits",
        experienceType: "EXPERT",
      },
    ];

    const createdSolutions = await Promise.all(
      solutions.map((solution) =>
        prisma.solution.create({
          data: solution,
        })
      )
    );

    // Add votes
    console.log("👍 Adding votes...");
    await prisma.vote.create({
      data: {
        userId: createdUsers.find((u) => u.username === "frank_user")?.id!,
        solutionId: createdSolutions[0].id,
        targetType: "SOLUTION_HELPFUL",
      },
    });

    // Update trust scores
    console.log("⭐ Updating trust scores...");
    await prisma.trustScore.update({
      where: { userId: expertUsers[0].id },
      data: {
        helpfulVotes: 45,
        workedForMeVotes: 38,
        score: 95,
      },
    });

    // Assign badges
    console.log("🏆 Assigning badges...");
    await prisma.userBadge.create({
      data: {
        userId: expertUsers[0].id,
        badgeId: createdBadges.find((b) => b.name === "Placement Mentor")?.id!,
      },
    });

    // Create sample consultations
    console.log("📅 Creating sample consultations...");
    await prisma.consultation.create({
      data: {
        userId: createdUsers.find((u) => u.username === "emma_user")?.id!,
        expertId: await prisma.expert
          .findFirst({ where: { userId: expertUsers[0].id } })
          .then((e) => e?.id!),
        type: "VIDEO",
        status: "COMPLETED",
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        rating: 5,
        feedback: "Alice was incredibly helpful! Gave me a clear action plan.",
      },
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Expert User (Alice):");
    console.log("  Email: alice@example.com");
    console.log("  Password: password123\n");
    console.log("Regular User (Emma):");
    console.log("  Email: emma@example.com");
    console.log("  Password: password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
