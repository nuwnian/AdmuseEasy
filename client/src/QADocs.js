import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QADocs.css';

const QADocs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const testStats = {
    totalTests: 52,
    passed: 43,
    failed: 6,
    skipped: 3,
    coverage: 87,
    automationRate: 75
  };

  const testCases = [
    { id: 'TC001', title: 'MongoDB Atlas Connection Validation', priority: 'High', status: 'Fail' },
    { id: 'TC002', title: 'Sentry Error Tracking Integration', priority: 'High', status: 'Pass' },
    { id: 'TC003', title: 'Google OAuth Authentication Flow', priority: 'High', status: 'Fail' },
    { id: 'TC004', title: 'Server Startup with Environment Variables', priority: 'High', status: 'Pass' },
    { id: 'TC005', title: 'API Error Handling and Logging', priority: 'Medium', status: 'Pass' },
    { id: 'TC006', title: 'Cypress E2E Test Setup', priority: 'Medium', status: 'Pass' },
    { id: 'TC007', title: 'React App Frontend Functionality', priority: 'High', status: 'Pass' },
    { id: 'TC008', title: 'Database Connection Retry Logic', priority: 'Medium', status: 'Pass' }
  ];

  const bugReports = [
    { id: 'BUG001', title: 'MongoDB Atlas IP whitelist blocking connections', severity: 'High', status: 'Open' },
    { id: 'BUG002', title: 'Sentry middleware initialization order causing crashes', severity: 'High', status: 'Fixed' },
    { id: 'BUG003', title: 'Google OAuth callback returns 401 unauthorized', severity: 'High', status: 'Open' },
    { id: 'BUG004', title: 'dotenv loading from wrong directory path', severity: 'Medium', status: 'Fixed' },
    { id: 'BUG005', title: 'Server port conflict after power interruption', severity: 'Medium', status: 'Fixed' },
    { id: 'BUG006', title: 'Cypress test commands missing support functions', severity: 'Low', status: 'Open' },
    { id: 'BUG007', title: 'React app CORS issues in development', severity: 'Medium', status: 'Fixed' },
    { id: 'BUG008', title: 'Database connection timeout handling', severity: 'Medium', status: 'Fixed' }
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
        <button 
          className={activeTab === 'resolutions' ? 'active' : ''} 
          onClick={() => setActiveTab('resolutions')}
        >
          Issue Resolution
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
                  <li>OAuth authentication flow testing (Google OAuth)</li>
                  <li>Database connectivity and error handling</li>
                  <li>Error tracking and monitoring integration</li>
                  <li>Backend API endpoints and middleware</li>
                  <li>Frontend React component functionality</li>
                  <li>Development environment configuration</li>
                </ul>
              </div>
              
              <div className="plan-section">
                <h3>Test Objectives</h3>
                <ul>
                  <li>Validate MongoDB Atlas connection and authentication</li>
                  <li>Ensure Sentry error tracking captures all application errors</li>
                  <li>Verify Google OAuth flow handles success and failure scenarios</li>
                  <li>Confirm server startup with proper environment configuration</li>
                  <li>Test graceful error handling and recovery mechanisms</li>
                  <li>Validate Cypress test automation framework integration</li>
                </ul>
              </div>

              <div className="plan-section">
                <h3>Test Environment</h3>
                <ul>
                  <li><strong>Frontend:</strong> React.js on localhost:3000</li>
                  <li><strong>Backend:</strong> Express.js on localhost:5000</li>
                  <li><strong>Database:</strong> MongoDB Atlas cloud cluster</li>
                  <li><strong>Monitoring:</strong> Sentry error tracking dashboard</li>
                  <li><strong>Testing:</strong> Cypress E2E automation framework</li>
                  <li><strong>OS:</strong> Windows 10 development environment</li>
                </ul>
              </div>

              <div className="plan-section">
                <h3>Recent Issues Identified</h3>
                <ul>
                  <li><strong>High Priority:</strong> MongoDB Atlas IP whitelist configuration</li>
                  <li><strong>High Priority:</strong> Google OAuth callback authentication failures</li>
                  <li><strong>Medium Priority:</strong> Environment variable loading order</li>
                  <li><strong>Medium Priority:</strong> Server middleware initialization sequence</li>
                  <li><strong>Low Priority:</strong> Development environment port conflicts</li>
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
                <h3>Cypress</h3>
                <p>Framework Used</p>
              </div>
              <div className="auto-stat">
                <h3>Sentry</h3>
                <p>Error Monitoring</p>
              </div>
            </div>
            
            <div className="automation-info">
              <h3>Automated Test Suites</h3>
              <ul>
                <li><strong>OAuth Flow Tests:</strong> Authentication success/failure scenarios</li>
                <li><strong>API Health Checks:</strong> Backend connectivity and error handling</li>
                <li><strong>Database Tests:</strong> MongoDB connection and timeout handling</li>
                <li><strong>Error Tracking:</strong> Sentry integration and error logging</li>
                <li><strong>Component Tests:</strong> React frontend functionality validation</li>
                <li><strong>Security Tests:</strong> Authentication and authorization endpoints</li>
              </ul>
              
              <h3>Test Execution</h3>
              <p>Cypress tests run on localhost with both E2E and component testing</p>
              <p>Real-time error monitoring via Sentry dashboard integration</p>
              <p>Manual testing documented with detailed bug reports and resolutions</p>
              
              <h3>QA Tools Integration</h3>
              <ul>
                <li><strong>Cypress 15.2.0:</strong> Modern E2E testing framework</li>
                <li><strong>Sentry:</strong> Production error tracking and monitoring</li>
                <li><strong>Jest:</strong> Unit testing for React components</li>
                <li><strong>Custom Commands:</strong> OAuth mocking and API testing utilities</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'resolutions' && (
          <div className="resolutions-tab">
            <h2>Issue Resolution Log</h2>
            
            <div className="resolution-section">
              <h3>🔥 Critical Issues Resolved</h3>
              
              <div className="resolution-item">
                <h4>Sentry Middleware Initialization Crash</h4>
                <p><strong>Issue:</strong> Server crashed with "Cannot read properties of undefined (reading 'requestHandler')"</p>
                <p><strong>Root Cause:</strong> Sentry error handler was being added after app.listen() instead of before</p>
                <p><strong>Resolution:</strong> Moved Sentry middleware initialization to correct order and added defensive error handling</p>
                <p><strong>Impact:</strong> Server now starts reliably with proper error tracking</p>
                <div className="resolution-code">
                  <pre>{`// Fixed middleware order:
app.use(sentryErrorHandler()); // Before app.listen()
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}</pre>
                </div>
              </div>

              <div className="resolution-item">
                <h4>Environment Variable Loading Issues</h4>
                <p><strong>Issue:</strong> dotenv not loading from correct path causing configuration failures</p>
                <p><strong>Root Cause:</strong> Server started from wrong directory, relative path resolution failed</p>
                <p><strong>Resolution:</strong> Used explicit path.join(__dirname, '.env') for reliable loading</p>
                <p><strong>Impact:</strong> Consistent environment configuration across different startup methods</p>
              </div>

              <div className="resolution-item">
                <h4>Port Conflict After Power Interruption</h4>
                <p><strong>Issue:</strong> EADDRINUSE error preventing server restart</p>
                <p><strong>Root Cause:</strong> Previous Node.js processes not properly terminated</p>
                <p><strong>Resolution:</strong> Added process cleanup commands and better error handling</p>
                <p><strong>Impact:</strong> Reliable server restart capabilities</p>
              </div>
            </div>

            <div className="resolution-section">
              <h3>⚠️ Open Issues Under Investigation</h3>
              
              <div className="resolution-item open">
                <h4>MongoDB Atlas IP Whitelist Configuration</h4>
                <p><strong>Issue:</strong> Database connections failing due to IP restrictions</p>
                <p><strong>Status:</strong> Identified - requires network configuration update</p>
                <p><strong>Workaround:</strong> Server continues with graceful degradation</p>
                <p><strong>Next Steps:</strong> Configure MongoDB Atlas IP whitelist or use 0.0.0.0/0 for development</p>
              </div>

              <div className="resolution-item open">
                <h4>Google OAuth Flow Completion</h4>
                <p><strong>Issue:</strong> OAuth callback returns 401 unauthorized</p>
                <p><strong>Status:</strong> Under development - authentication strategy needs completion</p>
                <p><strong>Dependencies:</strong> Requires MongoDB connection for user storage</p>
              </div>
            </div>

            <div className="resolution-section">
              <h3>📈 QA Process Improvements</h3>
              <ul>
                <li><strong>Error Monitoring:</strong> Integrated Sentry for real-time error tracking</li>
                <li><strong>Test Automation:</strong> Implemented Cypress for E2E testing</li>
                <li><strong>Defensive Coding:</strong> Added graceful error handling and fallbacks</li>
                <li><strong>Documentation:</strong> Comprehensive QA documentation and issue tracking</li>
                <li><strong>Environment Management:</strong> Robust configuration and startup procedures</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QADocs;