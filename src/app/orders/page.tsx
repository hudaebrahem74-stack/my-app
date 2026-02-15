'use client'

import { useEffect, useState } from "react"

interface Order {
  statusMsg: string
  message: string
}

export default function OrdersPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      setError("Please login first")
      setLoading(false)
      return
    }

    async function getOrder() {
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token || ""
            }
          }
        )

        const data: Order = await res.json() as Order

        setOrder(data)
      } catch (err) {
        console.log(err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    getOrder()
  }, [])

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!order) return <div className="p-10 text-center">No data found</div>

  return (
    <div className="p-10 text-center border rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{order.statusMsg}</h3>
      <p>{order.message}</p>
    </div>
  )
}
