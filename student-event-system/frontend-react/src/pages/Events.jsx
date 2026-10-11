import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, StatusBadge, formatDate, formatTime } from '../components/Badges';

export const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Filters state initialized from searchParams
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');

  // Selected event for modal details
  const [activeEvent, setActiveEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    api.get('/events/categories')
      .then(setCategories)
      .catch(err => console.warn('Categories load error', err));
  }, []);

  // Fetch events whenever filters change
  const fetchEvents = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (selectedCategory) query.append('category', selectedCategory);
    if (selectedStatus) query.append('status', selectedStatus);
    if (selectedDate) query.append('date', selectedDate);

    api.get(`/events?${query.toString()}`)
      .then(data => {
        setEvents(data);
        setError('');

        // If an id param was in URL, auto-open that modal
        const targetId = searchParams.get('id');
        if (targetId) {
          const found = data.find(e => e.id.toString() === targetId);
          if (found) setActiveEvent(found);
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load events.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus, selectedDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedDate('');
    setSearchParams({});
    api.get('/events').then(setEvents);
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      navigate(`/login?redirect=/events?id=${eventId}`);
      return;
    }

    if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      setActionMessage({ type: 'danger', text: 'Only students can register for events.' });
      return;
    }

    setRegistering(true);
    setActionMessage(null);

    try {
      await api.post('/registrations', { eventId });
      setActionMessage({
        type: 'success',
        text: 'Registration successful! Your pass is confirmed. View it in "My Registrations".'
      });
      // Refresh events to update capacity count and isRegistered flag
      fetchEvents();
      // Also update activeEvent if open
      if (activeEvent && activeEvent.id === eventId) {
        setActiveEvent(prev => ({
          ...prev,
          registeredCount: prev.registeredCount + 1,
          isUserRegistered: true
        }));
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.message || 'Failed to complete registration.'
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Campus Events Catalog</h2>
            <p className="text-muted mb-0">Browse and participate in extracurricular & academic events</p>
          </div>
          {user?.role === 'ORGANIZER' && (
            <button
              onClick={() => navigate('/organizer-event-form')}
              className="btn btn-primary"
            >
              <i className="bi bi-plus-lg me-1"></i> Create New Event
            </button>
          )}
        </div>

        {actionMessage && (
          <div className={`alert alert-${actionMessage.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${actionMessage.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2`}></i>
            {actionMessage.text}
            <button type="button" className="btn-close" onClick={() => setActionMessage(null)}></button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
              <div className="col-lg-4 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by title, description, venue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-3 col-md-3 col-6">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-md-3 col-6">
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-4 col-8">
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="col-lg-1 col-md-2 col-4 d-flex gap-1">
                <button type="submit" className="btn btn-primary w-100" title="Apply Search">
                  <i className="bi bi-filter"></i>
                </button>
                <button type="button" onClick={handleResetFilters} className="btn btn-outline-secondary" title="Reset Filters">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading events catalog...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        ) : events.length === 0 ? (
          <div className="card text-center p-5 border-dashed shadow-sm">
            <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
            <h5 className="fw-bold">No Events Found</h5>
            <p className="text-muted">No events match the selected filter criteria. Try resetting the filters.</p>
            <div>
              <button onClick={handleResetFilters} className="btn btn-outline-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {events.map((event) => {
              const isFull = event.registeredCount >= event.maxCapacity;
              const isCancelled = event.status === 'CANCELLED';
              const isCompleted = event.status === 'COMPLETED';
              const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

              return (
                <div key={event.id} className="col-lg-4 col-md-6">
                  <div className="card event-card h-100 shadow-sm border-0">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <CategoryBadge category={event.category} />
                        <StatusBadge status={event.status} />
                      </div>

                      <h5 className="card-title fw-bold text-dark mb-2">{event.title}</h5>

                      <p className="card-text text-muted small flex-grow-1">
                        {event.description?.length > 120
                          ? `${event.description.substring(0, 120)}...`
                          : event.description}
                      </p>

                      {/* Capacity Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Capacity</span>
                          <span className={isFull ? 'text-danger fw-bold' : 'fw-semibold'}>
                            {event.registeredCount} / {event.maxCapacity} {isFull && '(FULL)'}
                          </span>
                        </div>
                        <div className="progress progress-thin">
                          <div
                            className={`progress-bar ${isFull ? 'bg-danger' : capacityPercent > 80 ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${capacityPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Details & Metadata */}
                      <div className="border-top pt-3 text-muted small">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-calendar3 text-primary me-2"></i>
                          <span>{formatDate(event.eventDate)} &bull; {formatTime(event.startTime)}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt text-danger me-2"></i>
                          <span className="text-truncate">{event.location}</span>
                        </div>
                        <div className="d-flex align-items-center mb-3 text-secondary small">
                          <i className="bi bi-person-badge me-2"></i>
                          <span className="text-truncate">Organizer: {event.organizerName || 'College Faculty'}</span>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm flex-grow-1"
                            onClick={() => setActiveEvent(event)}
                          >
                            <i className="bi bi-info-circle me-1"></i> Details
                          </button>

                          {user?.role === 'STUDENT' ? (
                            event.isUserRegistered ? (
                              <button className="btn btn-outline-success btn-sm flex-grow-1" disabled>
                                <i className="bi bi-check2-circle me-1"></i> Registered
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm flex-grow-1"
                                disabled={isFull || isCancelled || isCompleted || registering}
                                onClick={() => handleRegister(event.id)}
                              >
                                {isFull ? 'Full' : isCancelled ? 'Cancelled' : 'Register'}
                              </button>
                            )
                          ) : !user ? (
                            <button
                              className="btn btn-primary btn-sm flex-grow-1"
                              onClick={() => navigate(`/login?redirect=/events?id=${event.id}`)}
                            >
                              Login to Register
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Event Detail Modal */}
        {activeEvent && (
          <div className="modal show fade d-block modal-backdrop-custom" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <div>
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <CategoryBadge category={activeEvent.category} />
                      <StatusBadge status={activeEvent.status} />
                    </div>
                    <h4 className="modal-title fw-bold mb-0">{activeEvent.title}</h4>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setActiveEvent(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    <div className="col-md-7">
                      <h6 className="fw-bold text-uppercase small text-muted">About the Event</h6>
                      <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                        {activeEvent.description}
                      </p>

                      <h6 className="fw-bold text-uppercase small text-muted mt-4">Event Details</h6>
                      <ul className="list-unstyled text-muted small">
                        <li className="mb-2">
                          <i className="bi bi-calendar3 text-primary me-2 fs-6"></i>
                          <strong>Date:</strong> {formatDate(activeEvent.eventDate)}
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-clock text-primary me-2 fs-6"></i>
                          <strong>Time:</strong> {formatTime(activeEvent.startTime)} - {formatTime(activeEvent.endTime)}
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-geo-alt text-danger me-2 fs-6"></i>
                          <strong>Venue:</strong> {activeEvent.location}
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-person-badge text-success me-2 fs-6"></i>
                          <strong>Organizer:</strong> {activeEvent.organizerName} ({activeEvent.organizerEmail})
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-5">
                      <div className="card bg-light border-0 p-3 rounded-3">
                        <h6 className="fw-bold mb-3">Participation Status</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Seats Reserved:</span>
                          <span className="fw-bold">{activeEvent.registeredCount} / {activeEvent.maxCapacity}</span>
                        </div>
                        <div className="progress progress-thin mb-3">
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${Math.min(100, Math.round((activeEvent.registeredCount / activeEvent.maxCapacity) * 100))}%` }}
                          ></div>
                        </div>

                        {activeEvent.registeredCount >= activeEvent.maxCapacity && (
                          <div className="alert alert-warning py-2 small mb-3">
                            <i className="bi bi-exclamation-triangle me-1"></i> Registration is full.
                          </div>
                        )}

                        {user?.role === 'STUDENT' ? (
                          activeEvent.isUserRegistered ? (
                            <div className="alert alert-success py-2 small text-center mb-0">
                              <i className="bi bi-check-circle-fill me-1"></i> You are registered!
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              disabled={
                                activeEvent.registeredCount >= activeEvent.maxCapacity ||
                                activeEvent.status !== 'UPCOMING' ||
                                registering
                              }
                              onClick={() => handleRegister(activeEvent.id)}
                            >
                              {registering ? 'Confirming...' : 'Confirm Registration'}
                            </button>
                          )
                        ) : !user ? (
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate(`/login?redirect=/events?id=${activeEvent.id}`)}
                          >
                            Log In to Register
                          </button>
                        ) : (
                          <div className="alert alert-info py-2 small text-center mb-0">
                            Logged in as {user.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveEvent(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
