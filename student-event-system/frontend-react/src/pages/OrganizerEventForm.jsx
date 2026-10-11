import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export const OrganizerEventForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    maxCapacity: 100
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [error, setError] = useState('');

  const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

  useEffect(() => {
    if (editId) {
      setFetching(true);
      api.get(`/events/${editId}`)
        .then(event => {
          setFormData({
            title: event.title || '',
            description: event.description || '',
            category: event.category || 'Technical',
            eventDate: event.eventDate || '',
            startTime: event.startTime ? event.startTime.substring(0, 5) : '09:00',
            endTime: event.endTime ? event.endTime.substring(0, 5) : '17:00',
            location: event.location || '',
            maxCapacity: event.maxCapacity || 100
          });
        })
        .catch(err => {
          setError(err.message || 'Failed to load event for editing.');
        })
        .finally(() => setFetching(false));
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxCapacity' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.maxCapacity < 1) {
      setError('Capacity must be at least 1.');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time.');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/events/${editId}`, formData);
      } else {
        await api.post('/events', formData);
      }
      navigate('/organizer-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save event. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="fw-bold mb-1">{editId ? 'Edit Event' : 'Create New Event'}</h2>
                <p className="text-muted mb-0">
                  {editId ? 'Update details for this scheduled event.' : 'Publish a new campus event and open registration for students.'}
                </p>
              </div>
              <Link to="/organizer-dashboard" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
              </div>
            )}

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="e.g. Annual Campus Hackathon 2026"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Maximum Capacity *</label>
                      <input
                        type="number"
                        name="maxCapacity"
                        className="form-control"
                        min="1"
                        max="5000"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted">Seats available for student registration</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Event Description *</label>
                    <textarea
                      name="description"
                      rows="4"
                      className="form-control"
                      placeholder="Detailed outline of topics, guest speakers, rules, and student expectations..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Event Date *</label>
                      <input
                        type="date"
                        name="eventDate"
                        className="form-control"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Start Time *</label>
                      <input
                        type="time"
                        name="startTime"
                        className="form-control"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">End Time *</label>
                      <input
                        type="time"
                        name="endTime"
                        className="form-control"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Location / Venue *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><i className="bi bi-geo-alt"></i></span>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Main Auditorium / Innovation Lab 301"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                    <Link to="/organizer-dashboard" className="btn btn-secondary px-4">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving Event...
                        </>
                      ) : (
                        editId ? 'Update Event' : 'Publish Event'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
