# Padharo India

Padharo India is a comprehensive web application designed to streamline the process of booking various travel services across India. This platform serves as a one-stop solution for travelers, offering functionalities to book cabs, hotels, tour guides, and curated tour packages.

The project is built with a modern tech stack, featuring a React frontend and a Node.js (Express) backend, connecting to a MySQL database.

## Tech Stack

  * **Frontend:** React, React Router, Tailwind CSS
  * **Backend:** Node.js, Express.js
  * **Database:** MySQL
  * **Authentication:** JSON Web Tokens (JWT), bcrypt
  * **Build Tool:** Vite
  * **API Testing/Development:** (Implicitly, tools like Postman or Insomnia would be used)

## Getting Started

To get a local copy up and running, follow these simple steps. This project is structured as a monorepo with the frontend in the root (`/`) and the backend in `/padharo-india-backend`.

### Prerequisites

  * Node.js (v18 or later recommended)
  * npm (or yarn)
  * A running MySQL server instance

### Backend Setup

1.  **Navigate to the Backend Directory**

    ```sh
    cd shivansh-bharti2002/padharo-india/Padharo-India-577026f61f8c9bea860b2d2ffcd190ddf02eb68e/padharo-india-backend
    ```

2.  **Install Dependencies**

    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the `padharo-india-backend` directory. This file is required to store your database credentials and JWT secret.

    ```env
    # Server Port (Vite proxies to 8080 by default)
    PORT=8080

    # MySQL Database Connection
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=padharo_india_db

    # JWT Configuration
    JWT_SECRET=your_super_secret_key_here
    JWT_EXPIRES_IN=1d
    ```

    **Note:** The backend is configured to automatically create the database (`padharo_india_db`) and its tables if they do not exist when you first run the server.

4.  **Run the Backend Server**
    For development with live reloading (using nodemon):

    ```sh
    npm run dev
    ```

    The backend server will start, typically on `http://localhost:8080`.

### Frontend Setup

1.  **Open a New Terminal**
    Navigate to the frontend (root) directory of the project.

    ```sh
    cd shivansh-bharti2002/padharo-india/Padharo-India-577026f61f8c9bea860b2d2ffcd190ddf02eb68e
    ```

2.  **Install Dependencies**

    ```sh
    npm install
    ```

3.  **Run the Frontend Development Server**

    ```sh
    npm run dev
    ```

    This will start the Vite development server, usually at `http://localhost:5173`.

4.  **Access the Application**
    Open `http://localhost:5173` in your browser. The frontend is configured to proxy all API requests (starting with `/api` or `/uploads`) to your backend server running on `http://localhost:8080`.
