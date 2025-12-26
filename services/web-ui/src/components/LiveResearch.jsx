import React, { useState, useEffect } from 'react';
import './LiveResearch.css';

const LiveResearch = ({ patientData }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('aggregate');
  const [customQuery, setCustomQuery] = useState('');
  const [searchInProgress, setSearchInProgress] = useState(false);

  const sources = [
    { id: 'aggregate', label: '🔀 All Sources', endpoint: '/api/research/aggregate' },
    { id: 'pubmed', label: '📚 PubMed', endpoint: '/api/research/pubmed' },
    { id: 'arxiv', label: '🤖 arXiv', endpoint: '/api/research/arxiv' },
    { id: 'ada', label: '📋 ADA', endpoint: '/api/research/ada' }
  ];

  // Fetch research data based on active source
  const fetchResearchData = async (source = activeTab) => {
    setLoading(true);
    setError(null);
    setSearchInProgress(true);

    try {
      const sourceConfig = sources.find(s => s.id === source);
      
      // Build query parameters from patient data
      const params = new URLSearchParams();
      
      if (source === 'aggregate' || source === 'pubmed') {
        const query = customQuery || `${patientData?.diabetesType || 'type 2'} diabetes management`;
        params.append('topic', query);
        params.append('diabetesType', patientData?.diabetesType || 'type 2');
        params.append('hbA1c', patientData?.hbA1c || 7);
        params.append('age', patientData?.age || 50);
      } else if (source === 'arxiv') {
        const query = customQuery || 'diabetes machine learning prediction';
        params.append('query', query);
        params.append('limit', 10);
      } else if (source === 'ada') {
        const condition = patientData?.conditions?.[0] || 'general';
        params.append('condition', condition);
        params.append('hbA1c', patientData?.hbA1c || 7);
        params.append('age', patientData?.age || 50);
      }

      const url = `${sourceConfig.endpoint}?${params.toString()}`;
      console.log(`[LiveResearch] Fetching from ${url}`);

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const articleList = data.articles || [];
        setArticles(articleList);
        
        // Show note if using fallback data
        if (data.note) {
          console.log(`[LiveResearch] Note: ${data.note}`);
          setError(null); // Don't show error if we have fallback data
        }
        
        console.log(`[LiveResearch] Received ${articleList.length} articles from ${source}`);
      } else {
        setError(data.error || 'Failed to fetch research data');
        setArticles([]);
      }
    } catch (err) {
      console.error('[LiveResearch] Error fetching data:', err);
      
      // Check if it's a JSON parse error (API returned HTML instead of JSON)
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        setError('API returned invalid data (likely HTML error page). Trying fallback data...');
        // Try again in 2 seconds
        setTimeout(() => fetchResearchData(activeTab), 2000);
      } else {
        setError(`Error: ${err.message}`);
      }
      setArticles([]);
    } finally {
      setLoading(false);
      setSearchInProgress(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (patientData) {
      fetchResearchData('aggregate');
    }
  }, [patientData?.id]); // Re-fetch when patient changes

  const handleSourceChange = (sourceId) => {
    setActiveTab(sourceId);
    setArticles([]);
    setCustomQuery('');
    // Fetch new source
    setTimeout(() => fetchResearchData(sourceId), 100);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (customQuery.trim()) {
      fetchResearchData(activeTab);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  return (
    <div className="live-research">
      <div className="live-header">
        <h3>🔴 Live Research Feed</h3>
        <p className="live-subtitle">Real-time articles from PubMed, arXiv, and ADA Guidelines</p>
      </div>

      {/* Source Tabs */}
      <div className="source-tabs">
        {sources.map(source => (
          <button
            key={source.id}
            className={`source-btn ${activeTab === source.id ? 'active' : ''}`}
            onClick={() => handleSourceChange(source.id)}
            disabled={searchInProgress}
          >
            {source.label}
          </button>
        ))}
      </div>

      {/* Custom Search */}
      <form className="search-form" onSubmit={handleCustomSearch}>
        <input
          type="text"
          placeholder={`Search ${sources.find(s => s.id === activeTab)?.label}...`}
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          disabled={searchInProgress}
        />
        <button type="submit" disabled={!customQuery.trim() || searchInProgress}>
          {searchInProgress ? '🔄 Searching...' : '🔍 Search'}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching live research from {sources.find(s => s.id === activeTab)?.label}...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && articles.length === 0 && (
        <div className="error-banner">
          <strong>⚠️ Connection Issue:</strong> {error}
          <p className="error-hint">
            {activeTab === 'pubmed' && 'PubMed API may be temporarily unavailable. Try another source or refresh.'}
            {activeTab === 'arxiv' && 'arXiv API temporarily unavailable. Try querying PubMed or ADA instead.'}
            {activeTab === 'ada' && 'ADA data may not be available right now. Try PubMed or arXiv.'}
          </p>
        </div>
      )}

      {/* Fallback Data Notification */}
      {!loading && articles.length > 0 && error && (
        <div className="info-banner">
          <strong>ℹ️ Using Cached Data:</strong> {error}. Showing recent results from cache.
        </div>
      )}

      {/* Articles Grid */}
      {!loading && articles.length > 0 && (
        <div className="articles-grid">
          {articles.map((article, idx) => (
            <article key={article.id || idx} className="article-card">
              <div className="article-header">
                <h4 className="article-title">{article.title}</h4>
                <div className="article-meta">
                  <span className="source-badge">{article.source}</span>
                  {article.relevance && (
                    <span className={`relevance-badge relevance-${article.relevance}`}>
                      {article.relevance.toUpperCase()}
                    </span>
                  )}
                  {article.publishedDate && (
                    <span className="date">{formatDate(article.publishedDate)}</span>
                  )}
                </div>
              </div>

              {article.summary && (
                <p className="article-summary">{article.summary.substring(0, 200)}...</p>
              )}

              {article.keyFindings && Array.isArray(article.keyFindings) && (
                <div className="key-findings">
                  <strong>Key Points:</strong>
                  <ul>
                    {article.keyFindings.slice(0, 3).map((finding, i) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="article-footer">
                {article.attribution && (
                  <span className="attribution">
                    {article.attribution}
                  </span>
                )}
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-link">
                    Read More →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && !error && (
        <div className="empty-state">
          <p>No articles found. Try searching with different keywords or select another source.</p>
        </div>
      )}

      {/* Info Box */}
      <div className="info-box">
        <strong>ℹ️ About Live Research:</strong>
        <p>
          This tab connects to real scientific databases (PubMed, arXiv, ADA) through the WebScraperMCPServer.
          Results are contextualized to this patient's clinical profile (age, HbA1c, diabetes type).
          Articles are fetched in real-time and include proper attribution and external links.
        </p>
      </div>
    </div>
  );
};

export default LiveResearch;
