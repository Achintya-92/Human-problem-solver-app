"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, MessageSquare, Video, Phone, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface Expert {
  id: string;
  specializations: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  bio: string;
  profilePhotoUrl: string;
  averageRating: number;
  totalConsultations: number;
  completedConsultations: number;
  isVerified: boolean;
  consultationTypes: string[];
  whatsappLink: string;
  contactEmail: string;
  bookingLink: string;
  category: { name: string };
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    username: string;
    bio: string;
  };
  consultations: Array<{
    id: string;
    feedback: string;
    rating: number;
  }>;
}

export default function ExpertDetailPage() {
  const params = useParams();
  const expertId = params.id as string;

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingType, setBookingType] = useState("CHAT");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const data = await api.get<{ expert: Expert }>(`/experts/${expertId}`);
        setExpert(data.expert);
      } catch (error) {
        console.error("Failed to load expert:", error);
        toast.error("Failed to load expert profile");
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [expertId]);

  const handleBookConsultation = async () => {
    if (!expert) return;

    try {
      await api.post(`/consultations/experts/${expert.id}/book`, {
        type: bookingType,
        scheduledAt: bookingDate ? new Date(bookingDate).toISOString() : null,
        notes: bookingNotes,
      });

      toast.success("Consultation booked successfully!");
      setShowBooking(false);
      setBookingDate("");
      setBookingNotes("");
    } catch (error) {
      console.error("Failed to book consultation:", error);
      toast.error("Failed to book consultation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Expert not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-6 flex flex-col gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center sm:items-start">
              {expert.profilePhotoUrl ? (
                <img
                  src={expert.profilePhotoUrl}
                  alt={expert.user.name}
                  className="mb-4 h-24 w-24 rounded-full object-cover"
                />
              ) : expert.user.avatarUrl ? (
                <img
                  src={expert.user.avatarUrl}
                  alt={expert.user.name}
                  className="mb-4 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mb-4 h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{expert.user.name}</h1>
                {expert.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 dark:bg-green-900">
                    <span className="text-xs font-medium text-green-700 dark:text-green-200">Verified Expert</span>
                  </span>
                )}
              </div>

              <p className="mb-2 text-slate-600 dark:text-slate-400">@{expert.user.username}</p>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{expert.category?.name}</p>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(expert.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{expert.averageRating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {expert.completedConsultations} consultations completed
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{expert.yearsOfExperience} years</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hourly Rate</p>
                  <p className="font-semibold text-slate-900 dark:text-white">${expert.hourlyRate}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {expert.totalConsultations > 0 ? Math.round((expert.completedConsultations / expert.totalConsultations) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h2 className="mb-2 font-semibold text-slate-900 dark:text-white">About</h2>
            <p className="text-slate-600 dark:text-slate-400">{expert.user.bio}</p>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {expert.specializations.map((spec) => (
                <span
                  key={spec}
                  className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Consultation Types */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Consultation Types</h2>
            <div className="flex flex-wrap gap-4">
              {expert.consultationTypes.includes("CHAT") && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-700">
                  <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Chat</span>
                </div>
              )}
              {expert.consultationTypes.includes("CALL") && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-700">
                  <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Call</span>
                </div>
              )}
              {expert.consultationTypes.includes("VIDEO") && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-700">
                  <Video size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Video</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Book Button */}
          <div className="flex flex-wrap gap-3">
            {expert.whatsappLink && (
              <a
                href={expert.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              >
                WhatsApp
              </a>
            )}
            {expert.bookingLink && (
              <a
                href={expert.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 font-medium text-white hover:bg-slate-700"
              >
                <Calendar size={16} /> External Booking
              </a>
            )}
            <button
              onClick={() => setShowBooking(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <Calendar size={16} /> Book Consultation
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        {expert.consultations.length > 0 && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Recent Reviews</h2>
            <div className="space-y-4">
              {expert.consultations.map((consultation) => (
                <div key={consultation.id} className="border-b border-slate-200 pb-4 last:border-0 dark:border-slate-700">
                  <div className="mb-2 flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < consultation.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{consultation.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Book Consultation</h2>

              {/* Type Selection */}
              <div className="mb-4">
                <label className="mb-2 block font-medium text-slate-900 dark:text-white">Consultation Type</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  {expert.consultationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="mb-2 block font-medium text-slate-900 dark:text-white">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="mb-2 block font-medium text-slate-900 dark:text-white">Additional Notes</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Tell the expert about your needs..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookConsultation}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
