# 🗳️ Online Poll System Backend

## 🚀 Overview
The **Online Poll System Backend** is a real-time, scalable voting system that allows users to create polls, vote, and view live results. Built with **Node.js, Express.js, MySQL, and WebSockets**, this project simulates a real-world polling system where users can engage in interactive voting while ensuring data integrity and high performance.

## 🎯 Project Goals
1. **API Development**: Provide secure and scalable APIs for:
   - Poll creation with multiple options.
   - User authentication and authorization.
   - Voting with validation to prevent duplicate votes.
   - Fetching poll results in real-time.
  
2. **Database Optimization**:
   - Efficiently structure data in **MySQL** for real-time queries.
   - Use indexes and foreign keys for performance tuning.
  
3. **Live Updates via WebSockets**:
   - Ensure instant updates for the latest poll results.
   - Enable users to see votes update dynamically.

4. **API Documentation**:
   - Fully document all endpoints using **Swagger**.
   - Host interactive API documentation at `/api/docs`.

---

## 🛠️ Technologies Used  
- **Node.js + Express.js** – Backend framework for handling API requests.  
- **MySQL** – Relational database for storing poll data.  
- **Redis** – Used for:  
  - Caching poll results for faster queries.  
  - Storing active WebSocket connections.  
  - Rate limiting API requests.  
- **WebSockets (Socket.io)** – Real-time communication for live vote updates.  
- **JWT Authentication** – Secure user authentication.  
- **Swagger** – API documentation.  
- **Docker** – Containerized deployment for easy setup.  

---

## 🏗️ Entity Relationship Diagram (ERD)
The system is structured around four main entities:

![ERD Diagram](./docs/media/online-poll-erd.png)  

### 📌 Key Tables:
- **Users**: Stores user credentials.
- **Polls**: Represents polls created by users.
- **Poll Options**: Holds options related to each poll.
- **Votes**: Tracks votes cast by users.

## 🔥 Key Features

### ✅ User Authentication (JWT-based)
- Users must **sign up** and **log in** to create polls or vote.
- Authentication is managed using **JWT tokens**.

### 📊 Poll Management
- Users can create polls with multiple options.
- Each poll has a **title**, **description**, **creation date**, and an **expiry date**.

### 🎟️ Voting System
- Users can cast votes, ensuring **no duplicate votes** per poll.
- **Validation checks** are implemented to maintain integrity.

### 📡 Real-time Voting Updates
- **WebSockets** stream the latest voting data live.
- Users can view vote updates in **real-time** without refreshing.

### 🌍 Public Access to Results
- Anyone can view poll results **without authentication**.
- The results update dynamically via WebSockets.

### 📜 API Documentation
- All API endpoints are documented with **Swagger**.
- The documentation is accessible at **`/api/docs`**.


## ⚙️ Installation & Setup (Dockerized)  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/online-poll-system.git
cd online-poll-system
```

### 2️⃣ Set Up Environment Variables  
Create a **.env** file in the root directory with:  
```env
DATABASE_HOST=db
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=poll_system
JWT_SECRET=your-secret-key
PORT=5000
```

### 3️⃣ Run the Application with Docker  
```bash
docker-compose up --build
```

This will:  
✅ **Set up MySQL** in a container.  
✅ **Run the Node.js backend** inside a container.  
✅ Automatically apply **database migrations**.  

### 4️⃣ Verify It’s Running  
Once started, you should see:  
- **API running at:** `http://localhost:3000`  
- **Swagger API docs at:** `http://localhost:3000/api`  
- **MySQL running inside Docker**  

---
## 🔌 API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| POST   | `/api/auth/register` | Register a new user | ❌ No |
| POST   | `/api/auth/login` | Log in and get a token | ❌ No |
| POST   | `/api/polls` | Create a new poll | ✅ Yes |
| GET    | `/api/polls` | Get all polls | ❌ No |
| GET    | `/api/polls/:id` | Get a specific poll | ❌ No |
| POST   | `/api/polls/:id/vote` | Vote on a poll | ✅ Yes |
| GET    | `/api/polls/:id/results` | Get poll results | ❌ No |
| GET    | `/api/docs` | View API documentation | ❌ No |

## 📡 WebSocket Events
- **`polls/live`** → Broadcasts live poll updates.

## 🏁 Next Steps
- Implement **admin controls** for managing polls.
- Optimize WebSocket handling for scalability.
- Deploy to **AWS/GCP/DigitalOcean**.

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR.

## 📜 License
MIT License © 2025 Maduagwu Valentine / Collab.