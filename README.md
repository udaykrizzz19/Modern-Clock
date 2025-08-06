# Modern Clock App Clone

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-F7DF1E?style=flat&labelColor=555" alt="License">
  </a>
  <a href="https://github.com/udaykrizzz19/Modern-Clock/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-4c1?style=flat&labelColor=555" alt="PRs Welcome">
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white&labelColor=555" alt="React">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=555" alt="TypeScript">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white&labelColor=555" alt="Tailwind CSS">
  </a>
</p>

<p align="center">
  A feature-rich, pixel-perfect clone of a modern mobile clock application, built with React, Vite, TypeScript, and Tailwind CSS.
</p>

<p align="center">
  <a href="YOUR_LIVE_DEMO_URL_HERE"><strong>View Live Demo »</strong></a>
</p>

---

<div align="center">

<!-- IMPORTANT: Create a GIF of your app and replace this placeholder -->
<img src="https://your-gif-url-here.com/app-demo.gif" alt="App Demo GIF" width="350"/>

</div>

## About The Project

This project is a comprehensive and interactive web-based clock application designed to replicate the sleek UI and robust functionality of modern mobile clock apps (like those on Samsung or iOS). It's built from the ground up with a focus on a clean component architecture, smooth animations, and a seamless user experience that feels like a native application.

The application is a single-page app (SPA) that includes an Alarm, Timer, Stopwatch, and World Clock, all managed through a centralized context and persistent state.

## ✨ Key Features

-   **⏰ Alarms:**
    -   Create, edit, and delete multiple alarms.
    -   Interactive, scrollable **Time Wheels** for a tactile time-setting experience.
    -   **Double-tap** a number on the wheel to switch to keyboard input for precision.
    -   A robust background service ensures alarms **ring reliably** at the set time, even if the tab is not active.
    -   Customizable repeat days, labels, and vibration settings.

-   **⏱️ Stopwatch:**
    -   Accurate stopwatch functionality immune to browser tab throttling.
    -   A clean, modern **laps list** that highlights the fastest and slowest laps.
    -   Auditory feedback with a "click" sound on lap creation.

-   **⏳ Timer:**
    -   Set timers using a beautiful, modern scroll-wheel UI.
    -   Circular progress indicator to visualize remaining time.
    -   Persistent timer logic that continues counting down in the background.

-   **🎨 Modern UI/UX:**
    -   A macOS-style **Dock** for intuitive navigation between features.
    -   Fluid animations powered by **Framer Motion**.
    -   **Locked viewport** with no scrolling or user zooming for a native-app feel.
    -   **Dark & Light** theme support.

-   **💾 State Persistence:**
    -   All alarms, settings, and themes are automatically saved to `localStorage`, so your configuration persists between sessions.

## 🛠️ Tech Stack

This project is built with a modern and efficient technology stack, highlighted by the tools below:

<p>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-5.2.0-646CFF?style=flat&logo=vite&logoColor=white&labelColor=555" alt="Vite">
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white&labelColor=555" alt="React">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=555" alt="TypeScript">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white&labelColor=555" alt="Tailwind CSS">
  </a>
  <a href="https://www.framer.com/motion/">
    <img src="https://img.shields.io/badge/Framer_Motion-11.1.7-E100C3?style=flat&logo=framer&logoColor=white&labelColor=555" alt="Framer Motion">
  </a>
  <a href="https://ui.shadcn.com/">
    <img src="https://img.shields.io/badge/shadcn/ui-latest-black?style=flat&logo=shadcnui&logoColor=white&labelColor=555" alt="shadcn/ui">
  </a>
</p>


## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/udaykrizzz19/Modern-Clock.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Modern-Clock/workspace/shadcn-ui
    ```
3.  **Install dependencies:**
    ```sh
    pnpm install
    ```
4.  **Run the development server:**
    ```sh
    pnpm run dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) (or the URL provided by Vite) in your browser to see the application.

## 📂 File Structure

The project follows a clean and organized structure to promote maintainability and scalability.

```
/src
├── components/
│   ├── features/      # Main feature components (Alarm, Timer, etc.)
│   ├── layout/        # Global layout components (ClockLayout, Dock)
│   └── ui/            # Reusable UI primitives from shadcn/ui
├── contexts/
│   └── ClockContext.tsx # Centralized state management for the entire app
├── hooks/
│   ├── use-local-storage.ts # Hook for persisting state
│   └── use-stopwatch.ts     # Logic for the stopwatch
├── lib/
│   └── utils.ts       # Helper functions (e.g., formatTime)
└── App.tsx              # Main application entry point
```

## 🧠 Architectural Decisions

-   **Centralized State with Context API:** Instead of a heavy state management library like Redux, the `React Context API` is used to provide global state (theme, alarms, active tab). This keeps the application lightweight while ensuring all components have access to the data they need.
-   **Robust Timer/Alarm Logic:** The core logic for the timer, stopwatch, and alarm service does not rely on `setInterval`'s timing accuracy. Instead, it uses `Date.now()` to calculate the elapsed/remaining time, making it immune to browser tab throttling and ensuring accuracy.
-   **Headless UI & Composition:** The project leverages `shadcn/ui`, which is built on top of Radix UI primitives. This provides a foundation of accessible, unstyled components that are then styled with Tailwind CSS, offering maximum flexibility and control over the final design.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

-   Inspired by the beautiful and functional designs of the Samsung Clock and iOS Clock applications.
-   [shadcn/ui](https://ui.shadcn.com/) for the excellent component library.
-   [Framer Motion](https://www.framer.com/motion/) for the powerful animation tools.
