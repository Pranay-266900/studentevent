import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  AttendanceBadge,
  RegistrationStatusBadge,
  CategoryBadge,
  formatDate,
  formatDateTime
} from '../components/Badges';

export const AdminReports = () => {
  const [events, setEvents] = useState([]);
  const [filterEventId, setFilterEventId] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);

  // Load events list for filter dropdown
  useEffect(() => {
    api.get('/events')
      .then(setEvents)
      .catch(err => console.warn('Events load error in reports', err));
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filterEventId) params.append('eventId', filterEventId);
    if (filterStartDate) params.append('startDate', filterStartDate);
    if (filterEndDate) params.append('endDate', filterEndDate);
    if (filterStatus) params.append('status', filterStatus);
    return params.toString();
  };

  const fetchReports = () => {
    setLoading(true);
    const qs = buildQuery();
    api.get(`/admin/reports?${qs}`)
      .then(data => {
        setReport(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to generate report.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleResetFilters = () => {
    setFilterEventId('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterStatus('');
    api.get('/admin/reports').then(setReport);
  };

  const handleExportCsv = async () => {
    setDownloading(true);
    setMessage(null);
    try {
      const qs = buildQuery();
      const filename = `campus_events_report_${new Date().toISOString().slice(0, 10)}.csv`;
      await api.downloadCsv(`/admin/reports/csv?${qs}`, filename);
      setMessage({ type: 'success', text: `Report exported successfully as ${filename}.` });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to download CSV report.' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Campus Analytics & Participation Reports</h2>
            <p className="text-muted mb-0">Generate audits, measure student turnout, and export reports to CSV</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={handleExportCsv}
              className="btn btn-success fw-semibold"
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Exporting CSV...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-arrow-down-fill me-1"></i> Export to CSV
                </>
              )}
            </button>
            <Link to="/admin-dashboard" className="btn btn-outline-secondary">
              <i className="bi bi-speedometer2 me-1"></i> Dashboard
            </Link>
          </div>
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

        {/* Filter Toolbar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <form onSubmit={handleFilterSubmit} className="row g-2 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-semibold text-muted mb-1">Filter by Event</label>
                <select
                  className="form-select form-select-sm"
                  value={filterEventId}
                  onChange={e => setFilterEventId(e.target.value)}
                >
                  <option value="">All Events</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({formatDate(e.eventDate)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-md-3 col-6">
                <label className="form-label small fw-semibold text-muted mb-1">From Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filterStartDate}
                  onChange={e => setFilterStartDate(e.target.value)}
                />
              </div>

              <div className="col-lg-2 col-md-3 col-6">
                <label className="form-label small fw-semibold text-muted mb-1">To Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filterEndDate}
                  onChange={e => setFilterEndDate(e.target.value)}
                />
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-semibold text-muted mb-1">Attendance / Status</label>
                <select
                  className="form-select form-select-sm"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">All Attendance States</option>
                  <option value="PRESENT">Present Only</option>
                  <option value="ABSENT">Absent Only</option>
                  <option value="PENDING">Pending Check-in</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6 d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm flex-grow-1">
                  <i className="bi bi-filter me-1"></i> Apply
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-outline-secondary btn-sm"
                  title="Reset Filters"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Report Stats Summary */}
        <div className="row g-3 mb-4">
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Total Passes</span>
                <h3 className="fw-bold text-primary mt-1 mb-0">{report?.totalRegistrations ?? 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Verified Present</span>
                <h3 className="fw-bold text-success mt-1 mb-0">{report?.attendedCount ?? 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Absent</span>
                <h3 className="fw-bold text-danger mt-1 mb-0">{report?.absentCount ?? 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Pending</span>
                <h3 className="fw-bold text-warning mt-1 mb-0">{report?.pendingCount ?? 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Cancelled</span>
                <h3 className="fw-bold text-secondary mt-1 mb-0">{report?.cancelledCount ?? 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card stat-card shadow-sm border-0">
              <div className="card-body">
                <span className="text-muted small fw-semibold text-uppercase">Turnout Rate</span>
                <h3 className="fw-bold text-info mt-1 mb-0">
                  {report?.attendanceRate != null ? `${report.attendanceRate}%` : '0%'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Records Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Audit Record Details</h5>
            <span className="badge bg-light text-dark border">
              {report?.records?.length ?? 0} Records in Scope
            </span>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Computing report data...</p>
              </div>
            ) : !report?.records || report.records.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-excel fs-1 text-muted mb-2"></i>
                <h6 className="fw-bold">No Records Found</h6>
                <p className="text-muted small">No registration records matched the selected query parameters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Reg ID</th>
                      <th>Student Name</th>
                      <th>Student Email</th>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Event Date</th>
                      <th>Registration Status</th>
                      <th>Attendance</th>
                      <th>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.records.map(rec => (
                      <tr key={rec.id}>
                        <td><code className="text-muted">#{rec.id}</code></td>
                        <td><strong className="text-dark">{rec.studentName || rec.user?.fullName}</strong></td>
                        <td className="small text-muted">{rec.studentEmail || rec.user?.email}</td>
                        <td className="text-dark">{rec.eventTitle || rec.event?.title}</td>
                        <td><CategoryBadge category={rec.category || rec.event?.category} /></td>
                        <td className="small">{formatDate(rec.eventDate || rec.event?.eventDate)}</td>
                        <td><RegistrationStatusBadge status={rec.registrationStatus} /></td>
                        <td><AttendanceBadge status={rec.attendanceStatus} /></td>
                        <td className="small text-muted">{formatDateTime(rec.registrationDate)}</td>
                      </tr>
                    ))}
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
