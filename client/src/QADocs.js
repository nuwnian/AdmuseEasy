import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QADocs.css';

const QADocs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const testStats = {
    totalTests: 47,
    passed: 40,
    failed: 3,
    skipped: 3,
    coverage: 85,
    automationRate: 70
  };

  const testCases = [
    { id: 'TC001', title: 'Product Name Input Validation', priority: 'High', status: 'Pass' },
    { id: 'TC002', title: 'Mascot Selection Functionality', priority: 'High', status: 'Pass' },
    { id: 'TC003', title: 'Ad Generation with Empty Fields', priority: 'Medium', status: 'Fail' },
    { id: 'TC004', title: 'API Response Validation', priority: 'High', status: 'Pass' },
    { id: 'TC005', title: 'Cross-browser Compatibility', priority: 'Medium', status: 'Pass' }
  ];

  const bugReports = [
    { id: 'BUG001', title: 'Generate button not disabled on empty form', severity: 'Medium', status: 'Open' },
    { id: 'BUG002', title: 'API timeout not handled gracefully', severity: 'High', status: 'Fixed' },
    { id: 'BUG003', title: 'Mobile layout breaks on small screens', severity: 'Low', status: 'Open' },
    { id: 'BUG004', title: 'Frontend API calls fail with relative URLs in development', severity: 'High', status: 'Fixed' },
    { id: 'BUG005', title: 'Gemini AI returns malformed JSON occasionally', severity: 'Medium', status: 'Open' }
  ];

  return (
    <div className="qa-docs">
      <nav className="qa-breadcrumb">
        <Link to="/" className="home-link">← Back to AdmuseEasy</Link>
      </nav>
      
      <header className="qa-header">
        <h1>🧪 QA Documentation</h1>
        <p>Comprehensive testing documentation for AdmuseEasy</p>
      </header>

      <nav className="qa-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'testcases' ? 'active' : ''} 
          onClick={() => setActiveTab('testcases')}
        >
          Test Cases
        </button>
        <button 
          className={activeTab === 'bugs' ? 'active' : ''} 
          onClick={() => setActiveTab('bugs')}
        >
          Bug Reports
        </button>
        <button 
          className={activeTab === 'automation' ? 'active' : ''} 
          onClick={() => setActiveTab('automation')}
        >
          Automation
        </button>
      </nav>

      <div className="qa-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{testStats.totalTests}</h3>
                <p>Total Test Cases</p>
              </div>
              <div className="stat-card">
                <h3>{testStats.passed}</h3>
                <p>Passed</p>
              </div>
              <div className="stat-card">
                <h3>{testStats.failed}</h3>
                <p>Failed</p>
              </div>
              <div className="stat-card">
                <h3>{testStats.coverage}%</h3>
                <p>Test Coverage</p>
              </div>
            </div>

            <div className="test-plan">
              <h2>Test Plan Overview</h2>
              <div className="plan-section">
                <h3>Scope</h3>
                <ul>
                  <li>Functional testing of ad generation workflow</li>
                  <li>UI/UX validation across devices</li>
                  <li>API endpoint testing</li>
                  <li>Cross-browser compatibility</li>
                </ul>
              </div>
              
              <div className="plan-section">
                <h3>Test Objectives</h3>
                <ul>
                  <li>Validate core ad generation functionality</li>
                  <li>Ensure mascot selection affects output correctly</li>
                  <li>Verify error handling and edge cases</li>
                  <li>Confirm responsive design works properly</li>
                </ul>
              </div>

              <div className="plan-section">
                <h3>Test Environment</h3>
                <ul>
                  <li><strong>Browsers:</strong> Chrome, Firefox, Safari, Edge</li>
                  <li><strong>Devices:</strong> Desktop, Tablet, Mobile</li>
                  <li><strong>OS:</strong> Windows, macOS, iOS, Android</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testcases' && (
          <div className="testcases-tab">
            <h2>Test Cases Library</h2>
            <div className="test-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Test Case</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.map(test => (
                    <tr key={test.id}>
                      <td>{test.id}</td>
                      <td>{test.title}</td>
                      <td><span className={`priority ${test.priority.toLowerCase()}`}>{test.priority}</span></td>
                      <td><span className={`status ${test.status.toLowerCase()}`}>{test.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className="bugs-tab">
            <h2>Bug Reports</h2>
            <div className="bug-table">
              <table>
                <thead>
                  <tr>
                    <th>Bug ID</th>
                    <th>Description</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bugReports.map(bug => (
                    <tr key={bug.id}>
                      <td>{bug.id}</td>
                      <td>{bug.title}</td>
                      <td><span className={`severity ${bug.severity.toLowerCase()}`}>{bug.severity}</span></td>
                      <td><span className={`bug-status ${bug.status.toLowerCase()}`}>{bug.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="automation-tab">
            <h2>Test Automation</h2>
            <div className="automation-stats">
              <div className="auto-stat">
                <h3>{testStats.automationRate}%</h3>
                <p>Automation Coverage</p>
              </div>
              <div className="auto-stat">
                <h3>Selenium</h3>
                <p>Framework Used</p>
              </div>
            </div>
            
            <div className="automation-info">
              <h3>Automated Test Suites</h3>
              <ul>
                <li><strong>Functional Tests:</strong> Form validation, ad generation workflow</li>
                <li><strong>UI Tests:</strong> Element visibility, responsive design</li>
                <li><strong>API Tests:</strong> Endpoint validation, error handling</li>
                <li><strong>Cross-browser Tests:</strong> Chrome, Firefox, Safari compatibility</li>
              </ul>
              
              <h3>Test Execution</h3>
              <p>Tests run automatically on every commit via GitHub Actions</p>
              <p>Daily regression test suite execution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QADocs;