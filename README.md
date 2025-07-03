
# Online Voting System

## Project Overview

This is a robust and scalable online voting system built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides a secure platform for users to register, log in, and cast their votes for candidates, with an administrative panel for managing users and candidates. The system ensures data integrity, secure authentication, and real-time updates for vote counts.

## Features

* **Secure User Authentication:** Implemented JWT (JSON Web Token) based authentication for secure user registration, login, and session management, with password hashing using `bcrypt`.
* **Role-Based Access Control:** Differentiated user roles (`voter` and `admin`), ensuring only administrators can add or manage candidates.
* **Candidate Management:** Admin users can add new candidates, including their details, party, and image (uploaded to Cloudinary).
* **Voting Mechanism:** Registered voters can cast their vote for a chosen candidate once, with logic to prevent multiple votes from the same user.
* **Real-time Vote Tracking:** Dynamically updates vote counts for candidates.
* **User Profile Management:** Users can view and update their profile details, including password changes.
* **RESTful API Design:** Comprehensive and well-structured RESTful APIs for all backend operations.
* **Cloud Image Storage:** Integrates Cloudinary for secure and efficient storage of candidate images.
* **Responsive UI:** (Assumed, given MERN stack) A user-friendly and responsive frontend built with React.js.

## Technologies Used

### Frontend (Assumed React.js)

* **React.js**
* **React Router** (Likely for navigation)
* **Axios** (For API requests)

### Backend

* **Node.js**
* **Express.js** (Web framework)
* **MongoDB** (NoSQL database)
* **Mongoose** (ODM for MongoDB)
* **jsonwebtoken** (For JWT authentication)
* **bcrypt** (For password hashing)
* **dotenv** (For environment variable management)
* **cors** (For Cross-Origin Resource Sharing)
* **body-parser** (For parsing incoming request bodies)
* **express-fileupload** (For handling file uploads)
* **cloudinary** (For cloud image storage)
* **nodemon** (For automatic server restarts during development)

## Prerequisites

Before running this project, ensure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** or **yarn**
* **MongoDB** (Community Server or a MongoDB Atlas account)

## Installation & Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/uvraviz007/OneVote.git
cd OneVote
```

### 2. Backend Setup

Navigate to the backend directory (or wherever your server.js and package.json are located).

```bash
cd backend  # or the relevant directory
```

Install Dependencies

```bash
npm install  # or yarn install
```

Configure Environment Variables

Create a `.env` file in the backend directory and add the following variables:

```env
PORT=5000
MONGO_URI='mongodb+srv://<username>:<password>@cluster.r6mhes6.mongodb.net/<database-name>?retryWrites=true&w=majority'
JWT_SECRET='your_jwt_secret_key'
CLOUD_NAME='your_cloudinary_cloud_name'
CLOUD_API_KEY='your_cloudinary_api_key'
CLOUD_API_SECRET_KEY='your_cloudinary_api_secret_key'
```

Replace `<username>`, `<password>`, and `<database-name>` with your MongoDB Atlas credentials. Generate a strong secret key for `JWT_SECRET`. Obtain your Cloudinary credentials from your Cloudinary Dashboard.

Run the Backend Server

```bash
npm start  # or yarn start
```

### 3. Frontend Setup (Assumed React.js)

Navigate to your frontend directory.

```bash
cd ../frontend  # Adjust path if your frontend is in a different directory
```

Install Dependencies

```bash
npm install  # or yarn install
```

Configure Environment Variables

Create a `.env` file in the frontend root and add:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

Run the Frontend Application

```bash
npm start  # or yarn start
```

## Usage

Open your browser and go to `http://localhost:3000`.

* Register as a new user (default role is voter).
* Login using your credentials.
* Admin access: manually update a user's role to `admin` in MongoDB or create a special route.
* Admin can add candidates with image uploads.
* Voters can vote once per candidate.
* Results show updated vote counts in real-time.

## API Endpoints (Backend)

### User Routes (/user)

* `POST /user/signup`: Register a new user.
* `POST /user/login`: Log in and receive a JWT.
* `GET /user/profile`: Get profile (JWT required).
* `PUT /user/profile/password`: Change password (JWT required).

### Candidate Routes (/candidate)

* `POST /candidate`: Add a new candidate (admin only).
* `POST /candidate/vote/:candidateId`: Cast a vote (voter only).
* `GET /candidate`: List of candidates (basic info).
* `GET /candidate/allcandidates`: Full candidate details.

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the ISC License.




