# WpFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.14.

## Technology overview

* **Angular**: A platform and framework for building single-page client applications using HTML and TypeScript.
* **TypeScript**: A superset of JavaScript that adds static typing.
* **SCSS/CSS**: For styling components.

## Project Structure

The project follows a modular and well-organized structure to promote maintainability and scalability.

```
WP_FRONTEND/
├── .angular/                  # Angular CLI configuration files
├── .vscode/                   # VS Code specific settings
├── node_modules/              # Project dependencies
├── src/
│   ├── app/                   # Application source code
│   │   ├── core/              # Core application modules (e.g., authentication, services, interceptors)
│   │   │   ├── auth/          # Authentication related modules (guards, services)
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── services/      # Reusable application services
│   │   ├── features/          # Feature-specific modules (e.g., dropdown-menu, home, myworks, profile, story)
│   │   │   ├── dropdown-menu/
│   │   │   ├── home/
│   │   │   ├── myworks/       # Modules related to user's works (edit, landing, new, write)
│   │   │   ├── profile/       # User profile related modules (about, conversations, following, dialog)
│   │   │   └── story/         # Story specific modules
│   │   ├── layout/            # Layout components (footer, header, unauthorized-page)
│   │   ├── models/            # TypeScript interfaces/classes for data structures (DTOs)
│   │   ├── shared/            # Shared components, modules, enums, pipes, utils
│   │   │   ├── enums/
│   │   │   ├── loading-spinner/
│   │   │   ├── pipes/
│   │   │   └── utils/
│   │   ├── app.component.ts   # Root component
│   │   ├── app.config.ts      # Application configuration
│   │   ├── app.routes.ts      # Application routes
│   │   └── main.ts            # Entry point for the application
│   ├── assets/                # Static assets (images, fonts, etc.)
│   ├── environments/          # Environment-specific configuration
│   ├── index.html             # Main HTML file
│   ├── styles.css             # Global styles
│   └── tsconfig.app.json      # TypeScript configuration for the application
├── .editorconfig              # Editor configuration
├── .gitignore                 # Git ignore file
├── angular.json               # Angular CLI workspace configuration
├── openapiapitools.json       # OpenAPI/Swagger related configuration (if used for API generation)
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file
├── README.md                  # This README file
├── tsconfig.json              # Base TypeScript configuration
└── tsconfig.spec.json         # TypeScript configuration for tests
```

## Install and Run

Prerequisites
* Node.js (LTS version recommended)
* npm (usually comes with Node.js)
* Angular CLI:
``` bash
npm install -g @angular/cli
```
Installation
1. **Clone** the repository:
``` bash
git clone https://github.com/Ilonczai-Andras/WP_frontend
cd WP_FRONTEND
```

2. **Install** dependencies:
``` bash
npm install
```

Development Server

Run ng serve for a development server. Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

Key Features
* Authentication: User login, registration, and protected routes using guards.
* User Profiles: Display and manage user profiles, including conversations and following.
* Story Management: Create, edit, and view stories.
* Dynamic Layout: Responsive layout components (header, footer).
* API Integration: Services to interact with the backend API.

Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature-name).
3. Make your changes.
4. Commit your changes (git commit -m 'feat: Add new feature').
5. Push to the branch (git push origin feature/your-feature-name).
6. Create a Pull Request.

Please ensure your code adheres to the project's coding style and includes appropriate tests.

Contact
For any questions or issues, please contact [Your Name/Team Email Address].
