import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CategoryBadge,
  AttendanceBadge,
  RegistrationStatusBadge,
  formatDate,
  formatTime,
  formatDateTime
} from '../components/Badges';

export const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Selected pass for viewing modal
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = () => {
    setLoading(true);
    api.get('/registrations/my')
      .then(data => {
        setRegistrations(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to load your registrations.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? This will free up the seat for other students.`)) {
      return;
    }

    setCancellingId(id);
    setActionMessage(null);
    try {
      await api.delete(`/registrations/${id}`);
      setActionMessage({
        type: 'info',
        text: `Registration for "${eventTitle}" has been cancelled.`
      });
      fetchRegistrations();
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.message || 'Failed to cancel registration.'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handlePrintPass = () => {
    window.print();
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Event Passes & Registrations</h2>
            <p className="text-muted mb-0">View all your registered events, access passes, and check attendance history</p>
          </div>
          <Link to="/events" className="btn btn-primary">
            <i className="bi bi-calendar-plus me-1"></i> Register More Events
          </Link>
        </div>

        {actionMessage && (
          <div className={`alert alert-${actionMessage.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${actionMessage.type === 'success' ? 'check-circle-fill' : 'info-circle-fill'} me-2`}></i>
            {actionMessage.text}
            <button type="button" className="btn-close" onClick={() => setActionMessage(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading your registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-ticket-perforated fs-1 text-muted mb-3"></i>
                <h5 className="fw-bold">No Registrations Found</h5>
                <p className="text-muted">You haven't registered for any events yet.</p>
                <Link to="/events" className="btn btn-primary btn-sm">
                  Explore Events Catalog
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Pass ID</th>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Attendance</th>
                      <th>Registered On</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => {
                      const isCancelled = reg.registrationStatus === 'CANCELLED';
                      return (
                        <tr key={reg.id}>
                          <td>
                            <code className="text-primary fw-bold">#{reg.id}</code>
                          </td>
                          <td>
                            <span className="fw-bold text-dark">{reg.event?.title}</span>
                            <div className="text-muted small">
                              <i className="bi bi-geo-alt me-1"></i>{reg.event?.location}
                            </div>
                          </td>
                          <td>
                            <CategoryBadge category={reg.event?.category} />
                          </td>
                          <td>
                            <span className="small">
                              {formatDate(reg.event?.eventDate)}
                            </span>
                            <div className="text-muted small">
                              {formatTime(reg.event?.startTime)} - {formatTime(reg.event?.endTime)}
                            </div>
                          </td>
                          <td>
                            <RegistrationStatusBadge status={reg.registrationStatus} />
                          </td>
                          <td>
                            <AttendanceBadge status={reg.attendanceStatus} />
                          </td>
                          <td className="small text-muted">
                            {formatDateTime(reg.registrationDate)}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => setSelectedPass(reg)}
                                title="View & Print Event Pass"
                              >
                                <i className="bi bi-qr-code me-1"></i> Pass
                              </button>
                              {!isCancelled && reg.attendanceStatus === 'PENDING' && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  disabled={cancellingId === reg.id}
                                  onClick={() => handleCancelRegistration(reg.id, reg.event?.title)}
                                  title="Cancel Registration"
                                >
                                  {cancellingId === reg.id ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-x-circle"></i>
                                  )}
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

        {/* Printable Event Pass Modal */}
        {selectedPass && (
          <div className="modal show fade d-block modal-backdrop-custom" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow border-0">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-mortarboard-fill text-warning me-2"></i>
                    Official Event Pass
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedPass(null)}
                  ></button>
                </div>
                <div className="modal-body p-4" id="printableTicketArea">
                  <div className="border border-2 border-primary rounded-3 p-4 bg-white position-relative">
                    {/* Watermark/Status Badge */}
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                      <div>
                        <span className="badge bg-primary text-uppercase px-2 py-1 mb-1">
                          CampusEventHub Entry Pass
                        </span>
                        <h4 className="fw-bold mb-0 text-dark">{selectedPass.event?.title}</h4>
                      </div>
                      <CategoryBadge category={selectedPass.event?.category} />
                    </div>

                    <div className="row g-3 my-2">
                      <div className="col-7">
                        <div className="mb-2">
                          <small className="text-muted d-block text-uppercase">Student Attendee</small>
                          <strong className="fs-6 text-dark">{user?.fullName}</strong>
                          <div className="small text-muted">{user?.email}</div>
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-block text-uppercase">Event Schedule</small>
                          <span className="text-dark fw-semibold">
                            {formatDate(selectedPass.event?.eventDate)}
                          </span>
                          <div className="small text-muted">
                            {formatTime(selectedPass.event?.startTime)} - {formatTime(selectedPass.event?.endTime)}
                          </div>
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-block text-uppercase">Venue</small>
                          <span className="text-dark small fw-semibold">
                            {selectedPass.event?.location}
                          </span>
                        </div>
                      </div>

                      <div className="col-5 text-center d-flex flex-column align-items-center justify-content-center border-start ps-3">
                        {/* Simulated High-Res QR Code */}
                        <div className="p-2 border rounded bg-white shadow-sm mb-2">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="#1e293b">
                            <rect width="100" height="100" fill="#ffffff" />
                            {/* Position Detection Squares */}
                            <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                            <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                            <rect x="13" y="13" width="9" height="9" fill="#1e293b" />

                            <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                            <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                            <rect x="78" y="13" width="9" height="9" fill="#1e293b" />

                            <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                            <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                            <rect x="13" y="78" width="9" height="9" fill="#1e293b" />

                            {/* Data grid pattern */}
                            <rect x="35" y="10" width="8" height="8" fill="#1e293b" />
                            <rect x="47" y="15" width="8" height="8" fill="#1e293b" />
                            <rect x="35" y="25" width="8" height="8" fill="#1e293b" />
                            <rect x="10" y="40" width="8" height="8" fill="#1e293b" />
                            <rect x="25" y="45" width="8" height="8" fill="#1e293b" />
                            <rect x="45" y="40" width="10" height="10" fill="#1e293b" />
                            <rect x="65" y="45" width="8" height="8" fill="#1e293b" />
                            <rect x="80" y="40" width="10" height="10" fill="#1e293b" />
                            <rect x="40" y="65" width="8" height="8" fill="#1e293b" />
                            <rect x="55" y="70" width="8" height="8" fill="#1e293b" />
                            <rect x="75" y="65" width="8" height="8" fill="#1e293b" />
                            <rect x="85" y="75" width="8" height="8" fill="#1e293b" />
                          </svg>
                        </div>
                        <small className="fw-bold text-dark font-monospace">PASS-#{selectedPass.id}</small>
                        <AttendanceBadge status={selectedPass.attendanceStatus} />
                      </div>
                    </div>

                    <div className="border-top pt-2 mt-2 d-flex justify-content-between text-muted small">
                      <span>Organizer: {selectedPass.event?.organizerName}</span>
                      <span>Booked: {formatDate(selectedPass.registrationDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedPass(null)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handlePrintPass}>
                    <i className="bi bi-printer me-1"></i> Print Pass
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
