import React, { useState, useEffect } from "react";
import { Users, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "../components/common/LoadingSkeleton";

const dashboardLinks = [
  {
    icon: <Users size={24} className="text-blue-500" />,
    label: "Teachers",
    href: "/teachers"
  },
  {
    icon: <BookOpen size={24} className="text-green-500" />,
    label: "Qualifications",
    href: "/qualifications"
  },
  {
    icon: <Calendar size={24} className="text-purple-500" />,
    label: "Schedule",
    href: "/schedule"
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <section className="max-w-2xl w-full bg-white shadow rounded-lg p-8 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to Teacher Management Portal</h1>
        <p className="text-gray-600 mb-7">Modern, accessible, and responsive platform for managing teachers, schedules, and more.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {dashboardLinks.map(item =>
            loading ? (
              <LoadingSkeleton key={item.label} height={80} className="w-full" />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg shadow transition group"
              >
                {item.icon}
                <span className="mt-2 text-gray-800 font-medium group-hover:text-blue-700">{item.label}</span>
              </Link>
            )
          )}
        </div>
        {loading ? (
          <LoadingSkeleton height={20} width={160} className="mx-auto mt-2" />
        ) : (
          <p className="text-xs text-gray-500 text-center">
            By Roshan Reji, focus on accessibility.
          </p>
        )}
      </section>
    </main>
  );
}
