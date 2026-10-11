import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AttendanceBadge, RegistrationStatusBadge, formatDate, formatDateTime } from '../components/Badges';

export const OrganizerParticipants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  // 1. Fetch organizer's events list
  useEffect(() => {
    api.get('/organizer/events')
      .then(data => {
        setEvents(data);
        if (data.length > 0) {
          // If no initialEventId or it doesn't match, pick the first event
          const matched = data.find(e => e.id.toString() === initialEventId);
          if (matched) {
            setSelectedEventId(matched.id.toString());
            setSelectedEvent(matched);
          } else {
            setSelectedEventId(data[0].id.toString());
            setSelectedEvent(data[0]);
          }
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load your events.');
      })
      .finally(() => setLoadingEvents(false));
  }, []);

  // 2. Fetch roster whenever selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) return;

    setLoadingRoster(true);
    const matched = events.find(e => e.id.toString() === selectedEventId.toString());
    if (matched) setSelectedEvent(matched);

    api.get(`/organizer/events/${selectedEventId}/registrations`)
      .then(data => {
        setRegistrations(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to load participants for this event.');
        setRegistrations([]);
      })
      .finally(() => setLoadingRoster(false));
  }, [selectedEventId, events]);

  const handleEventChange = (e) => {
    const newId = e.target.value;
    setSelectedEventId(newId);
    setSearchParams({ eventId: newId });
  };

  const handleUpdateAttendance = async (regId, status) => {
    setUpdatingId(regId);
    setMessage(null);
    try {
      const updated = await api.patch(`/organizer/registrations/${regId}/attendance`, {
        attendanceStatus: status
      });

      // Update in local state
      setRegistrations(prev =>
        prev.map(r => (r.id === regId ? { ...r, attendanceStatus: updated.attendanceStatus } : r))
      );

      setMessage({
        type: 'success',
        text: `Attendance marked as ${status} for ${updated.user?.fullName || 'student'}.`
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.message || 'Failed to update attendance status.'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter roster by search term
  const filteredRoster = registrations.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = (r.user?.fullName || '').toLowerCase();
    const email = (r.user?.email || '').toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // Calculate attendance counters
  const totalCount = registrations.length;
  const presentCount = registrations.filter(r => r.attendanceStatus === 'PRESENT').length;
  const absentCount = registrations.filter(r => r.attendanceStatus === 'ABSENT').length;
  const pendingCount = registrations.filter(r => r.attendanceStatus === 'PENDING').length;

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Participant Attendance Management</h2>
            <p className="text-muted mb-0">Record and verify student check-ins at your venue in real time</p>
          </div>
          <Link to="/organizer-dashboard" className="btn btn-outline-secondary">
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </Link>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* Event Selection Bar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-7">
                <label className="form-label small fw-semibold text-muted mb-1">Select Event:</label>
                {loadingEvents ? (
                  <span className="spinner-border spinner-border-sm ms-2" role="status"></span>
                ) : events.length === 0 ? (
                  <div className="text-muted small">No events found. Create one first!</div>
                ) : (
                  <select
                    className="form-select fw-semibold"
                    value={selectedEventId}
                    onChange={handleEventChange}
                  >
                    {events.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({formatDate(e.eventDate)}) — {e.registeredCount} Registrations
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-5">
                <label className="form-label small fw-semibold text-muted mb-1">Search Attendees:</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by student name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Attendance Stats Summary */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Total Registered</span>
                <h3 className="fw-bold text-primary mt-1 mb-0">{totalCount}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Present</span>
                <h3 className="fw-bold text-success mt-1 mb-0">{presentCount}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Absent</span>
                <h3 className="fw-bold text-danger mt-1 mb-0">{absentCount}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Pending Check-in</span>
                <h3 className="fw-bold text-warning mt-1 mb-0">{pendingCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Participant Roster Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0">Attendee Roster</h5>
              {selectedEvent && (
                <small className="text-muted">
                  Venue: {selectedEvent.location} &bull; Date: {formatDate(selectedEvent.eventDate)}
                </small>
              )}
            </div>
            <span className="badge bg-light text-dark border">
              Showing {filteredRoster.length} of {totalCount} Students
            </span>
          </div>
          <div className="card-body p-0">
            {loadingRoster ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading participants...</p>
              </div>
            ) : filteredRoster.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people fs-1 text-muted mb-2"></i>
                <h6 className="fw-bold">No Attendees Found</h6>
                <p className="text-muted small">
                  {searchTerm ? 'No attendees match your search query.' : 'No students have registered for this event yet.'}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Campus Email</th>
                      <th>Registration Status</th>
                      <th>Registered At</th>
                      <th>Current Attendance</th>
                      <th className="text-end">Record Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((reg, index) => {
                      const isUpdating = updatingId === reg.id;
                      return (
                        <tr key={reg.id}>
                          <td className="text-muted small">{index + 1}</td>
                          <td>
                            <strong className="text-dark">{reg.user?.fullName}</strong>
                          </td>
                          <td className="text-muted small">
                            <i className="bi bi-envelope me-1"></i>{reg.user?.email}
                          </td>
                          <td>
                            <RegistrationStatusBadge status={reg.registrationStatus} />
                          </td>
                          <td className="text-muted small">
                            {formatDateTime(reg.registrationDate)}
                          </td>
                          <td>
                            <AttendanceBadge status={reg.attendanceStatus} />
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className={`btn ${reg.attendanceStatus === 'PRESENT' ? 'btn-success' : 'btn-outline-success'}`}
                                disabled={isUpdating || reg.registrationStatus === 'CANCELLED'}
                                onClick={() => handleUpdateAttendance(reg.id, 'PRESENT')}
                                title="Mark as Present"
                              >
                                {isUpdating ? (
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                  <>
                                    <i className="bi bi-check2-circle me-1"></i> Present
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                className={`btn ${reg.attendanceStatus === 'ABSENT' ? 'btn-danger' : 'btn-outline-danger'}`}
                                disabled={isUpdating || reg.registrationStatus === 'CANCELLED'}
                                onClick={() => handleUpdateAttendance(reg.id, 'ABSENT')}
                                title="Mark as Absent"
                              >
                                {isUpdating ? (
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                  <>
                                    <i className="bi bi-x-circle me-1"></i> Absent
                                  </>
                                )}
                              </button>
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
