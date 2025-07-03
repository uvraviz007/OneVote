# 🗳️ One Vote - Online Voting System

## 📌 Project Overview

**One Vote** is a robust and scalable online voting system built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It provides a secure platform for voters to register, log in, and cast votes for candidates. The system also features a powerful admin panel to manage candidate details. The platform ensures **data integrity**, **secure authentication**, and **real-time vote tracking**.

---

## 🚀 Features

- 🔐 **Secure User Authentication:** JWT-based authentication with bcrypt password hashing.
- 🔒 **Role-Based Access Control:** Separate roles for voters and admins.
- 🧑‍💼 **Candidate Management:** Admins can add, edit, or delete candidates with profile images and manifesto links.
- 🗳️ **Voting Mechanism:** Users can vote only once; vote updates are tracked in real-time.
- 📊 **Live Vote Count:** Displays live vote statistics dynamically.
- 👤 **User Profile Management:** Update personal details and password.
- 🌐 **RESTful API Design:** Organized and scalable backend APIs.
- ☁️ **Cloud Image Storage:** Candidate profile images are uploaded using **Cloudinary**.
- 📱 **Responsive UI:** Fully responsive React frontend for all devices.

---

## 🧑‍💻 Technologies Used

### Frontend
- React.js
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt
- Dotenv
- CORS
- Body-parser
- Express-fileupload
- Cloudinary
- Nodemon

---

## 🖼️ Screenshots

### 🗳️ Candidate Voting Page
![Voting Page](./screenshots/voting-page.png)

### 📊 Live Vote Count
![Vote Count](./screenshots/vote-count.png)

### 🛠️ Admin Panel - Manage Candidates
![Admin Panel](./screenshots/admin-panel.png)

### ➕ Add New Candidate Form
![Add Candidate](./screenshots/add-candidate.png)

> 💡 *Make sure these images are inside a folder named `screenshots/` at the root of your project.*

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account

---

### 📂 1. Clone the Repository

```bash
git clone https://github.com/uvraviz007/OneVote.git
cd OneVote
