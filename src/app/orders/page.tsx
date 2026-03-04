'use client'

import { useEffect, useState } from "react"

interface Product {
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  products: Product[]
  totalPrice: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
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

    async function getOrders() {
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

        if (!res.ok) {
          const data = await res.json()
          setError(data.message || "Something went wrong")
          return
        }

        const data: Order[] = await res.json()
        setOrders(data)
      } catch (err) {
        console.log(err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (orders.length === 0) return <div className="p-10 text-center">No orders found</div>

  return (
    <div className="p-10 grid gap-6">
      {orders.map((order) => (
        <div key={order._id} className="p-6 border rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">Order ID: {order._id}</h3>
          <p className="mb-2">Status: <span className="font-medium">{order.status}</span></p>
          <p className="mb-2">Total Price: <span className="font-medium">${order.totalPrice}</span></p>
          <p className="mb-2">Date: {new Date(order.createdAt).toLocaleString()}</p>
          <div className="mt-2">
            <h4 className="font-semibold mb-1">Products:</h4>
            <ul className="list-disc list-inside">
              {order.products.map((prod, idx) => (
                <li key={idx}>
                  {prod.name} - Qty: {prod.quantity} - Price: ${prod.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}