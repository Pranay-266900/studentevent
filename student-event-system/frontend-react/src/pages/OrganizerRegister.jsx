import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const OrganizerRegister = () => {
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
      await register(fullName, email, password, 'ORGANIZER');
      navigate('/organizer-dashboard');
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
            <div className="alert alert-info border-0 shadow-sm d-flex justify-content-between align-items-center py-2 px-3 mb-4 rounded-3">
              <span className="small">
                <i className="bi bi-info-circle-fill me-2"></i>
                Are you a student looking to register and participate in events?
              </span>
              <Link to="/register" className="btn btn-sm btn-outline-primary fw-semibold text-nowrap ms-2">
                <i className="bi bi-mortarboard me-1"></i> Student Sign Up
              </Link>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2">
                    <i className="bi bi-calendar-check-fill fs-2"></i>
                  </div>
                  <h3 className="fw-bold">Organizer & Faculty Registration</h3>
                  <p className="text-muted small">
                    Create your organizer account to host events, control capacity, and record participant attendance
                  </p>
                </div>

                {/* Organizer Privileges Highlight */}
                <div className="row g-2 mb-4">
                  <div className="col-sm-4">
                    <div className="p-2 border rounded text-center bg-light small">
                      <i className="bi bi-calendar-plus text-success fs-5 d-block mb-1"></i>
                      <strong className="d-block text-dark">Publish Events</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Create & schedule sessions</span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-2 border rounded text-center bg-light small">
                      <i className="bi bi-people-fill text-primary fs-5 d-block mb-1"></i>
                      <strong className="d-block text-dark">Live Roster</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Access attendee lists</span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-2 border rounded text-center bg-light small">
                      <i className="bi bi-check2-circle text-warning fs-5 d-block mb-1"></i>
                      <strong className="d-block text-dark">Mark Attendance</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Venue check-ins</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Organizer / Faculty Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Dr. Sarah Jenkins / Prof. Michael Chang"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Official Campus Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. faculty.name@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <small className="text-muted">Use your institutional or club email address</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Designated Role</label>
                    <div className="p-2 border rounded bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success fs-6"><i className="bi bi-shield-check me-1"></i>ORGANIZER</span>
                        <span className="small text-muted">Event Organizer & Department Coordinator</span>
                      </div>
                      <small className="text-success fw-semibold">Auto-assigned</small>
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
                    className="btn btn-success w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Organizer Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check-fill me-2"></i>
                        Register as Event Organizer
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-1">
                    Already registered as an organizer?{' '}
                    <Link to="/login" className="fw-semibold text-primary">
                      Log In to Your Portal
                    </Link>
                  </p>
                  <p className="text-muted small mb-0">
                    Are you a student?{' '}
                    <Link to="/register" className="fw-semibold text-success">
                      Student Registration Here
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
