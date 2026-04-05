# 🏨 Hostel Management System (StayPG Concept)

## 📌 Project Overview
This project is a full-stack Hostel Management System designed specifically for managing short-term stays of college staff and guests.

The idea was inspired by our college rector, who identified the need for a centralized system to manage room bookings, user data, and availability in hostels.

Currently, there is no dedicated application to handle:
- Room booking
- Guest/staff management
- Payment tracking
- Check-in / Check-out records

This system aims to solve all these problems in a structured and digital way.

---

## 🎯 Problem Statement
College staff, professors, HODs, principals, and external guests often require temporary accommodation (24-hour stay) during events or meetings.

However:
- No centralized booking system exists
- Room availability is manually managed
- No proper tracking of users and stay duration
- No integrated payment system

---

## 💡 Solution
This application provides a complete digital solution where:

1. Users can **Sign Up and Login**
2. Select their **role** (Guest / Faculty)
3. Based on role, navigate accordingly
4. Fill profile details (including gender)
5. View hostels and rooms based on availability
6. Book rooms with pricing and amenities
7. Make payment via SBI Collect
8. Track bookings and history
9. Manage check-in and check-out automatically

---

## 👤 User Roles

### Faculty:
- Professor
- HOD
- Principal

### Guest:
- External visitors attending events/meetings

---

## 🏢 Hostel Logic

### 🟦 Sahyadri Hostel (Male)
- 4 AC Rooms
- 4 Non-AC Rooms

### 🟪 Nandgiri Hostel (Female)
- 2 Non-AC Rooms

### 🔁 Gender-Based Filtering
- Male users → Sahyadri available, Nandgiri shown as unavailable
- Female users → Nandgiri available, Sahyadri shown as unavailable

---

## 💰 Pricing System
- Pricing differs based on user role:
  - Guest
  - Professor
  - HOD
  - Principal

- Example:
  - AC Room → ₹1000 / 24 hours (base case)
  - Dynamic pricing based on role

---

## 🛏 Booking Flow

1. User selects room
2. Views:
   - Images
   - Amenities
   - Price
3. Clicks **Book Room**
4. Redirected to **SBI Collect**
5. After payment:
   - Room count decreases automatically
6. After checkout:
   - Room availability resets automatically

---

## 📊 Features

### ✅ Core Features
- Authentication (Signup/Login)
- Role-based system
- Gender-based hostel filtering
- Room booking system
- Real-time availability update
- Payment integration (SBI Collect)

### 📈 Additional Features
- Booking history tracking
- Feedback system
- Help chatbot
- SOS call to hostel rector
- College information section
- Hostel details & history
- Location tracking (map integration)

---

## 🛠 Tech Stack

### Frontend:
- React.js
- Tailwind CSS (UI Enhancement)

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB