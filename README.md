# Forever — Full-Stack MERN E-Commerce Platform

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Forever** is a modern, responsive, full-stack E-Commerce web application built with the MERN stack (MongoDB, Express.js, React 19, Node.js). Designed for a seamless online shopping experience, it includes multi-currency/payment gateway integrations (Stripe, Razorpay, COD), product management with Cloudinary image hosting, and order tracking.

---

## 🚀 Features

### 🛍️ Storefront & User Experience
* **Product Catalog & Filtering:** Browse products with multi-level filtering by Category (Men, Women, Kids), Type (Topwear, Bottomwear, Winterwear), and price sorting.
* **Instant Search:** Dynamic search overlay to locate items quickly.
* **Shopping Cart & Checkout:** Persistent interactive cart with dynamic delivery fee calculations and item management.
* **Order Management & Tracking:** Dedicated order history and real-time status tracking (`TrackOrder`).

### 💳 Payments & Security
* **Multiple Payment Methods:** Supports **Stripe**, **Razorpay**, and **Cash on Delivery (COD)**.
* **Authentication:** Secure user signup/login powered by **JWT (JSON Web Tokens)** and `bcryptjs` password hashing.

### ⚡ Backend & Infrastructure
* **RESTful API:** Structured Express 5 backend with controllers, middleware, and route handlers.
* **Cloud Media Management:** Cloudinary integration for scalable product image uploads and asset delivery via Multer.
* **Database Management:** MongoDB with Mongoose schema validation for Users, Products, Orders, and Carts.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 19 + Vite
* **Routing:** React Router DOM v7
* **Styling:** Tailwind CSS + PostCSS
* **State Management:** React Context API (`ShopContext`)
* **Notifications:** React Toastify

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js 5
* **Database:** MongoDB & Mongoose ORM
* **Authentication:** JWT & BcryptJS
* **FileUpload & Storage:** Multer & Cloudinary SDK
* **Payment Gateways:** Stripe API & Razorpay SDK

---

## 📁 Project Structure

```
Forever/
├── backend/                  # Express API Server
│   ├── config/               # DB & Cloudinary configs
│   ├── controllers/          # Business logic (User, Product, Cart, Order)
│   ├── middleware/           # Auth & Multer upload middleware
│   ├── models/               # Mongoose schemas (User, Product, Order)
│   ├── routes/               # API endpoints routes
│   └── server.js             # Express application entry point
├── src/                      # React Frontend
│   ├── assets/               # Icons & static assets
│   ├── components/           # Reusable UI components (Navbar, Footer, ProductItem, CartTotal)
│   ├── context/              # Global state management (ShopContext)
│   ├── pages/                # Page components (Home, Collection, Product, Cart, Orders, TrackOrder)
│   ├── App.jsx               # Main App routing component
│   └── main.jsx              # React DOM entry point
├── index.html                # Entry HTML template
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Main project dependencies & scripts
```

---

## 🚦 Getting Started

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* **MongoDB** connection string (Local or MongoDB Atlas)
* **Cloudinary** account credentials
* **Stripe & Razorpay** API keys (for testing payments)

---

### 📥 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/forever-ecommerce.git
   cd forever-ecommerce
   ```

2. **Install Dependencies**
   Install frontend and backend dependencies:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `backend/` directory based on `.env.example`:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Run the Application**

   * **Start Backend Server:**
     ```bash
     npm run backend:dev
     ```
   * **Start Frontend Dev Server:**
     ```bash
     npm run dev
     ```

   The app will run at `http://localhost:5173` and the API at `http://localhost:4000`.

---

## 📡 Key API Routes Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | Register new user account | No |
| `POST` | `/api/user/login` | Login user & return JWT token | No |
| `GET` | `/api/product/list` | Fetch all products | No |
| `POST` | `/api/cart/get` | Retrieve user cart items | Yes |
| `POST` | `/api/cart/add` | Add product to cart | Yes |
| `POST` | `/api/order/place` | Place an order (COD / Payment) | Yes |
| `POST` | `/api/order/userorders` | Fetch user order history | Yes |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the issues page.

---

## 📄 License

This project is licensed under the ISC License.
