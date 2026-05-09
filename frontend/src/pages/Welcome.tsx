import { type JSX } from 'react';
import { Link } from 'react-router-dom';

const Welcome = (): JSX.Element => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Task Manager</h1>
        <p>
          Organize your life with our beautiful and intuitive task management application. 
          Create, manage, and track your tasks with ease. Stay productive and never miss a deadline again.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">
            Get Started
          </Link>
          <Link to="/login" className="cta-button secondary">
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="welcome-visual">
        <div className="feature-showcase">
          <div className="showcase-item">
            <div className="showcase-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track your productivity with detailed insights</p>
          </div>
          <div className="showcase-item">
            <div className="showcase-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Built for speed and efficiency</p>
          </div>
          <div className="showcase-item">
            <div className="showcase-icon">🎯</div>
            <h3>Goal Oriented</h3>
            <p>Stay focused on what matters most</p>
          </div>
        </div>
      </div>

      <div className="welcome-features">
        <div className="feature-card">
          <span className="feature-icon">📝</span>
          <div>
            <h4>Easy Task Creation</h4>
            <p>Create tasks quickly with titles and descriptions</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✅</span>
          <div>
            <h4>Track Progress</h4>
            <p>Mark tasks as complete and track your productivity</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <div>
            <h4>Secure & Private</h4>
            <p>Your tasks are private and securely stored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;