'use client';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === "admin@admin.com" && user?.username === "admin123";

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/posts"); // redirect non-admins to posts page
      return;
    }

    async function fetchData() {
      setLoading(true);
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users"),
        fetch("https://jsonplaceholder.typicode.com/posts"),
        fetch("https://jsonplaceholder.typicode.com/comments"),
      ]);
      const users = await usersRes.json();
      const posts = await postsRes.json();
      const comments = await commentsRes.json();

      setUsersCount(users.length);
      setPostsCount(posts.length);
      setCommentsCount(comments.length);
      setLoading(false);
    }

    fetchData();
  }, [user, router, isAdmin]);

  if (!user || !isAdmin) return null;

  if (loading) return <p className="mt-10 text-center text-lg">Loading data...</p>;

  const chartOptions = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: ["Users", "Posts", "Comments"],
    },
  };

  const series = [
    {
      name: "Count",
      data: [usersCount, postsCount, commentsCount],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Chart options={chartOptions} series={series} type="bar" height={350} />
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
