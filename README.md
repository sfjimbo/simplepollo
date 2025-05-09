# NoMoSlido

A modern polling application built with React, TypeScript, Express, and Node.js.

## Features

### Poll Creation
- Create custom polls with unlimited options
- Set number of votes allowed per user
- Toggle showing results to voters
- Toggle allowing duplicate votes
- Simple, intuitive drag-and-drop interface for ordering options
- Mobile-responsive design

### Voting
- Clean, user-friendly voting interface
- Clear visual feedback for selected options
- Real-time validation of vote limits

### Results
- Real-time result updates
- Visual percentage bars
- Results are sorted by percentage (highest first)
- Admin-only view with live updates
- Responsive design that works on all devices

## Project Structure

This monorepo contains both frontend and backend code:

- `apps/frontend`: React application with TypeScript and Vite
- `apps/backend`: Express API with TypeScript

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nomoslido.git
   cd nomoslido
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

### Development

Start both the frontend and backend servers:

```
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### API Endpoints

- `POST /poll` - Create a new poll
- `GET /poll/:id` - Get poll details
- `POST /poll/:id/vote` - Vote on a poll
- `GET /poll/:id/results` - Get poll results

## Deployment

The application can be deployed as two separate services (frontend and backend) or as a single service with the backend serving the frontend static files.

### Frontend Deployment

Build the frontend:

```
cd apps/frontend
npm run build
```

This creates a `dist` directory with static files that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Backend Deployment

The Express backend can be deployed to any Node.js hosting service like Heroku, Render, or Railway.

## License

MIT 