"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Video, Phone } from "lucide-react";
import { api } from "@/lib/api";

interface Expert {
  id: string;
  specializations: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  bio: string;
  averageRating: number;
  totalConsultations: number;
  isVerified: boolean;
  consultationTypes: string[];
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    username: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (verified) params.append("verified", "true");

        const data = await api.get<{ experts: Expert[]; total: number }>(`/experts?${params.toString()}`);
        setExperts(data.experts);
      } catch (error) {
        console.error("Failed to load experts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [category, verified]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Expert Consultants</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Connect with verified experts for personalized guidance and consultation
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm font-medium">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            </div>
          ) : experts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No experts found</p>
            </div>
          ) : (
            experts.map((expert) => (
              <Link href={`/experts/${expert.id}`} key={expert.id}>
                <div className="group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {/* Avatar and Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {expert.user.avatarUrl && (
                        <img
                          src={expert.user.avatarUrl}
                          alt={expert.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{expert.user.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">@{expert.user.username}</p>
                      </div>
                    </div>
                    {expert.isVerified && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 dark:bg-green-900">
                        <span className="text-xs font-medium text-green-700 dark:text-green-200">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(expert.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{expert.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({expert.totalConsultations})</span>
                  </div>

                  {/* Bio */}
                  <p className="mb-3 text-sm text-slate-600 line-clamp-2 dark:text-slate-400">{expert.bio}</p>

                  {/* Specializations */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {expert.specializations.slice(0, 2).map((spec) => (
                      <span key={spec} className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {spec}
                      </span>
                    ))}
                    {expert.specializations.length > 2 && (
                      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        +{expert.specializations.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Consultation Types */}
                  <div className="mb-4 flex gap-2">
                    {expert.consultationTypes.includes("CHAT") && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <MessageSquare size={14} /> Chat
                      </span>
                    )}
                    {expert.consultationTypes.includes("CALL") && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Phone size={14} /> Call
                      </span>
                    )}
                    {expert.consultationTypes.includes("VIDEO") && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Video size={14} /> Video
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{expert.yearsOfExperience} yrs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Hourly Rate</p>
                      <p className="font-semibold text-slate-900 dark:text-white">${expert.hourlyRate}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
