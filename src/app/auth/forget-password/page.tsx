'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgetPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  async function submitForm(values: ForgotFormValues) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage("Check your email for the reset link!");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(submitForm)} className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Forgot Password</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        <div className="mb-4">
          <input type="email" placeholder="Email" {...register("email")} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-gray-800">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
