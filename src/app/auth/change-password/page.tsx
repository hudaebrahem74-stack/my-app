'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const changeSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangeFormValues = z.infer<typeof changeSchema>;

export default function ChangePasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // جلب الـ token من الرابط

  const { register, handleSubmit, formState: { errors } } = useForm<ChangeFormValues>({
    resolver: zodResolver(changeSchema),
  });

  async function submitForm(values: ChangeFormValues) {
    if (!token) {
      setError("Invalid or expired token");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage("Password updated successfully!");
      setTimeout(() => window.location.href = "/auth/signin", 2000); // redirect بعد نجاح
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
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Change Password</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        <div className="mb-4">
          <input type="password" placeholder="New Password" {...register("password")} className="w-full p-2 border rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} className="w-full p-2 border rounded" />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-gray-800">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
