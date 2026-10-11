import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../components/Badges';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    try {
      const payload = { fullName };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      await updateProfile(payload);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  let roleBadgeClass = 'bg-primary';
  if (user?.role === 'ADMIN') roleBadgeClass = 'bg-danger';
  if (user?.role === 'ORGANIZER') roleBadgeClass = 'bg-success';

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <h2 className="fw-bold mb-1">User Profile & Settings</h2>
            <p className="text-muted mb-4">Manage your campus account details and security credentials</p>

            {message && (
              <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
                <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2`}></i>
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
              </div>
            )}

            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-person-circle fs-1"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1">{user?.fullName}</h4>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small">{user?.email}</span>
                      <span className={`badge ${roleBadgeClass}`}>{user?.role}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Campus Email Address</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                    <small className="text-muted">Campus email address cannot be changed</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <h5 className="fw-bold mt-4 mb-3 pt-3 border-top">Change Password</h5>
                  <p className="text-muted small">Leave blank if you do not want to change your password.</p>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4 text-muted small">
                <div className="row">
                  <div className="col-sm-6 mb-2 mb-sm-0">
                    <strong>Account Status:</strong> <span className="text-success fw-semibold">Active & Verified</span>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <strong>Member Since:</strong> {formatDateTime(user?.createdAt)}
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
