# WeedBFF - Backend For Frontend

This is a base implementation for a BFF (Backend For Frontend) built with Node.js and TypeScript.

## Project Structure

- `src/index.ts`: Entry point of the application.
- `src/routes/`: Express route definitions.
- `src/controllers/`: Logic to handle requests and orchestrate calls to downstream services.
- `src/services/`: (Optional) dedicated services for external API calls using `axios`.
- `src/middlewares/`: Express middlewares (auth, logging, etc.).

## Endpoints

### Agenda (`/api/v0/agenda`)
- `GET /cliente/:id`: Search agenda by client ID.
- `GET /vendedor/:id`: Search agenda by seller ID.
- `DELETE /:id`: Delete agenda entry by ID.
- `POST /`: Create a new agenda entry.

### Payments (`/payments`)
- `GET /:id`: Get payment details by ID.
- `POST /`: Process a new payment.

### Properties (`/api/v0/propiedad`)
- `GET /:id`: Get property details by ID.
- `GET /`: List/Search properties.
- `POST /`: Create a new property.
- `PATCH /`: Partially update a property.
- `DELETE /:id`: Delete a property by ID.

### Users (`/users`)
- `POST /login`: User login.
- `POST /register`: User registration.
- `GET /:id`: Get user information (Requires auth).
- `PUT /:id`: Update user information (Requires auth).
- `DELETE /:id`: Delete user (Requires auth).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm run start
   ```
