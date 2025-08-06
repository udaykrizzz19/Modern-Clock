# Modern Clock Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![React](https://img.shields.io/badge/React-18.2.0-%2361DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-%2338B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, feature-rich web application that replicates and enhances the core functionalities of the Android Clock app. Built with React, TypeScript, and Tailwind CSS, this project provides a seamless and responsive user experience for managing time-related tasks.

## ✨ Features

This application is divided into four main modules, each packed with useful features:

*   **⏰ Alarm**
    *   **Add, Edit, and Delete Alarms**: Full control over your alarm list.
    *   **Toggle Activation**: Easily enable or disable alarms with a single click.
    *   **Custom Sounds**: Choose from a selection of sounds to wake up to.
    *   **Dismiss Challenges**: (Optional) Solve a simple challenge to ensure you're awake before dismissing an alarm.
    *   **Snooze Functionality**: Postpone alarms for a few more minutes.

*   **⏱️ Stopwatch**
    *   **Precise Timing**: Start, stop, and reset functionality with millisecond accuracy.
    *   **Lap Tracking**: Record and view lap times without interrupting the main timer.
    *   **Clean Time Formatting**: Displays time in a clear `HH:MM:SS.ms` format.

*   **⏳ Timer**
    *   **Interactive Countdown**: A visual and interactive countdown timer.
    *   **Preset Options**: Quickly start timers for common durations (e.g., 1, 5, 10 minutes).
    *   **Multiple Timers**: Run several timers simultaneously.
    *   **Desktop Notifications**: Receive a browser notification when a timer completes.

*   **🌍 World Clock**
    *   **City Selection**: Add clocks for various cities around the world from a comprehensive list.
    *   **Time Difference**: Instantly see the time difference relative to your local time.
    *   **Dynamic Updates**: All clocks update in real-time.

## 🚀 Live Demo

Check out the live version of the application here:
**[https://modern-clock.vercel.app/](https://modern-clock.vercel.app/)**

---

## 🛠️ Technology Stack

This project leverages a modern and powerful tech stack to deliver a high-quality user experience.

| Category           | Technology                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**       | [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)                            |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/)                                                                    |
| **State Management** | [Context API](https://reactjs.org/docs/context.html) & [Zustand](https://github.com/pmndrs/zustand)          |
| **Build Tool**     | [Vite](https://vitejs.dev/)                                                                                 |
| **Icons**          | [Lucide React](https://lucide.dev/)                                                                         |
| **Animation**      | [Framer Motion](https://www.framer.com/motion/)                                                             |

---

## 📂 Project Structure

The project follows a modular and organized structure to ensure maintainability and scalability.



---

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    Using pnpm (recommended):
    ```sh
    pnpm install
    ```
    Or using npm:
    ```sh
    npm install
    ```
### Running the Application

1.  **Start the development server:**
    ```sh
    pnpm run dev
    ```
    The application will be available at `http://localhost:5173`.

2.  **Lint the code:**
    Run ESLint to check for code quality and style issues.
    ```sh
    pnpm run lint
    ```

3.  **Build for production:**
    This command bundles the application into the `dist/` directory for deployment.
    ```sh
    pnpm run build
    ```

---

```text
shadcn-ui/
├── README.md                  # Project documentation
├── components.json            # Component configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # Main HTML file
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── public/                    # Public assets
│   ├── favicon.svg            # Favicon
│   └── images/                # Image assets
├── src/                       # Source code
│   ├── App.css                # Global styles
│   ├── App.tsx                # Main application component
│   ├── components/            # Reusable UI components
│   ├── contexts/              # Context API for global state management
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and theme management
│   └── pages/                 # Page components (Alarm, Stopwatch, etc.)
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # Base TypeScript configuration
└── vite.config.ts             # Vite build configuration

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Uday - udaykrizzz08@gmail.com
