import { CategoryPage } from "@/components/CategoryPage";

const CATEGORY_METADATA = {
  career: {
    name: "Career",
    slug: "career",
    description:
      "Navigate career challenges, job transitions, and professional growth.",
  },

  "mental-health": {
    name: "Mental Health",
    slug: "mental-health",
    description:
      "Share and explore experiences related to mental wellness.",
  },

  education: {
    name: "Education",
    slug: "education",
    description:
      "Get academic help and study tips from learners and educators.",
  },

  relationships: {
    name: "Relationships",
    slug: "relationships",
    description:
      "Navigate relationship dynamics and communication.",
  },

  finance: {
    name: "Finance",
    slug: "finance",
    description:
      "Manage money, investments, debt, and financial goals.",
  },

  health: {
    name: "Health & Fitness",
    slug: "health",
    description:
      "Share fitness journeys and wellness tips.",
  },

  other: {
    name: "Other",
    slug: "other",
    description:
      "Find solutions and share experiences on various topics.",
  },
};

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_METADATA).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;

  const metadata =
    CATEGORY_METADATA[
      category as keyof typeof CATEGORY_METADATA
    ];

  return {
    title: `${metadata?.name || "Category"} - Human Problem Solver`,
    description: metadata?.description,
  };
}

export default async function Page({ params }: Props) {
  const { category } = await params;

  const metadata =
    CATEGORY_METADATA[
      category as keyof typeof CATEGORY_METADATA
    ];

  if (!metadata) {
    return (
      <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] p-12 text-center">
        <div className="text-lg font-semibold">
          Category not found
        </div>

        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
          This category doesn't exist or has been moved.
        </p>
      </div>
    );
  }

  return (
    <CategoryPage
      categoryName={metadata.name}
      categorySlug={metadata.slug}
      categoryDescription={metadata.description}
    />
  );
}