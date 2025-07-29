# Copilot Stats

This NestJS application collects and exposes statistics from the GitHub CLI (`gh`). It interacts with the GitHub CLI to fetch repository or user stats, making it easy to integrate GitHub data into your workflows or dashboards.

## Project Setup

Follow these steps to set up and run the project:

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Running the Application

```bash
# Start the application in development mode
npm run start:dev
# or
yarn start:dev
```

The application will start on the default NestJS port (usually 3000). You can access the endpoints to retrieve GitHub stats as defined in the app.

### Environment Variables

Make sure to configure any required environment variables (e.g., GitHub tokens) in a `.env` file if needed.

## Additional Notes

- This project uses the GitHub CLI under the hood, so ensure it is installed and authenticated before running the app.
- For more details on available endpoints and usage, refer to the source code or API documentation (if available).
