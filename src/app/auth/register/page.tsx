'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function submitForm(values: RegisterFormValues) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      console.log("Registered user:", data);

      window.location.href = "/auth/signin";
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="w-96 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          Register
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone"
            {...register("phone")}
            className="w-full p-2 border rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-gray-800"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
