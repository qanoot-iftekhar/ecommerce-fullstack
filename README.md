# Full Stack E-Commerce Website

A complete e-commerce website built with **Django REST Framework** (backend) and **React.js** (frontend) with **MySQL** database.

# Live Demo
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin`

# Features

# User Features
- User Registration & Login (JWT Authentication)
- Browse Products with Search & Filter
- Product Detail Page
- Add to Cart & Remove from Cart
- Real-time Cart Count Update
- Checkout with Payment Gateway (Razorpay)
- Order History
- Responsive Design

# Admin Features
- Product Management (Add/Edit/Delete)
- Order Management
- User Management
- Blog Management

# Technical Features
- REST API with Django REST Framework
- JWT Token Authentication
- MySQL Database
- Email OTP Verification
- Razorpay Payment Integration
- Search by Product Name
- Filter by Category & Price Range

# Tech Stack

# Backend
- Django 6.0
- Django REST Framework
- MySQL
- JWT Authentication
- Razorpay API

# Frontend
- React.js 19
- React Router DOM
- Axios
- Font Awesome Icons

# 📁 Project Structure
ecommerce-fullstack/
├── backend/
│ ├── api/ # Django app
│ ├── ecommerce/ # Project settings
│ └── manage.py
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/ # Header, Footer, ProductCard
│ │ ├── pages/ # Home, Shop, Cart, Checkout, Login, Signup, Orders
│ │ └── App.js
│ └── package.json
└── README.md

text

# How to Run Locally

# Prerequisites
- Python 3.12+
- Node.js 18+
- MySQL

# Step 1: Clone Repository
```bash
git clone https://github.com/qanoot-iftekhar/ecommerce-fullstack.git
cd ecommerce-fullstack
Step 2: Setup Backend
bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
Step 3: Setup Frontend
bash
cd frontend
npm install
npm start
Step 4: MySQL Database Setup
Create database: ecommerce_db

Update settings.py with your MySQL credentials

Environment Variables
Backend (.env)
text
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your_password
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
Frontend (.env)
text
REACT_APP_API_URL=http://localhost:8000/api

Page	Description
Home	Featured products, banners, categories
Shop	All products with search and filters
Product	Detailed view with add to cart
Cart	Manage cart items
Checkout	Shipping form + payment
Orders	Order history
Login/Signup	JWT authentication

🔑 Default Admin Credentials
Username: admin
Password: admin123

📧 Email OTP Setup
Enable 2-Step Verification in Google Account

Generate App Password

Add to settings.py

💳 Payment Gateway (Test Mode)
Card: 4111 1111 1111 1111

Expiry: 00/00

CVV: 000

OTP: 0000

Future Improvements
Product Reviews & Ratings

Wishlist Feature

Coupon/Discount System

Forgot Password

Social Login (Google/Facebook)

Author
MD QANOT

GitHub: @qanoot-iftekhar

Email: qanoot0525@gmail.com

Show Your Support
If you found this project helpful, please give it a star on GitHub

License
This project is for educational purposes.
