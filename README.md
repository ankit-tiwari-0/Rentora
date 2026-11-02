# 🚘 Rentora

<img width="1867" height="998" alt="image" src="https://github.com/user-attachments/assets/224e04ba-acf6-4735-b293-0f4a3ed03027" />

### Premium Car Rental & Booking Management Platform

**Rentora** is a modern full-stack car rental platform designed to make discovering, booking, and managing premium vehicles simple and convenient. It connects customers looking for their ideal ride with vehicle owners who want to manage their rental listings and bookings through a dedicated dashboard.

Built with the MERN stack, Rentora focuses on a smooth booking experience, secure authentication, responsive design, and streamlined rental management.

---


## ✨ Features

### 👤 Customer Experience
- **User Authentication** – Secure registration and login using JWT-based authentication.
- **Explore Vehicles** – Browse available vehicles with detailed information.
- **Vehicle Search** – Find cars based on location and rental dates.
- **Vehicle Details** – View vehicle specifications, features, amenities, and descriptions.
- **Booking Management** – Create and manage car rental bookings.
- **Secure Payments** – Integrated Stripe payment workflow.
- **Booking History** – View previous and upcoming reservations.
- **Responsive Interface** – Optimized for desktop, tablet, and mobile devices.

### 🚗 Vehicle Management
- Add and manage vehicle listings.
- Upload and manage vehicle images using ImageKit.
- Maintain vehicle information, pricing, and availability.
- Display vehicle specifications and amenities.
- Manage vehicle rental status.

### 🏢 Owner Dashboard
- Dedicated owner dashboard.
- View booking statistics and rental activity.
- Manage listed vehicles.
- Add new vehicles.
- Review and manage customer bookings.
- Confirm or manage booking requests.
- Track rental revenue.

### 💳 Payment System
- Stripe payment integration.
- Payment authorization using manual capture.
- Capture authorized payments after booking confirmation.
- Cancel payment authorization when a booking is cancelled.
- Track payment status.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only Cookies |
| Payments | Stripe |
| Image Storage | ImageKit |
| Animations | GSAP, Motion |
| Icons | Lucide React, React Icons |
| API Testing | Postman |
| Version Control | Git, GitHub |
| Deployment | Vercel |

---

## 🏗️ Project Architecture

Rentora follows a client-server architecture.

```text
                 ┌─────────────────────┐
                 │      Customer       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │  Vite + Tailwind    │
                 └──────────┬──────────┘
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │   Express Backend  │
                 │     Node.js         │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         MongoDB         Stripe        ImageKit
         Database        Payments      Image Storage
```

---

## 📂 Project Structure

### Frontend

```text
Rentora/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── component/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Feature.jsx
│   │   ├── Footer.jsx
│   │   ├── OwnerNavbar.jsx
│   │   └── OwnerSidebar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Cars.jsx
│   │   ├── CarDetail.jsx
│   │   ├── MyBooking.jsx
│   │   └── owner/
│   │       ├── Layout.jsx
│   │       ├── Dashboard.jsx
│   │       └── AddCar.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js
```

### Backend

```text
Rentora-Server/
│
├── src/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── server.js
├── .env
├── package.json
└── vercel.json
```

*Note: The structure above is a project overview. Update it if your actual folders or filenames differ.*

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Navigate to the Frontend

```bash
cd Rentora
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure Frontend Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_BASE_URL=http://localhost:5000
```

Replace the URL with your actual backend address.

### 5. Start the Frontend

```bash
npm run dev
```

### 6. Set Up the Backend

Open another terminal:

```bash
cd Rentora-Server
npm install
```

### 7. Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Add any other environment variables required by your backend configuration. Never commit real credentials.

### 8. Start the Backend

```bash
npm run server
```

Use the actual script defined in your backend `package.json` if its name differs.

---

## 🔐 Security

Rentora uses several security practices:

- JWT-based authentication.
- HTTP-only cookies for authentication tokens.
- Password hashing before storage.
- Protected API routes using authentication middleware.
- CORS configuration for authorized frontend origins.
- Environment variables for sensitive credentials.
- Server-side payment verification.

---

## 💳 Booking & Payment Workflow

1. Customer selects a vehicle and rental dates.
2. Customer submits a booking request.
3. Backend validates booking information and availability.
4. Stripe creates a payment authorization.
5. Owner reviews the booking request.
6. Authorized payment is captured after confirmation.
7. If the booking is cancelled, the authorization is released.

**Important:** Payment authorization and payment capture are different stages. An authorized payment is not considered successfully paid until it is captured.

---

## 🌐 Deployment

Rentora uses Vercel for deployment.

- **Frontend:** [Rentora Web](https://rentora-black.vercel.app)
- **Backend:** [Rentora Server](https://rentora-server-rho.vercel.app)

Production deployment requires correctly configured environment variables, API URLs, CORS settings, and secure cookie configuration.

---

## 🚀 Future Improvements

- Advanced vehicle filtering and sorting.
- Real-time booking availability.
- Customer reviews and ratings.
- Wishlist and favourite vehicles.
- Email and booking notifications.
- Improved owner analytics.
- Advanced booking calendar.
- Progressive Web App (PWA) support.
- AI-powered vehicle recommendations.

---

## 🎯 Project Objective

The goal of Rentora is to build a reliable and user-friendly car rental platform that simplifies vehicle discovery, booking, payment processing, and rental management.

The project demonstrates practical full-stack development skills, including REST API development, database management, authentication, payment integration, third-party services, and responsive user interface design.

---

## 👨‍💻 Developer

**Developed by:** Ankit Tiwari

**Project:** Rentora – Premium Car Rental Platform

---

## 📄 License

This project is developed for educational and portfolio purposes. Add a formal license file if you intend to distribute or reuse the source code under specific terms.

---

<p align="center">
  <b>Rentora</b> · Your Journey, Your Drive.
</p>
