# Eco Route Planner

Eco Route Planner is a full-stack web application that helps users plan eco-friendly routes and track carbon savings. It is built using Node.js, Express, MongoDB, and React. The backend provides APIs for route management, user management, and environmental data, while the frontend offers an interactive user interface for viewing and managing routes.

## Project Structure

This project contains the following main files and folders:

- server.js or index.js: Main entry point for the backend server.
- routes/: Contains all route files such as users.js, eco.js, and routes.js.
- models/: Contains Mongoose schemas and models for MongoDB.
- frontend/: React-based frontend application.
- .env: Contains environment variables (not uploaded to GitHub for security).

## Technologies Used

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- React.js  
- CORS  
- Helmet  
- Morgan  
- Dotenv  

## Installation Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/sujal302004/eco-route-planner.git
Navigate into the project directory:


cd eco-route-planner
Install dependencies for the backend:

npm install
Navigate to the frontend folder and install dependencies:

cd frontend
npm install
Go back to the root folder and start the backend:


npm start
To run the frontend:

cd frontend
npm start
Environment Variables
Create a .env file in the root directory and add the following variables:


MONGO_URI=your_mongodb_connection_string
PORT=3001
Project Features
User registration and login

Eco-friendly route suggestions

Carbon savings calculation

Real-time tracking using map APIs

Secure data management using MongoDB and Mongoose

Optimized API structure with Express.js

Routes Included
routes/routes.js: Main route handler for eco-friendly path calculations.

routes/users.js: Handles user authentication and profile management.

routes/eco.js: Handles environmental data and analytics.

API Endpoints
Example API routes:


GET /api/routes
POST /api/routes
GET /api/users
POST /api/users/register
POST /api/users/login
How to Run Using Docker (Optional)
Ensure Docker and Docker Compose are installed.

Run the following command:

docker-compose up -d
The backend will run on port 3001 and the frontend on port 3000.

Accessing the Application
Frontend: http://localhost:3000
Backend API: http://localhost:3001

Author
Developed by Sujal Kabra
GitHub: https://github.com/sujal302004
Email: sujalkabra30@gmail.com


Datasets Used
Eco Route Environmental Data (Harvard Dataverse)
Link: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/XYZ123

Global CO₂ Emission and Routing Dataset (Zenodo)
Link: https://zenodo.org/record/7890123

