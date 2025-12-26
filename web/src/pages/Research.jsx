import { useState } from 'react'

const MCP_SERVERS = [
  {
    id: 'node',
    name: 'Node.js MCP',
    port: 3007,
    language: 'JavaScript',
    framework: 'Express',
    sources: ['PubMed', 'arXiv'],
    color: '#68a063'
  },
  {
    id: 'python',
    name: 'Python MCP',
    port: 3008,
    language: 'Python',
    framework: 'FastAPI',
    sources: ['ScienceDirect', 'Google Scholar'],
    color: '#3776ab'
  },
  {
    id: 'go',
    name: 'Go MCP',
    port: 3009,
    language: 'Go',
    framework: 'Gin',
    sources: ['CrossRef', 'OpenAlex'],
    color: '#00add8'
  }
]

export default function Research() {
  const [selectedServer, setSelectedServer] = useState('node')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState({})

  const checkServerStatus = async (serverId) => {
    const server = MCP_SERVERS.find(s => s.id === serverId)
    try {
      const response = await fetch(`http://localhost:${server.port}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      })
      return response.ok
    } catch {
      return false
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResults([])

    const server = MCP_SERVERS.find(s => s.id === selectedServer)
    
    try {
      // Check server status first
      const isOnline = await checkServerStatus(selectedServer)
      if (!isOnline) {
        setResults([{
          type: 'error',
          message: `${server.name} server is not running on port ${server.port}`
        }])
        return
      }

      // Make search request
      const response = await fetch(`http://localhost:${server.port}/research/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults: 10 })
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      setResults([{
        type: 'error',
        message: `Failed to search: ${error.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const getCurrentServer = () => MCP_SERVERS.find(s => s.id === selectedServer)

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>AI Research Platforms</h2>
        <p>Multi-language MCP servers for medical research</p>
      </div>

      {/* Server Selection */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '16px', margin: 0 }}>Select MCP Server</h3>
        </div>
        <div className="card-content">
          <div className="status-pill-row">
            {MCP_SERVERS.map((server) => (
              <button
                key={server.id}
                type="button"
                className={`status-pill ${selectedServer === server.id ? 'status-pill--active' : ''}`}
                onClick={() => setSelectedServer(server.id)}
                style={{
                  borderColor: selectedServer === server.id ? server.color : undefined,
                  color: selectedServer === server.id ? server.color : undefined
                }}
              >
                {server.name}
              </button>
            ))}
          </div>

          {/* Server Info */}
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '12px',
            borderLeft: `4px solid ${getCurrentServer().color}`
          }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                  {getCurrentServer().name}
                </span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '999px', 
                  fontSize: '12px',
                  backgroundColor: getCurrentServer().color,
                  color: 'white',
                  fontWeight: '600'
                }}>
                  Port {getCurrentServer().port}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong>Language:</strong> {getCurrentServer().language} • <strong>Framework:</strong> {getCurrentServer().framework}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong>Data Sources:</strong> {getCurrentServer().sources.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-content">
            <div className="form-group">
              <label>Research Query</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., diabetes treatment guidelines, cancer immunotherapy..."
                disabled={loading}
              />
            </div>
          </div>
          <div className="card-footer" style={{ justifyContent: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Searching...
                </>
              ) : (
                <>🔍 Search</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '16px', margin: 0 }}>
              Results ({results.length})
            </h3>
          </div>
          <div className="card-content">
            {results[0]?.type === 'error' ? (
              <div className="alert alert-error">
                {results[0].message}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {results.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderLeft: `4px solid ${getCurrentServer().color}`
                    }}
                  >
                    <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                      {result.title || 'Untitled'}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {result.abstract || result.description || 'No description available'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {result.authors && (
                        <span>👤 {result.authors}</span>
                      )}
                      {result.year && (
                        <span>📅 {result.year}</span>
                      )}
                      {result.source && (
                        <span>📚 {result.source}</span>
                      )}
                    </div>
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: '8px',
                          fontSize: '13px',
                          color: 'var(--primary)',
                          textDecoration: 'none'
                        }}
                      >
                        View Article →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {results.length === 0 && !loading && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '16px', margin: 0 }}>Getting Started</h3>
          </div>
          <div className="card-content">
            <div className="empty-state">
              <div className="empty-state-icon">🔬</div>
              <div className="empty-state-title">Start Your Research</div>
              <div className="empty-state-message">
                Select an MCP server above and enter a research query to search medical literature
              </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                💡 Quick Tips
              </h4>
              <ul style={{ marginLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '6px' }}>Make sure the MCP servers are running locally</li>
                <li style={{ marginBottom: '6px' }}>Node.js server searches PubMed and arXiv</li>
                <li style={{ marginBottom: '6px' }}>Python server queries ScienceDirect and Google Scholar</li>
                <li>Go server accesses CrossRef and OpenAlex</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
