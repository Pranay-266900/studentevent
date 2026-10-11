import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../components/Badges';

export const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);

  // Role change modal state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [newRole, setNewRole] = useState('STUDENT');
  const [updatingRole, setUpdatingRole] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (selectedRole) query.append('role', selectedRole);
    if (searchTerm) query.append('search', searchTerm);

    api.get(`/admin/users?${query.toString()}`)
      .then(data => {
        setUsers(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to load user directory.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      alert("You cannot disable your own active administrator account.");
      return;
    }

    const nextStatus = !user.enabled;
    const actionLabel = nextStatus ? 'enable' : 'disable';
    if (!window.confirm(`Are you sure you want to ${actionLabel} account for ${user.fullName} (${user.email})?`)) {
      return;
    }

    try {
      const updated = await api.patch(`/admin/users/${user.id}/status`, { enabled: nextStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, enabled: updated.enabled } : u));
      setMessage({
        type: 'success',
        text: `Account for ${user.fullName} successfully ${nextStatus ? 'enabled' : 'disabled'}.`
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.message || 'Failed to update account status.'
      });
    }
  };

  const handleOpenRoleModal = (user) => {
    setRoleModalUser(user);
    setNewRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    setUpdatingRole(true);
    setMessage(null);

    try {
      const updated = await api.patch(`/admin/users/${roleModalUser.id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === roleModalUser.id ? { ...u, role: updated.role } : u));
      setMessage({
        type: 'success',
        text: `Role for ${roleModalUser.fullName} updated to ${updated.role}.`
      });
      setRoleModalUser(null);
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.message || 'Failed to update user role.'
      });
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Campus User Directory</h2>
            <p className="text-muted mb-0">Manage roles, access status, and security permissions for all campus accounts</p>
          </div>
          <Link to="/admin-dashboard" className="btn btn-outline-secondary">
            <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
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

        {/* Filter & Search Bar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedRole('')}
                  >
                    All Roles
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'STUDENT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedRole('STUDENT')}
                  >
                    Students
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'ORGANIZER' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedRole('ORGANIZER')}
                  >
                    Organizers
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'ADMIN' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedRole('ADMIN')}
                  >
                    Admins
                  </button>
                </div>
              </div>

              <div className="col-md-7">
                <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by full name or campus email..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Search</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Registered Accounts</h5>
            <span className="badge bg-light text-dark border">{users.length} Users Found</span>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading user accounts...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-person-x fs-1 text-muted mb-2"></i>
                <h6 className="fw-bold">No Users Found</h6>
                <p className="text-muted small">No accounts match the current filter or search criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Created On</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      let roleBadgeClass = 'bg-primary';
                      if (u.role === 'ADMIN') roleBadgeClass = 'bg-danger';
                      if (u.role === 'ORGANIZER') roleBadgeClass = 'bg-success';

                      return (
                        <tr key={u.id}>
                          <td><code className="text-muted">#{u.id}</code></td>
                          <td>
                            <strong className="text-dark">{u.fullName}</strong>
                            {u.id === currentUser?.id && (
                              <span className="badge bg-secondary ms-2 small">You</span>
                            )}
                          </td>
                          <td>
                            <span className="small text-muted">{u.email}</span>
                          </td>
                          <td>
                            <span className={`badge ${roleBadgeClass}`}>{u.role}</span>
                          </td>
                          <td>
                            {u.enabled ? (
                              <span className="badge bg-success-subtle text-success border border-success">
                                <i className="bi bi-check-circle-fill me-1"></i> Active
                              </span>
                            ) : (
                              <span className="badge bg-danger-subtle text-danger border border-danger">
                                <i className="bi bi-slash-circle-fill me-1"></i> Disabled
                              </span>
                            )}
                          </td>
                          <td className="small text-muted">
                            {formatDateTime(u.createdAt)}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => handleOpenRoleModal(u)}
                                title="Change User Role"
                              >
                                <i className="bi bi-person-gear me-1"></i> Role
                              </button>
                              <button
                                type="button"
                                className={`btn ${u.enabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                disabled={u.id === currentUser?.id}
                                onClick={() => handleToggleStatus(u)}
                                title={u.enabled ? 'Disable Account' : 'Enable Account'}
                              >
                                {u.enabled ? (
                                  <>
                                    <i className="bi bi-lock me-1"></i> Disable
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-unlock me-1"></i> Enable
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

        {/* Change Role Modal */}
        {roleModalUser && (
          <div className="modal show fade d-block modal-backdrop-custom" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Update Role for {roleModalUser.fullName}</h5>
                  <button type="button" className="btn-close" onClick={() => setRoleModalUser(null)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted small">
                    Assigning a new role will instantly alter account permissions and portal access.
                  </p>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Role</label>
                    <select
                      className="form-select"
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                    >
                      <option value="STUDENT">Student (Event Participant)</option>
                      <option value="ORGANIZER">Organizer (Event Publisher & Attendance Marker)</option>
                      <option value="ADMIN">Administrator (Full Campus Governance)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setRoleModalUser(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={updatingRole}
                    onClick={handleSaveRole}
                  >
                    {updatingRole ? 'Updating...' : 'Save Role'}
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
