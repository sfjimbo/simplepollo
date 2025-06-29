import { useState, useEffect } from 'react'
import { PollCreator } from './components/PollCreator'
import { PollVoter } from './components/PollVoter'
import config from './config'
import './App.css'

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

function App() {
  const [createdPollId, setCreatedPollId] = useState<string | null>(null)
  const [view, setView] = useState<'create' | 'vote'>('create')
  const [pollId, setPollId] = useState<string | null>(null)
  const [results, setResults] = useState<PollResults | null>(null)
  const [loadingResults, setLoadingResults] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(lastUpdated);
  };

  // Check if URL contains a poll ID and determine the correct view
  useEffect(() => {
    const path = window.location.pathname
    
    // Check if path has the format "/poll/ID/results" (admin view)
    const adminMatch = path.match(/\/poll\/([^\/]+)\/results/)
    if (adminMatch && adminMatch[1]) {
      setPollId(adminMatch[1])
      setCreatedPollId(adminMatch[1])
      setView('create') // Use 'create' for the admin view
      fetchResults(adminMatch[1])
      return
    }
    
    // Check if path has the format "/poll/ID" (voter view)
    const voterMatch = path.match(/\/poll\/([^\/]+)$/)
    if (voterMatch && voterMatch[1]) {
      setPollId(voterMatch[1])
      setView('vote')
      return
    }
  }, [])

  // Fetch poll results
  const fetchResults = async (id: string) => {
    setLoadingResults(true)
    try {
      console.log('Refreshing results...')  // Debug log
      const response = await fetch(`${config.apiUrl}/poll/${id}/results`)
      
      if (!response.ok) {
        console.error('Failed to load results')
        return
      }
      
      const data = await response.json()
      console.log('Received results:', data)  // Debug log
      setResults(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching results:', err)
    } finally {
      setLoadingResults(false)
    }
  }

  const handlePollCreated = (pollId: string) => {
    setCreatedPollId(pollId)
    // Update URL to include "/results" to distinguish admin view
    window.history.pushState(
      {},
      'Poll Created',
      `/poll/${pollId}/results`
    )
    // Fetch initial results (will likely be empty)
    fetchResults(pollId)
  }

  const handleCreateAnother = () => {
    setCreatedPollId(null)
    setView('create')
    setResults(null)
    setLastUpdated(null)
    // Update URL without page reload
    window.history.pushState({}, 'Create Poll', '/')
  }

  // Refresh results periodically while on the success page
  useEffect(() => {
    if (!createdPollId) return
    
    // Fetch results immediately and then every 5 seconds
    fetchResults(createdPollId)
    
    const interval = setInterval(() => {
      fetchResults(createdPollId)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [createdPollId])

  return (
    <div className="app">
      <header className="main-header">
        <div className="header-content">
          <span className="main-title">Simple Pollo</span>
          <span className="subtitle">by Jim Morris</span>
        </div>
      </header>
      <main>
        {view === 'create' && !createdPollId ? (
          <PollCreator onPollCreated={handlePollCreated} />
        ) : view === 'vote' && pollId ? (
          <PollVoter pollId={pollId} />
        ) : (
          <div className="poll-created">
            <h2>Poll Created Successfully!</h2>
            <p>Share this link with your voters:</p>
            <div className="poll-link">
              <code>{`${window.location.origin}/poll/${createdPollId}`}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/poll/${createdPollId}`
                  )
                }}
              >
                Copy
              </button>
            </div>
            <button
              className="create-another"
              onClick={handleCreateAnother}
            >
              Create Another Poll
            </button>
            
            <div className="admin-results">
              {loadingResults ? (
                <div className="loading">Loading results...</div>
              ) : results ? (
                <div className="results-container">
                  <div className="admin-header">
                    <h3>Poll Results</h3>
                    <span className="admin-badge">Admin View</span>
                  </div>
                  <div className="total-votes">
                    <span className="votes-count">{results.totalVotes} total votes</span>
                    <span className="voter-count">from {results.voters || 0} {results.voters === 1 ? 'person' : 'people'}</span>
                  </div>
                  
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
                  <div className="last-updated">
                    {lastUpdated && `Last updated: ${formatLastUpdated()}`}
                  </div>
                </div>
              ) : (
                <div className="no-votes">No votes yet. Results will appear here as people vote.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
