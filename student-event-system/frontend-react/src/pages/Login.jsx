import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, remember);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (user.role === 'ORGANIZER') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-2">
                    <i className="bi bi-mortarboard-fill fs-2"></i>
                  </div>
                  <h3 className="fw-bold">Sign In</h3>
                  <p className="text-muted small">Access your CampusEventHub account</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label small fw-semibold mb-0">Password</label>
                    </div>
                    <div className="input-group mt-1">
                      <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="rememberMe">
                      Keep me logged in
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                {/* Demo Accounts Quick-Fill Section */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted fw-bold text-uppercase">Demo Accounts</small>
                    <small className="text-muted">Click to auto-fill</small>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger text-start d-flex justify-content-between align-items-center py-2"
                      onClick={() => handleDemoFill('admin@college.edu', 'Admin@123')}
                    >
                      <div>
                        <strong className="d-block small"><i className="bi bi-shield-lock-fill text-danger me-1"></i> Administrator</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>admin@college.edu &bull; Admin@123</span>
                      </div>
                      <span className="badge bg-danger">ADMIN</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center py-2"
                      onClick={() => handleDemoFill('sarah.jenkins@college.edu', 'Password@123')}
                    >
                      <div>
                        <strong className="d-block small"><i className="bi bi-calendar-check-fill text-success me-1"></i> Organizer (Dr. Sarah)</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>sarah.jenkins@college.edu &bull; Password@123</span>
                      </div>
                      <span className="badge bg-success">ORGANIZER</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center py-2"
                      onClick={() => handleDemoFill('alex.rivera@student.college.edu', 'Password@123')}
                    >
                      <div>
                        <strong className="d-block small"><i className="bi bi-mortarboard-fill text-primary me-1"></i> Student (Alex Rivera)</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>alex.rivera@student.college.edu &bull; Password@123</span>
                      </div>
                      <span className="badge bg-primary">STUDENT</span>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted small mb-2">
                    Don't have an account? Sign up below:
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/register" className="fw-semibold text-primary small">
                      <i className="bi bi-mortarboard me-1"></i> Student Sign Up
                    </Link>
                    <span className="text-muted small">&bull;</span>
                    <Link to="/register-organizer" className="fw-semibold text-success small">
                      <i className="bi bi-calendar-check me-1"></i> Organizer Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
