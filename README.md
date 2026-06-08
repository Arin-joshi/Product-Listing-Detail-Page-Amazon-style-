# 🛒 Amazon-Style Product Listing & Detail Page

Welcome to the **Amazon-Style Product Listing & Detail Page** project! This is a modern, responsive, and dynamic web application built to simulate the familiar and seamless shopping experience you find on major e-commerce platforms like Amazon.

## ✨ What's Inside?

We've built this project focusing on a clean, premium user interface and smooth interactions. Here are some of the core features:

- **Product Listing Page:** A beautiful grid or list view showcasing products with their images, prices, and ratings.
- **Product Detail Page:** Deep dive into a specific product! View high-quality images, read detailed descriptions, check reviews, and hit that "Add to Cart" button.
- **Modern Aesthetics:** We've stepped away from basic layouts. Expect vibrant interfaces, sleek micro-animations, and a responsive design that looks great on any device (desktop, tablet, or mobile).
- **Smooth Navigation:** Seamless routing between the listing and detail pages without full page reloads.

## 🛠️ Built With Love & Modern Tech

This application leverages the power of some of the best modern web development tools:

- **React 19:** For building dynamic and reusable UI components.
- **Vite:** Our lightning-fast frontend tooling and development server.
- **Tailwind CSS v4:** For rapid, utility-first styling that keeps our design consistent and beautiful.
- **Framer Motion:** To add those subtle, engaging micro-animations that make the app feel "alive."
- **Radix UI:** For accessible, unstyled UI primitives like dialogs and dropdown menus.
- **React Router DOM:** Handling our seamless page navigation.
- **TypeScript:** Ensuring our code is robust and type-safe.

## 🚀 Setup Instructions

Want to run this locally on your machine? It's super easy! Just follow these steps:

### 1. Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### 2. Start the Development Server
Once the installation is complete, fire up the local server:
```bash
npm run dev
```

### 3. Open in Browser
Your app should now be running! Open your browser and navigate to `http://localhost:3000` (or whichever port Vite provides in your terminal) to see it in action.

## 🤔 Assumptions Made

During the development of this application, the following assumptions were made:
- Data for products (images, prices, descriptions, reviews) is mocked and available locally rather than fetched from a live backend API.
- The primary target audience uses modern browsers that support CSS variables, Flexbox, and Grid layouts.
- Authentication and user session management are out of scope for this UI-focused prototype.
- The shopping cart state is managed locally in memory (or using a state management library/Context API) and does not persist across hard reloads or sessions.

## 🏗️ Architectural Decisions

- **Component-Driven Design:** The UI is broken down into small, reusable components (e.g., `ProductCard`, `Button`, `RatingStars`) to promote reusability and maintainability.
- **Client-Side Routing:** Utilized React Router to provide a seamless, Single Page Application (SPA) experience without full page reloads when navigating between listing and detail pages.
- **Utility-First CSS:** Chose Tailwind CSS for styling to keep styles close to the markup, enabling rapid iteration and ensuring a consistent design system.
- **Animation Strategy:** Used Framer Motion for complex micro-interactions and route transitions, while keeping basic hover states handled by Tailwind utilities for performance.

## 🌟 Improvements If Given More Time

If we had more time to expand on this project, we would focus on the following enhancements:
- **Backend Integration:** Connect the frontend to a real backend (e.g., Node.js/Express or a headless CMS) to fetch dynamic product data and manage inventory.
- **State Persistence:** Implement local storage or Redux/Zustand to persist the shopping cart state across page reloads.
- **Search and Filtering:** Add robust search functionality, category filtering, and sorting options (e.g., by price, rating) on the product listing page.
- **User Authentication:** Allow users to create accounts, log in, view order history, and save items to a wishlist.
- **Accessibility (a11y) Enhancements:** Conduct a thorough accessibility audit to ensure full keyboard navigability and screen reader support, building upon the Radix UI primitives.
- **Testing:** Add comprehensive unit tests (using Jest/React Testing Library) and end-to-end tests (using Cypress or Playwright) to ensure application stability.

## 🤝 Let's Connect!
Feel free to explore the code, tweak the styles, and make it your own. Happy coding! 🎉
