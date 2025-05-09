# NoMoSlido Frontend

A modern polling application frontend built with React, TypeScript, and Vite.

## Features

- Create polls with customizable options
- Set number of allowed votes per user
- Toggle showing results to voters
- Allow or disallow duplicate votes
- Vote on polls with a clean, intuitive interface
- View poll results with visual bars and percentages

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd apps/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Development Server

```
npm run dev
```

This starts the development server at http://localhost:5173.

### Building for Production

```
npm run build
```

This creates a production-ready build in the `dist` directory.

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `PollCreator.tsx` - Component for creating polls
    - `PollVoter.tsx` - Component for voting on polls
  - `App.tsx` - Main application component with routing
  - `main.tsx` - Application entry point

## Routing

The application uses simple client-side routing:

- `/` - Home page with poll creation interface
- `/poll/:pollId` - Voting interface for a specific poll

## API Integration

The frontend communicates with the backend API at `http://localhost:4000` for:

- Creating polls
- Fetching poll details
- Submitting votes
- Viewing poll results

## Responsive Design

The UI is fully responsive and works well on mobile, tablet, and desktop devices.
