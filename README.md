# Fuel Control Pro

Fuel Control Pro is a modern, responsive web application designed to help users track their vehicle's fuel consumption, mileage (km/l), and earnings from trips. By logging refueling stops and work-related trips, users can gain valuable insights into their vehicle's performance and profitability.

The application is built as a single-page application (SPA) using React, TypeScript, and Firebase for the backend, with a sleek, dark-themed UI styled with Tailwind CSS.

## Key Features

- **User Authentication**: Secure sign-up and login with Email/Password or Google Sign-In.
- **Fuel Logging**: Record refueling details such as odometer reading, liters purchased, and total cost.
- **Trip & Earnings Logging**: Track distance traveled and earnings for specific trips.
- **Automated Metrics**: The app automatically calculates crucial performance indicators:
  - Fuel efficiency (km/L)
  - Cost per kilometer (R$/km)
  - Average price per liter (R$/L)
  - Total fuel expenses
  - Total earnings and net profit
- **Insightful Dashboard**: A comprehensive dashboard visualizes all key metrics in an easy-to-understand format.
- **Detailed History**: A sortable and filterable table displays a complete history of all fuel and trip logs.
- **Data Persistence**: All user data is securely stored and synchronized in real-time using Google Firestore.

## Application Layout & Design

The application features a clean, modern, and dark-themed user interface that is fully responsive and accessible on both desktop and mobile devices.

- **Header**: Contains the application title and, for authenticated users, a user profile avatar and a logout button.
- **Authentication View**: Unauthenticated users are presented with a clean form to either log in or create a new account.
- **Main Dashboard**: The primary view for logged-in users. It is divided into three main sections:
  1.  **Dashboard Cards**: A grid of `StatCard` components at the top, providing a quick overview of the most important metrics like average consumption, cost per KM, and net profit.
  2.  **Input Forms**: Two side-by-side forms (`FuelForm` and `TripForm`) allow for easy and quick entry of new data. These forms provide helpful context, such as the last recorded odometer reading.
  3.  **History Table**: A detailed table (`HistoryTable`) at the bottom of the page lists all past entries, clearly distinguishing between fuel expenses and trip earnings. Each entry can be deleted.

## Project Structure

The project is organized into a modular structure to separate concerns and improve maintainability.

```
/
├── components/
│   ├── Auth.tsx             # Handles user login and registration.
│   ├── Dashboard.tsx        # Displays aggregated statistics.
│   ├── FuelForm.tsx         # Form for adding new fuel logs.
│   ├── HistoryTable.tsx     # Table displaying all logs.
│   ├── StatCard.tsx         # Reusable card for a single statistic.
│   ├── TripForm.tsx         # Form for adding new trip/earnings logs.
│   └── icons.tsx            # SVG icon components.
├── App.tsx                  # Main application component, manages state and logic.
├── firebaseConfig.ts        # Firebase SDK initialization and configuration.
├── index.html               # The main HTML entry point for the application.
├── index.tsx                # Mounts the React application to the DOM.
├── metadata.json            # Application metadata.
├── README.md                # This file.
└── types.ts                 # TypeScript type definitions for the application.
```

## Dependencies & Tech Stack

This project is built without a traditional bundler or build step. All dependencies are loaded directly in the browser via CDNs.

- **Core Framework**:
  - **React 19**: For building the user interface.
  - **TypeScript**: For static typing and improved code quality.

- **Backend & Database**:
  - **Firebase Authentication**: For handling user sign-up and login.
  - **Firebase Firestore**: A NoSQL database for real-time data storage and synchronization.

- **Styling**:
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

- **CDNs Used**:
  - `aistudiocdn.com`: Hosts React and ReactDOM.
  - `cdn.tailwindcss.com`: Provides the Tailwind CSS library.
  - `www.gstatic.com`: Hosts the Firebase SDKs.

## How to Run Locally

This project is set up to run directly in the browser without a build step. Dependencies are loaded via CDNs, so you do not need to use `npm install` or `yarn`.

To run the project on your local machine, you just need a local web server to serve the static files.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <DIRECTORY_NAME>
    ```

2.  **Start a local web server:**
    You can use any simple web server. Here are two popular options:

    *   **Using Python:**
        If you have Python installed, navigate to the project root and run:
        ```bash
        # For Python 3
        python -m http.server

        # For Python 2
        python -m SimpleHTTPServer
        ```

    *   **Using Node.js (with `npx`):**
        If you have Node.js installed, you can use the `serve` package without installing it globally:
        ```bash
        npx serve
        ```

3.  **Open in your browser:**
    After starting the server, open your browser and go to the address provided in your terminal, which is usually:
    - `http://localhost:8000` (for the Python server)
    - `http://localhost:3000` (for `serve`)

And that's it! The application should now be running locally.
