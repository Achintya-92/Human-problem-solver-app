import { CategoryPage } from "@/components/CategoryPage";

const CATEGORY_METADATA = {
  career: {
    name: "Career",
    slug: "career",
    description:
      "Navigate career challenges, job transitions, and professional growth. Learn from people who've been there and find practical solutions.",
  },
  "mental-health": {
    name: "Mental Health",
    slug: "mental-health",
    description:
      "Share and explore experiences related to mental wellness, anxiety, depression, and emotional support from a supportive community.",
  },
  education: {
    name: "Education",
    slug: "education",
    description:
      "Get academic help, study tips, and insights from learners and educators. Find solutions to educational challenges.",
  },
  relationships: {
    name: "Relationships",
    slug: "relationships",
    description:
      "Navigate relationship dynamics, communication, and personal connections with advice from experienced individuals.",
  },
  finance: {
    name: "Finance",
    slug: "finance",
    description:
      "Manage money, investments, debt, and financial goals. Learn from others' financial experiences and decisions.",
  },
  health: {
    name: "Health & Fitness",
    slug: "health",
    description: "Share fitness journeys, wellness tips, and health experiences with a supportive community.",
  },
  other: {
    name: "Other",
    slug: "other",
    description: "Find solutions and share experiences on topics that don't fit other categories.",
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_METADATA).map((key) => ({
    category: key,
  }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const metadata = CATEGORY_METADATA[params.category as keyof typeof CATEGORY_METADATA];
  return {
    title: `${metadata?.name || "Category"} - Human Problem Solver`,
    description: metadata?.description,
  };
}

export default function Page({ params }: { params: { category: string } }) {
  const metadata = CATEGORY_METADATA[params.category as keyof typeof CATEGORY_METADATA];

  if (!metadata) {
    return (
      <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] p-12 text-center">
        <div className="text-lg font-semibold">Category not found</div>
        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">This category doesn't exist or has been moved.</p>
      </div>
    );
  }

  return <CategoryPage categoryName={metadata.name} categorySlug={metadata.slug} categoryDescription={metadata.description} />;
}
