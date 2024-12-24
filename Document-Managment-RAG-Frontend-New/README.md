# DocumentManagementUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Folder structure:

src/
│
├── app/
│   ├── core/                   // Core module for singleton services and core components
│   │   ├── services/           // Core services (e.g., authentication, API services)
│   │   ├── guards/             // Route guards
│   │   └── interceptors/       // HTTP interceptors
│   │
│   ├── shared/                 // Shared module for reusable components, directives, and pipes
│   │   ├── components/         // Shared components (e.g., buttons, modals)
│   │   ├── directives/         // Shared directives
│   │   └── pipes/              // Shared pipes
│   │
│   ├── features/               // Feature modules for each major feature
│   │   ├── auth/               // Authentication module
│   │   │   ├── login/          // Login component
│   │   │   └── signup/         // Signup component
│   │   │
│   │   ├── user-management/    // User management module
│   │   │   ├── user-list/      // User list component
│   │   │   └── user-detail/    // User detail component
│   │   │
│   │   ├── document-management/ // Document management module
│   │   │   ├── document-list/  // Document list component
│   │   │   └── document-upload/ // Document upload component
│   │   │
│   │   ├── ingestion-management/ // Ingestion management module
│   │   │   └── ingestion-status/ // Ingestion status component
│   │   │
│   │   └── qa-interface/       // Q&A interface module
│   │       └── qa-view/        // Q&A view component
│   │
│   ├── app-routing.module.ts   // Main routing module
│   ├── app.component.ts        // Root component
│   └── app.module.ts           // Root module
│
└── assets/                    

