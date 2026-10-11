import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  let roleBadgeClass = 'bg-primary';
  if (user?.role === 'ADMIN') roleBadgeClass = 'bg-danger';
  if (user?.role === 'ORGANIZER') roleBadgeClass = 'bg-success';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid container-xl">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-mortarboard-fill text-warning fs-4"></i>
          <span>CampusEventHub</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user ? (
              <>
                {user.role === 'STUDENT' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/student-dashboard">
                        <i className="bi bi-speedometer2 me-1"></i> Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/events">
                        <i className="bi bi-calendar-event me-1"></i> Browse Events
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/my-registrations">
                        <i className="bi bi-ticket-perforated me-1"></i> My Registrations
                      </NavLink>
                    </li>
                  </>
                )}
                {user.role === 'ORGANIZER' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer-dashboard">
                        <i className="bi bi-speedometer2 me-1"></i> Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/events">
                        <i className="bi bi-calendar-event me-1"></i> Events Catalog
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer-event-form">
                        <i className="bi bi-plus-circle me-1"></i> Create Event
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/organizer-participants">
                        <i className="bi bi-people me-1"></i> Attendance
                      </NavLink>
                    </li>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin-dashboard">
                        <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/events">
                        <i className="bi bi-calendar-event me-1"></i> Events
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin-users">
                        <i className="bi bi-people me-1"></i> Users
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin-events">
                        <i className="bi bi-gear me-1"></i> Manage Events
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin-reports">
                        <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports & CSV
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/events">Browse Events</NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-6"></i>
                  <span>{user.fullName}</span>
                  <span className={`badge ${roleBadgeClass} user-badge`}>{user.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <h6 className="dropdown-header">{user.email}</h6>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">Log In</Link>
                <div className="dropdown">
                  <button
                    className="btn btn-primary btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Register
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li>
                      <Link className="dropdown-item d-flex align-items-center py-2" to="/register">
                        <i className="bi bi-mortarboard-fill text-primary fs-5 me-2"></i>
                        <div>
                          <strong className="d-block small">Student Registration</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Browse & participate in events</span>
                        </div>
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center py-2" to="/register-organizer">
                        <i className="bi bi-calendar-check-fill text-success fs-5 me-2"></i>
                        <div>
                          <strong className="d-block small">Organizer Registration</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Host events & manage rosters</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
