"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Axios from "../Axios";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await Axios.get("auth/profile", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        withCredentials: true
        });
        setUser(response.data);
      } catch (err: any) {
        setError("Failed to load profile");
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
        const response = await Axios.post('/auth/logout');
        router.push("/login");
    }catch (err) {
        console.log(err)
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-black dark:text-white">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-black dark:text-white">
                User Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Welcome to your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Profile Information
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Name: {user.name}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Email: {user.email}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">ID: {user.id}</p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Quick Actions
            </h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                Edit Profile
              </button>
              <button className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-black dark:text-white dark:hover:bg-zinc-900">
                Change Password
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Account Status
            </h3>
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}