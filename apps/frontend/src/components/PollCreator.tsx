import { useState, useEffect } from 'react';
import './PollCreator.css';

// Icons for better visual appearance
const RemoveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg>
);

// Simple circle plus icon matching the user's image
const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" stroke="black" strokeWidth="2"/>
    <path d="M12 6L12 18" stroke="black" strokeWidth="2"/>
    <path d="M6 12L18 12" stroke="black" strokeWidth="2"/>
  </svg>
);

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  onPollCreated: (pollId: string) => void;
}

export function PollCreator({ onPollCreated }: PollCreatorProps) {
  const [name, setName] = useState('Choose Two');
  const [options, setOptions] = useState<PollOption[]>([
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
  ]);
  const [votesAllowed, setVotesAllowed] = useState(2);
  const [showResultsToVoters, setShowResultsToVoters] = useState(false);
  const [allowDuplicateVotes, setAllowDuplicateVotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset votesAllowed if it's more than the number of options
  useEffect(() => {
    if (votesAllowed > options.length) {
      setVotesAllowed(options.length);
    }
  }, [options.length, votesAllowed]);

  const addOption = () => {
    setOptions([...options, { id: generateId(), text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Filter out empty options
    const validOptions = options.map(opt => opt.text).filter(opt => opt.trim() !== '');
    
    if (validOptions.length < 2) {
      setError('Please provide at least two options');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          options: validOptions,
          votesAllowed,
          showResultsToVoters,
          allowDuplicateVotes,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create poll');
      }
      
      onPollCreated(data.pollId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="poll-creator">
      <h2>Create a New Poll</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="poll-name">Poll Name</label>
          <input
            id="poll-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          <div className="options-container">
            {options.map((option, index) => (
              <div key={option.id} className="option-input">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option"
                  style={{ visibility: options.length > 2 ? 'visible' : 'hidden' }}
                  aria-label="Remove option"
                >
                  <RemoveIcon />
                </button>
              </div>
            ))}
          </div>
          <div className="add-option-row">
            <button 
              type="button" 
              onClick={addOption} 
              className="add-option-icon" 
              title="Add Option"
              aria-label="Add option"
            >
              <AddIcon />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="votes-allowed">Votes Allowed</label>
          <div className="votes-row">
            <select
              id="votes-allowed"
              value={votesAllowed}
              onChange={(e) => setVotesAllowed(Number(e.target.value))}
              required
              className="votes-select"
            >
              {options.map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <button
              type="button"
              className="shuffle-btn"
              onClick={() => setOptions(shuffleArray(options))}
            >
              Randomize Poll
            </button>
          </div>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={showResultsToVoters}
              onChange={(e) => setShowResultsToVoters(e.target.checked)}
            />
            Show results to voters
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={allowDuplicateVotes}
              onChange={(e) => setAllowDuplicateVotes(e.target.checked)}
            />
            Allow duplicate votes
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
} 