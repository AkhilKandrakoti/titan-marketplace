# 🛒 TITAN — Digital Marketplace

A high-performance full-stack e-commerce platform built as a graduation capstone project.  
TITAN allows users to browse products, search and filter by category, manage a persistent shopping cart, and securely place orders stored in a production MongoDB database.

---

## 🔗 Live Demo

👉 https://titan-marketplace-2qqt.vercel.app/

---

##  GitHub Repository

👉 https://github.com/AkhilKandrakoti/titan-marketplace

---

## 🚀 Features

### 🛍 Product Catalog
- Dynamic product fetching from MongoDB API
- Category filtering (Electronics, Fashion, Home, Beauty, Grocery)
- Real-time search functionality
- Sorting by price and rating

### 🛒 Persistent Shopping Cart
- Cart stored in LocalStorage
- Survives page refresh
- Add/remove items smoothly

### 🧾 Checkout System
- Professional checkout form
- Customer details collection
- Secure order submission

### 🗄 Order Management Backend
- Orders stored in MongoDB Atlas
- Separate orders collection
- Server-side total calculation

### 🔒 Security
- Input sanitization
- NoSQL injection protection
- Server validation

### 🌐 Production Deployment
- Hosted on Vercel
- Connected to live MongoDB database

### 📱 Responsive UI
- Mobile-friendly layout
- Smooth transitions
- Modern UI design

---

## 🧠 Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend**
- Node.js (Serverless Functions)
- Vercel API Routes

**Database**
- MongoDB Atlas

**Deployment**
- Vercel

---

## 🏗 Architecture Overview


Browser → Vercel Frontend → Serverless API → MongoDB Atlas


- Frontend fetches products via API
- Cart handled in LocalStorage
- Orders saved securely in database

---

## 📂 Project Structure


titan-marketplace/
├── api/
│ ├── products.js
│ └── orders.js
├── data/
│ └── products.json
├── lib/
│ ├── mongodb.js
│ └── sanitize.js
├── public/
│ ├── index.html
│ ├── styles.css
│ └── app.js
├── scripts/
│ └── seed.js
├── package.json
└── README.md


---

## ⚙️ How to Run Locally

###  Clone repo

```bash
git clone https://github.com/AkhilKandrakoti/titan-marketplace.git
cd titan-marketplace
 Install dependencies
npm install

 ###Seed database
npm run seed
###Run locally
vercel dev
📊 Key Learning Outcomes

Built a production-ready full-stack application

Implemented persistent client state management

Designed secure backend APIs

Worked with cloud database

Deployed real application to production

Practiced input validation and security

###Future Improvements

Order history dashboard

Admin product management

Payment gateway integration

Inventory tracking

User authentication

### Author

Akhil Steven
Full-Stack Developer

GitHub: https://github.com/AkhilKandrakoti
