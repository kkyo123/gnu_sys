# University Student Website Design

  This is a code bundle for University Student Website Design. The original project is available at https://www.figma.com/design/b6S4CBTOtI0QonrSHfV14v/University-Student-Website-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

# Frontend

This folder contains the frontend code for the application. It is built using **React** and **TypeScript**, with **Vite** as the build tool. The project is structured to ensure scalability, maintainability, and ease of collaboration.

## Folder Structure

### **src/pages/mypage/**
This folder contains the implementation of the `Mypage` feature. It is organized into the following subfolders:

- **sections/**: Handles data fetching and state management for specific sections of the page.
- **components/**: Contains reusable UI components.
- **hooks/**: Custom hooks for managing logic and state.
- **api/**: API clients and functions for server communication.
- **transforms/**: Functions for transforming and normalizing data.
- **data/**: Contains constants and mock data used in the application.

### **public/**
Static assets such as images and fonts.

### **build/**
Generated files after the build process.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and better developer experience.
- **Vite**: For fast builds and development.
- **ESLint**: For code linting.
- **Prettier**: For code formatting.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the application in your browser at `http://localhost:3000`.

## Contribution Guidelines

1. Follow the folder structure and naming conventions.
2. Write clean, reusable, and well-documented code.
3. Ensure all tests pass before submitting a pull request.
4. Use `eslint` and `prettier` to maintain code quality.

## Contact
For any questions or issues, please contact the development team.
