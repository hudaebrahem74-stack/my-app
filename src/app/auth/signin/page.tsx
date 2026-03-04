'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function submitForm(values: LoginFormValues) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(submitForm)} className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input type="email" placeholder="Email" {...register("email")}
          className="w-full p-2 border rounded mb-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input type="password" placeholder="Password" {...register("password")}
          className="w-full p-2 border rounded mb-2" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Logging in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}