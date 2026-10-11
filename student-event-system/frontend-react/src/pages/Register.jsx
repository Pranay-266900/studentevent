import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, 'STUDENT');
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            {/* Top Switcher Banner */}
            <div className="alert alert-success border-0 shadow-sm d-flex justify-content-between align-items-center py-2 px-3 mb-4 rounded-3">
              <span className="small">
                <i className="bi bi-calendar-check-fill me-2 text-success"></i>
                Are you an Event Organizer, Faculty, or Club Lead?
              </span>
              <Link to="/register-organizer" className="btn btn-sm btn-outline-success fw-semibold text-nowrap ms-2">
                <i className="bi bi-plus-circle me-1"></i> Organizer Sign Up
              </Link>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-2">
                    <i className="bi bi-mortarboard-fill fs-2"></i>
                  </div>
                  <h3 className="fw-bold">Student Registration</h3>
                  <p className="text-muted small">
                    Create your student account to discover campus activities, book seats, and get digital event passes
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Student Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Alex Rivera / Emily Watson"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Student Campus Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. student.name@student.college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <small className="text-muted">Use your college-issued student email</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Designated Role</label>
                    <div className="p-2 border rounded bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary fs-6"><i className="bi bi-mortarboard me-1"></i>STUDENT</span>
                        <span className="small text-muted">Event Participant & Seat Registrant</span>
                      </div>
                      <small className="text-primary fw-semibold">Auto-assigned</small>
                    </div>
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Confirm Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registering Student Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Register as Student
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-1">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-semibold text-primary">
                      Sign in here
                    </Link>
                  </p>
                  <p className="text-muted small mb-0">
                    Want to host events instead?{' '}
                    <Link to="/register-organizer" className="fw-semibold text-success">
                      Organizer & Faculty Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
