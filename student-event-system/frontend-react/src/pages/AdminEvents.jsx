import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CategoryBadge, StatusBadge, formatDate, formatTime } from '../components/Badges';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = () => {
    setLoading(true);
    api.get('/events')
      .then(data => {
        setEvents(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to load events.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCancelEvent = async (event) => {
    if (!window.confirm(`Are you sure you want to cancel the event "${event.title}" organized by ${event.organizerName}?`)) {
      return;
    }

    try {
      await api.delete(`/events/${event.id}`);
      setMessage({ type: 'info', text: `Event "${event.title}" was marked as CANCELLED.` });
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to cancel event.' });
    }
  };

  const filteredEvents = events.filter(e => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (e.title || '').toLowerCase().includes(term) ||
      (e.organizerName || '').toLowerCase().includes(term) ||
      (e.location || '').toLowerCase().includes(term) ||
      (e.category || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Campus Events Oversight</h2>
            <p className="text-muted mb-0">Audit, supervise, and moderate events published by faculty and clubs</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin-reports" className="btn btn-outline-primary">
              <i className="bi bi-file-earmark-bar-graph me-1"></i> View Reports
            </Link>
            <Link to="/admin-dashboard" className="btn btn-outline-secondary">
              <i className="bi bi-speedometer2 me-1"></i> Dashboard
            </Link>
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${message.type === 'info' ? 'info-circle-fill' : 'check-circle-fill'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* Search */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search events by title, organizer name, category, or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Institutional Events</h5>
            <span className="badge bg-light text-dark border">{filteredEvents.length} Events</span>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading events roster...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                <h6 className="fw-bold">No Events Found</h6>
                <p className="text-muted small">No scheduled events match your search.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>ID</th>
                      <th>Event Title</th>
                      <th>Organizer</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Enrollment</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => {
                      const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));
                      return (
                        <tr key={event.id}>
                          <td><code className="text-muted">#{event.id}</code></td>
                          <td>
                            <strong className="text-dark">{event.title}</strong>
                          </td>
                          <td>
                            <span className="small text-muted">{event.organizerName}</span>
                            <div className="small text-muted">{event.organizerEmail}</div>
                          </td>
                          <td>
                            <CategoryBadge category={event.category} />
                          </td>
                          <td>
                            <span className="small">{formatDate(event.eventDate)}</span>
                            <div className="text-muted small">{formatTime(event.startTime)}</div>
                          </td>
                          <td>
                            <span className="small text-muted">{event.location}</span>
                          </td>
                          <td style={{ minWidth: '120px' }}>
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>{event.registeredCount}/{event.maxCapacity}</span>
                              <span>{capacityPercent}%</span>
                            </div>
                            <div className="progress progress-thin">
                              <div
                                className={`progress-bar ${capacityPercent >= 100 ? 'bg-danger' : 'bg-primary'}`}
                                style={{ width: `${capacityPercent}%` }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={event.status} />
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <Link
                                to={`/events?id=${event.id}`}
                                className="btn btn-outline-primary"
                                title="View Public Listing"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              {event.status !== 'CANCELLED' && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => handleCancelEvent(event)}
                                  title="Cancel Event"
                                >
                                  <i className="bi bi-slash-circle me-1"></i> Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
