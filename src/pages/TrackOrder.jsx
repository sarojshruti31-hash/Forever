import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const steps = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const TrackOrder = () => {
  const { id } = useParams();
  const { backendUrl, token: contextToken } = useContext(ShopContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadOrder = async () => {
    if (!id) return;
    const token = contextToken || localStorage.getItem('token') || '';

    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch(`${backendUrl}/api/order/${id}`, {
        method: "GET",
        headers: {
          token,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server unavailable or invalid response");
      }

      const data = await response.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setErrorMsg(data.message || "Order not found");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id, contextToken]);

  if (loading) {
    return (
      <div className="border-t pt-16 text-center text-xl text-gray-600">
        Loading Order Details...
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="border-t pt-16 text-center max-w-xl mx-auto">
        <div className="text-2xl mb-6">
          <Title text1={"TRACK"} text2={"ORDER"} />
        </div>
        <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200">
          <p className="font-semibold text-lg mb-2">Unable to load order tracking</p>
          <p className="text-sm mb-4">{errorMsg || "Order details could not be retrieved."}</p>
          <Link
            to="/orders"
            className="inline-block bg-black text-white text-sm px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="border-t pt-16 max-w-4xl mx-auto">
      <div className="text-2xl mb-10">
        <Title text1={"TRACK"} text2={"ORDER"} />
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">Order Status</h2>
          <span className="text-sm text-gray-500">
            Order ID: <span className="font-mono text-gray-800">{order._id}</span>
          </span>
        </div>

        <div className="py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center mb-8 relative">
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-3 top-6 w-0.5 h-8 -z-0 ${
                    index < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index <= currentStep ? "✓" : index + 1}
              </div>

              <div className="ml-6">
                <p
                  className={`font-semibold ${
                    index <= currentStep ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
                {index === currentStep && (
                  <span className="text-xs text-green-600 font-medium">
                    Current Status
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 mt-6 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Order Information
            </h3>
            <p className="mb-1">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p className="mb-1">
              <strong>Payment Status:</strong>{" "}
              <span
                className={
                  order.payment
                    ? "text-green-600 font-medium"
                    : "text-amber-600 font-medium"
                }
              >
                {order.payment ? "Paid" : "Pending"}
              </span>
            </p>
            <p className="mb-1">
              <strong>Date Placed:</strong>{" "}
              {new Date(order.date).toDateString()}
            </p>
            <p className="mb-1">
              <strong>Total Amount:</strong> ${order.amount}
            </p>
          </div>

          {order.address && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Shipping Address
              </h3>
              <p className="mb-1">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="mb-1">{order.address.street}</p>
              <p className="mb-1">
                {order.address.city}, {order.address.state}{" "}
                {order.address.zipcode}
              </p>
              <p className="mb-1">{order.address.country}</p>
              <p className="mb-1">Phone: {order.address.phone}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-end">
          <Link
            to="/orders"
            className="inline-block border border-gray-300 text-gray-700 text-sm px-6 py-2 rounded hover:bg-black hover:text-white transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;