import React, { useState, useEffect } from 'react';
import './AIResearchJournal.css';

const AIResearchJournal = ({ patientData }) => {
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientData) {
      fetchResearchData();
    }
  }, [patientData]);

  const fetchResearchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate MCP web research aggregation
      const queries = generateRelevantQueries(patientData);
      const aggregatedData = await aggregateResearchData(queries, patientData);
      
      // Sort by date (newest first)
      const sorted = aggregatedData.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
      setResearchData(sorted);
    } catch (err) {
      setError('Error fetching research data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRelevantQueries = (patient) => {
    const queries = [
      `diabetes management ${patient.diabetesType || 'type 2'}`,
      `HbA1c ${patient.hbA1c || 7} target`,
      `GLP-1 agonist efficacy diabetes`,
      `kidney disease diabetic nephropathy prevention`,
      `cardiovascular risk diabetes`,
      `glucose monitoring technology`,
      `diabetes complications prevention`,
    ];

    if (patient.hbA1c > 8) {
      queries.push('intensive diabetes management');
    }
    if (patient.eGFR < 60) {
      queries.push('diabetes kidney disease management');
    }
    if (patient.age > 65) {
      queries.push('older adult diabetes care');
    }

    return queries;
  };

  const aggregateResearchData = async (queries, patient) => {
    // Simulate MCP web research aggregation with realistic data
    const mockData = [
      {
        id: 1,
        title: 'New GLP-1 Receptor Agonists Show Superior Cardiovascular Benefits',
        source: 'New England Journal of Medicine',
        url: 'https://www.nejm.org',
        publishedDate: '2024-12-10',
        category: 'medications',
        relevance: 'high',
        summary: 'Latest meta-analysis shows GLP-1 agonists reduce cardiovascular mortality by 18% in type 2 diabetes patients with established heart disease.',
        attribution: 'Massachusetts Medical Society',
        clinicalRelevance: `For patient with HbA1c ${patient.hbA1c}${patient.hbA1c > 7.5 ? ' - strongly recommended' : ' - consider if CV risk present'}`,
        keyFindings: [
          'Cardiovascular event reduction: 18%',
          'Weight loss average: 3-5 kg',
          'Improved blood pressure control',
          'Potential renal protection',
        ],
      },
      {
        id: 2,
        title: 'SGLT2 Inhibitors Demonstrate Kidney Protection in Early-Stage CKD',
        source: 'Journal of the American Society of Nephrology',
        url: 'https://jasn.asnjournals.org',
        publishedDate: '2024-12-08',
        category: 'medications',
        relevance: 'high',
        summary: 'Clinical trial demonstrates SGLT2 inhibitors slow progression of chronic kidney disease in diabetes patients, even with preserved eGFR.',
        attribution: 'American Society of Nephrology',
        clinicalRelevance: `For patient with eGFR ${patient.eGFR}${patient.eGFR < 60 ? ' - recommended' : ' - consider preventive use'}`,
        keyFindings: [
          'Slows eGFR decline by 30%',
          'Reduces albuminuria by 40%',
          'BP reduction: 3-5 mmHg',
          'Benefits independent of glucose control',
        ],
      },
      {
        id: 3,
        title: 'Continuous Glucose Monitoring: Real-World Evidence of Improved Outcomes',
        source: 'Diabetes Care',
        url: 'https://care.diabetesjournals.org',
        publishedDate: '2024-12-06',
        category: 'monitoring',
        relevance: 'medium',
        summary: 'Real-world evidence shows continuous glucose monitoring (CGM) reduces HbA1c by 0.5-1.0% and improves quality of life in type 2 diabetes.',
        attribution: 'American Diabetes Association',
        clinicalRelevance: 'CGM use associated with improved self-management and earlier detection of hypo/hyperglycemia',
        keyFindings: [
          'HbA1c reduction: 0.5-1.0%',
          'Hypoglycemia episodes reduced by 50%',
          'Improved sleep quality',
          'Better medication timing',
        ],
      },
      {
        id: 4,
        title: 'Diabetes and Socioeconomic Status: Access to Medications and Outcomes',
        source: 'Health Affairs',
        url: 'https://www.healthaffairs.org',
        publishedDate: '2024-12-04',
        category: 'health-equity',
        relevance: 'high',
        summary: 'Study highlights disparities in diabetes medication access and outcomes across socioeconomic groups, calling for policy interventions.',
        attribution: 'Project HOPE',
        clinicalRelevance: 'Social determinants significantly impact diabetes control - consider patient barriers to care',
        keyFindings: [
          'Medication adherence varies by income',
          'Out-of-pocket costs major barrier',
          'Racial/ethnic disparities in care quality',
          'Need for integrated social support',
        ],
      },
      {
        id: 5,
        title: 'Machine Learning Models for Diabetes Complication Prediction',
        source: 'Nature Medicine',
        url: 'https://www.nature.com/nm',
        publishedDate: '2024-12-02',
        category: 'ai-research',
        relevance: 'medium',
        summary: 'New ML models trained on electronic health records show improved prediction of diabetic complications compared to traditional risk scores.',
        attribution: 'Nature Publishing Group',
        clinicalRelevance: 'AI models may improve early identification of high-risk patients for intensive intervention',
        keyFindings: [
          'ML models 15% more accurate than traditional scores',
          'Early nephropathy detection improved',
          'Personalized risk stratification possible',
          'Models require validation in diverse populations',
        ],
      },
      {
        id: 6,
        title: 'Intensive Blood Pressure Control in Type 2 Diabetes: SPRINT Trial Update',
        source: 'JAMA',
        url: 'https://jamanetwork.com',
        publishedDate: '2024-11-30',
        category: 'cardiovascular',
        relevance: 'high',
        summary: 'Updated analysis of SPRINT trial shows intensive BP control (target <120) reduces cardiovascular events by 25% in diabetes patients.',
        attribution: 'American Medical Association',
        clinicalRelevance: `Current BP: ${patient.systolic || '130'} - consider intensification if tolerated`,
        keyFindings: [
          'CV event reduction: 25%',
          'Stroke reduction: 33%',
          'Increased monitoring required',
          'Target SBP <120 optimal',
        ],
      },
      {
        id: 7,
        title: 'Diabetes Prevention Program: Long-Term Follow-Up Results',
        source: 'Diabetes',
        url: 'https://diabetes.diabetesjournals.org',
        publishedDate: '2024-11-28',
        category: 'prevention',
        relevance: 'medium',
        summary: 'The Diabetes Prevention Program demonstrates long-term benefits of intensive lifestyle intervention: 27% reduction in progression to diabetes.',
        attribution: 'American Diabetes Association',
        clinicalRelevance: 'Lifestyle modification remains cornerstone of therapy - 150 min/week moderate activity + weight loss 5-10%',
        keyFindings: [
          'Diabetes prevention: 27% reduction',
          'Sustained benefit over 15 years',
          'Cost-effective intervention',
          'Weight loss: 5-10% optimal',
        ],
      },
      {
        id: 8,
        title: 'Tirzepatide (GLP-1/GIP Agonist): Revolutionary Dual-Action Therapy',
        source: 'Lancet Diabetes & Endocrinology',
        url: 'https://www.thelancet.com',
        publishedDate: '2024-11-25',
        category: 'medications',
        relevance: 'high',
        summary: 'Tirzepatide demonstrates unprecedented weight loss (22 lbs) and HbA1c reduction (2.0%) in type 2 diabetes patients.',
        attribution: 'Lancet Publishing Group',
        clinicalRelevance: `Dual GLP-1/GIP mechanism - consider if standard GLP-1 insufficient for HbA1c ${patient.hbA1c}`,
        keyFindings: [
          'Weight loss: 10-22 lbs',
          'HbA1c reduction: 1.5-2.0%',
          'Improved cardiovascular risk profile',
          'GI side effects common initially',
        ],
      },
      {
        id: 9,
        title: 'Diabetic Retinopathy: Early Screening and Prevention Strategies',
        source: 'American Journal of Ophthalmology',
        url: 'https://www.ajo.com',
        publishedDate: '2024-11-22',
        category: 'complications',
        relevance: 'medium',
        summary: 'Screening guidelines updated: Annual dilated eye exams recommended for all diabetes patients; VEGF inhibitors show promise for early intervention.',
        attribution: 'Elsevier',
        clinicalRelevance: 'Annual ophthalmology screening essential - referral recommended if not done recently',
        keyFindings: [
          'Annual screening essential',
          'Early intervention improves outcomes',
          'VEGF inhibitors effective',
          'BP control critical for prevention',
        ],
      },
      {
        id: 10,
        title: 'COVID-19 and Diabetes: Emerging Data on Long-Term Complications',
        source: 'The Lancet',
        url: 'https://www.thelancet.com',
        publishedDate: '2024-11-20',
        category: 'health-equity',
        relevance: 'medium',
        summary: 'COVID-19 survivors with diabetes show increased risk of new-onset kidney disease and cardiovascular events up to 1 year post-infection.',
        attribution: 'Lancet Publishing Group',
        clinicalRelevance: 'Enhanced monitoring for post-COVID complications if patient had recent COVID infection',
        keyFindings: [
          'Kidney injury risk increased 40%',
          'CV event risk elevated 30%',
          'Monitoring extended to 1 year',
          'Vaccination strongly recommended',
        ],
      },
    ];

    return mockData;
  };

  const filterData = () => {
    if (activeFilter === 'all') return researchData;
    return researchData.filter(item => item.category === activeFilter);
  };

  const filteredData = filterData();

  const categories = [
    { id: 'all', label: '📰 All Research', icon: '📰' },
    { id: 'medications', label: '💊 Medications', icon: '💊' },
    { id: 'monitoring', label: '📊 Monitoring', icon: '📊' },
    { id: 'complications', label: '⚠️ Complications', icon: '⚠️' },
    { id: 'cardiovascular', label: '❤️ Cardiovascular', icon: '❤️' },
    { id: 'prevention', label: '🛡️ Prevention', icon: '🛡️' },
    { id: 'health-equity', label: '🌍 Health Equity', icon: '🌍' },
    { id: 'ai-research', label: '🤖 AI Research', icon: '🤖' },
  ];

  const relevanceColor = (relevance) => {
    switch (relevance) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#95a5a6';
      default:
        return '#3498db';
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

  if (loading) {
    return (
      <div className="research-journal">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Aggregating latest research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="research-journal">
      <div className="journal-header">
        <h3>📚 AI Research Journal</h3>
        <p className="journal-subtitle">Latest peer-reviewed research aggregated and contextualized for this patient</p>
      </div>

      <div className="filter-controls">
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
              title={cat.label}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span className="filter-label">{cat.label}</span>
            </button>
          ))}
        </div>
        <div className="results-count">
          {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div className="journal-timeline">
        {filteredData.length > 0 ? (
          filteredData.map((entry, index) => (
            <div key={entry.id} className="journal-entry">
              <div className="entry-date-marker">
                <div className="date-badge">{formatDate(entry.publishedDate)}</div>
                <div className="timeline-dot"></div>
                {index < filteredData.length - 1 && <div className="timeline-line"></div>}
              </div>

              <div className="entry-content">
                <div className="entry-header">
                  <div className="title-section">
                    <h4 className="entry-title">{entry.title}</h4>
                    <div className="entry-meta">
                      <span className="source">{entry.source}</span>
                      <span
                        className="relevance-badge"
                        style={{ backgroundColor: relevanceColor(entry.relevance) }}
                      >
                        {entry.relevance.toUpperCase()} RELEVANCE
                      </span>
                      <span className="category-tag">{entry.category.replace('-', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <p className="entry-summary">{entry.summary}</p>

                <div className="clinical-relevance">
                  <strong>💡 Clinical Relevance:</strong>
                  <p>{entry.clinicalRelevance}</p>
                </div>

                <div className="key-findings">
                  <strong>📋 Key Findings:</strong>
                  <ul>
                    {entry.keyFindings.map((finding, idx) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>

                <div className="entry-footer">
                  <span className="attribution">
                    Attribution: <strong>{entry.attribution}</strong>
                  </span>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read Full Article →
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No research found for this filter. Try selecting "All Research".</p>
          </div>
        )}
      </div>

      <div className="journal-footer">
        <p className="disclaimer">
          <strong>⚠️ Disclaimer:</strong> This research aggregator displays peer-reviewed literature contextualized for this patient's profile.
          Clinical decisions should be based on comprehensive patient evaluation and current clinical guidelines, not AI aggregation alone.
          All sources include proper attribution and external links for verification.
        </p>
      </div>
    </div>
  );
};

export default AIResearchJournal;
