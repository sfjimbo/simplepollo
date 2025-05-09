import { useState, useEffect } from 'react';
import './PollVoter.css';

interface PollOption {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  name: string;
  options: PollOption[];
  votesAllowed: number;
  showResultsToVoters: boolean;
  allowDuplicateVotes: boolean;
}

interface PollResults {
  totalVotes: number;
  options: {
    id: string;
    text: string;
    count: number;
    percent: number;
  }[];
  voters: number;
  linkClicks?: number;
}

interface PollVoterProps {
  pollId: string;
}

export function PollVoter({ pollId }: PollVoterProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voterId, setVoterId] = useState<string>(`user-${Math.random().toString(36).slice(2, 10)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<PollResults | null>(null);
  const [voted, setVoted] = useState(false);

  // Fetch poll data
  useEffect(() => {
    async function fetchPoll() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/poll/${pollId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load poll');
        }
        
        const data = await response.json();
        setPoll(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [pollId]);

  // Fetch poll results
  const fetchResults = async () => {
    if (!poll || !poll.showResultsToVoters) return;
    
    try {
      const response = await fetch(`http://localhost:4000/poll/${pollId}/results`);
      
      if (!response.ok) {
        throw new Error('Failed to load results');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error fetching results:', err);
    }
  };

  // Handle option selection
  const toggleOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      // Only allow selecting up to votesAllowed
      if (poll && selectedOptions.length < poll.votesAllowed) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else if (poll) {
        // Replace the first selected option if votesAllowed is reached
        const newSelected = [...selectedOptions];
        newSelected.shift();
        setSelectedOptions([...newSelected, optionId]);
      }
    }
  };

  // Submit votes
  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poll || selectedOptions.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:4000/poll/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterId,
          votes: selectedOptions,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }
      
      setVoted(true);
      
      // Fetch results after voting only if allowed
      if (poll.showResultsToVoters) {
        await fetchResults();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="poll-voter loading">Loading poll...</div>;
  }

  if (error) {
    return <div className="poll-voter error">{error}</div>;
  }

  if (!poll) {
    return <div className="poll-voter error">Poll not found</div>;
  }

  return (
    <div className="poll-voter">
      <h1 className="poll-name">{poll.name}</h1>
      
      {!voted ? (
        <form onSubmit={submitVote}>
          <div className="vote-instructions">
            Select {poll.votesAllowed === 1 ? 'one option' : `up to ${poll.votesAllowed} options`}
          </div>
          
          <div className="options-list">
            {poll.options.map((option) => (
              <label 
                key={option.id} 
                className={`option-item ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="option-checkbox"
                />
                <div className="option-text">{option.text}</div>
              </label>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="vote-button"
            disabled={isSubmitting || selectedOptions.length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        </form>
      ) : (
        <div className="vote-success">
          <div className="success-message">Thanks for voting!</div>
          
          {poll.showResultsToVoters && results && (
            <div className="results-container">
              <h2>Results</h2>
              <div className="total-votes">{results.totalVotes} total votes</div>
              
              <div className="results-list">
                {[...results.options]
                  .sort((a, b) => b.percent - a.percent)
                  .map((option) => (
                    <div key={option.id} className="result-item">
                      <div className="result-text">{option.text}</div>
                      <div className="result-bar-container">
                        {option.percent > 0 ? (
                          <div 
                            className="result-bar" 
                            style={{ width: `${option.percent}%` }}
                          >
                            <div className="result-percentage">
                              {option.percent}% 
                              <span className="result-count">({option.count} {option.count === 1 ? 'vote' : 'votes'})</span>
                            </div>
                          </div>
                        ) : (
                          <div className="result-bar-empty">
                            <div className="result-percentage-empty">
                              0% <span className="result-count">(0 votes)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 