# Library-Management-System
A full-stack Library Management System where users can register, browse books, and send borrow requests, while admins can manage books, view user requests, and maintain the library database. Built with React.js, Node.js, Express, and MongoDB.

# Library Management System Backend

This repository contains the REST API for the Library Management System. It handles all data logic, including user authentication, book management, and issuing/returning books.

### Live URLs

* **Live API:** (https://lms-backend-api-eywh.onrender.com/)
* **Live Frontend:** (https://flourishing-nasturtium-a80902.netlify.app/)

---

### Technologies Used

* **Node.js & Express:** For the server and routing.
* **MongoDB & Mongoose:** For the database and object modeling.
* **jsonwebtoken:** For user authentication.
* **bcryptjs:** For password hashing.
* **CORS:** For handling Cross-Origin Resource Sharing.

---

### Getting Started (for developers)

1.  Clone this repository: `git clone https://github.com/Srijita-TechSeeker/Library-Management-System.git`
2.  Navigate to the project directory: `cd Library-Management-System`
3.  Install dependencies: `npm install`
4.  Create a `.env` file in the root directory and add your MongoDB connection string:
    ```
    MONGO_URI_ATLAS=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
5.  Start the server locally: `npm start`
