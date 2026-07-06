# AI-Assisted Development Documentation

## Project Overview
This project is an auto-repair shop reservation system with a Flask backend, a simple browser-based frontend, and an SQLite database. It allows customers to book services, checks for availability, and provides a basic dashboard for viewing reservations and statistics.

## System Architecture by Module

### 1. Presentation / UI Module
- Approach and reasoning: The UI was designed as a lightweight, easy-to-use web interface with sections for dashboard, reservations, customers, and booking.
- Development workflow: I defined the form structure, navigation, and interaction flow, then generated the JavaScript logic for loading data and handling submissions.
- Testing strategy: I validated the UI manually by opening the app, filling the form, and checking that the interface updated correctly.

### 2. API / Controller Module
- Approach and reasoning: The backend was organized as a REST API with endpoints for managing customers, services, reservations, availability, statistics, and health checks.
- Development workflow: I generated Flask routes for each resource and refined the response format so the frontend could consume the data reliably.
- Testing strategy: I verified the endpoints through direct requests and confirmed that the responses matched expected behavior.

### 3. Business Logic Module
- Approach and reasoning: The reservation logic was implemented around the core rule that a time slot cannot be booked twice on the same date.
- Development workflow: I added validation rules for required fields and used availability checks before creating a reservation.
- Testing strategy: I tested both valid and invalid reservation attempts to confirm the correct behavior.

### 4. Data Model / Database Module
- Approach and reasoning: The system uses SQLAlchemy models to represent customers, services, and reservations with relationships between them.
- Development workflow: I generated the models and defined the key fields such as name, phone, price, duration, reservation date, and status.
- Testing strategy: I initialized the database and verified that records were stored and retrieved correctly.

### 5. Initialization / Seeding Module
- Approach and reasoning: A setup script was added so the project can be started quickly with sample data for local development.
- Development workflow: I created a script that initializes the database tables and inserts example services, customers, and reservations.
- Testing strategy: I ran the script successfully and confirmed that the sample data appeared in the database.

### 6. Testing Module
- Approach and reasoning: Testing focused on both backend behavior and UI interaction.
- Development workflow: I created test ideas for core actions such as booking form submission, displaying services, and handling errors.
- Testing strategy: I executed the available tests and used the results to refine the implementation where needed.

## AI Tool Comparison

### GitHub Copilot
- Helped the most for day-to-day coding tasks.
- Best for generating boilerplate, Flask routes, JavaScript fetch logic, and SQLAlchemy models.
- Strength: fast and context-aware code suggestions inside the editor.

### Other tools considered
- General-purpose AI assistants can help with planning and documentation, but Copilot was most effective in this workflow because it integrated directly with the project files and coding tasks.

## Development Process
1. Review the project structure and identify the main modules.
2. Generate the backend endpoints and database models.
3. Implement the frontend for interacting with the API.
4. Add validation and business rules for bookings.
5. Initialize the database and verify the app through live requests.
6. Document the results and prepare the final report.

## Challenges Encountered
- Connecting the frontend and backend reliably.
- Preventing double-booking while preserving a simple implementation.
- Setting up the environment and installing the required dependencies.

## Working System Evidence
The following evidence confirmed that the system works:
- The Flask server started successfully on port 5000.
- The health endpoint returned a successful JSON response.
- The statistics endpoint returned live values from the database.

Example terminal evidence:
- Health endpoint: status OK
- Statistics endpoint: total customers, total reservations, confirmed reservations, and total services returned correctly

## Summary
The project demonstrates a complete small software system built with a clear separation between UI, API, business rules, and database logic. AI assistance significantly sped up the implementation and made it easier to iterate on the design.
