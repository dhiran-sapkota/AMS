# Frontend Application for Artist Management System

This is the React.js frontend application that interacts with the backend API for managing artists, music, and users. It uses React Query for state management and caching, and Axios for handling HTTP requests to the backend API. Uses ShadcnUI for generating reusable UI components with tailwindCSS.

## Features

- **React.js**: Core frontend framework for building the user interface.
- **React Query**: Data fetching, caching, synchronization, and more for React applications.
- **Component-Based Architecture**: Clean, modular structure with reusable components.

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js**: >= 16.x
- **Yarn**: Package manager (or you can use npm)

### Step-by-step Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/dhiransapkota45/cloco-fronend
    ```

2. **Install dependencies**:

    Navigate to the project directory and run:

    ```bash
    cd cloco-frontend
    npm install
    ```

3. **Environment Variables**:

    Create a `.env` file in the root directory as provided in ```.env.example``` file

4. **Start the Development Server**:

    To start the frontend development server, run:

    ```bash
    npm run dev
    ```

    This will start the application on `http://localhost:5173`.

5. **Build for Production**:

    To build the application for production, use:

    ```bash
    npm run build
    ```

    This will create an optimized production build in the `build/` folder.

## Project Structure

```bash
src/
├── components/         # Reusable UI components
├── pages/              # Page components for different routes
├── hooks/              # Custom React hooks
├── services/           # Axios setup and API request services
├── contexts/           # Context for handling overall state of application
└── App.js              # Main entry point for the application
