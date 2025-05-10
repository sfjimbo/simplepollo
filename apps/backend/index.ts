import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();
const router = Router();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', // In case the port changes
    process.env.FRONTEND_URL || '*' // Allow from the frontend URL in production
  ],
  credentials: true
}));
app.use(express.json());
app.use(router);

type Poll = {
  id: string;
  name: string;
  options: { id: string; text: string }[];
  votesAllowed: number;
  showResultsToVoters: boolean;
  allowDuplicateVotes: boolean;
  votes: Record<string, number[]>;
  createdAt: number;
  linkClicks: number;
};

const polls: Record<string, Poll> = {};

// Create a poll
router.post('/poll', (req: Request, res: Response) => {
  const {
    name = 'Choose Two',
    options = [],
    votesAllowed = 2,
    showResultsToVoters = false,
    allowDuplicateVotes = false,
  } = req.body;

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'At least two options required.' });
  }

  const pollId = randomUUID();
  const poll: Poll = {
    id: pollId,
    name,
    options: options.map((text: string) => ({ id: randomUUID(), text })),
    votesAllowed,
    showResultsToVoters,
    allowDuplicateVotes,
    votes: {},
    createdAt: Date.now(),
    linkClicks: 0,
  };

  polls[pollId] = poll;
  return res.json({ pollId });
});

// Get poll details
router.get('/poll/:id', (req: Request<{ id: string }>, res: Response) => {
  const poll = polls[req.params.id];
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  poll.linkClicks += 1;
  return res.json({
    id: poll.id,
    name: poll.name,
    options: poll.options,
    votesAllowed: poll.votesAllowed,
    showResultsToVoters: poll.showResultsToVoters,
    allowDuplicateVotes: poll.allowDuplicateVotes,
  });
});

// Vote on a poll
router.post('/poll/:id/vote', (req: Request<{ id: string }>, res: Response) => {
  const poll = polls[req.params.id];
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const { voterId, votes } = req.body;
  if (!voterId || !Array.isArray(votes)) {
    return res.status(400).json({ error: 'voterId and votes required' });
  }
  if (votes.length > poll.votesAllowed) {
    return res.status(400).json({ error: 'Too many votes' });
  }
  if (!poll.allowDuplicateVotes && new Set(votes).size !== votes.length) {
    return res.status(400).json({ error: 'Duplicate votes not allowed' });
  }

  poll.votes[voterId] = votes;
  return res.json({ success: true });
});

// Get poll results
router.get('/poll/:id/results', (req: Request<{ id: string }>, res: Response) => {
  const poll = polls[req.params.id];
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  // Tally votes
  const tally: Record<string, number> = {};
  for (const option of poll.options) {
    tally[option.id] = 0;
  }
  for (const votes of Object.values(poll.votes)) {
    for (const optionId of votes) {
      if (tally[optionId] !== undefined) tally[optionId]++;
    }
  }
  const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0);

  return res.json({
    options: poll.options.map(option => ({
      id: option.id,
      text: option.text,
      count: tally[option.id],
      percent: totalVotes ? Math.round((tally[option.id] / totalVotes) * 100) : 0,
    })),
    totalVotes,
    linkClicks: poll.linkClicks,
    voters: Object.keys(poll.votes).length,
  });
});

// Add a health check endpoint for Railway
router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});