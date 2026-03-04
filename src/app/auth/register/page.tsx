'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  rePassword: z.string().min(6),
  phone: z.string().min(10),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function submitForm(values: RegisterFormValues) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      router.push("/auth/signin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(submitForm)} className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Register</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input placeholder="Name" {...register("name")}
          className="w-full p-2 border rounded mb-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input type="email" placeholder="Email" {...register("email")}
          className="w-full p-2 border rounded mb-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input type="password" placeholder="Password" {...register("password")}
          className="w-full p-2 border rounded mb-2" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input type="password" placeholder="Confirm Password" {...register("rePassword")}
          className="w-full p-2 border rounded mb-2" />
        {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}

        <input placeholder="Phone" {...register("phone")}
          className="w-full p-2 border rounded mb-2" />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}