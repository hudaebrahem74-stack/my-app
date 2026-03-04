'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
});

export default function ForgetPasswordPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values: any) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/auth/reset-password");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-6 bg-white shadow-md rounded">
        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Forgot Password</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input type="email" placeholder="Email"
          {...register("email")}
          className="w-full p-2 border rounded mb-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email?.message as string}</p>}

        <button disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </div>
  );
}