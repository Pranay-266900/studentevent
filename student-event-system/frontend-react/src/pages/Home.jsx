import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CategoryBadge, formatDate, formatTime } from '../components/Badges';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events?status=UPCOMING')
      .then(data => {
        // Pick first 3 upcoming events
        setFeaturedEvents(data.slice(0, 3));
      })
      .catch(err => {
        console.error('Failed to load featured events', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-banner text-center">
        <div className="container-xl">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold mb-3">
                <i className="bi bi-stars me-1"></i> Official Campus Portal
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Student Event Registration & Participation System
              </h1>
              <p className="lead mb-4 text-white-50">
                Discover hackathons, cultural festivals, sports tournaments, and technical workshops.
                Register with a single click, track attendance, and manage campus activities seamlessly.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/events" className="btn btn-warning btn-lg px-4 fw-semibold">
                  <i className="bi bi-compass me-2"></i> Explore Events
                </Link>
                {!user ? (
                  <>
                    <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                      <i className="bi bi-mortarboard me-2"></i> Join as Student
                    </Link>
                    <Link to="/register-organizer" className="btn btn-outline-warning btn-lg px-4 text-white">
                      <i className="bi bi-calendar-check me-2"></i> Host as Organizer
                    </Link>
                    <Link to="/login" className="btn btn-light btn-lg px-4 text-primary fw-semibold">
                      <i className="bi bi-box-arrow-in-right me-2"></i> Portal Login
                    </Link>
                  </>
                ) : (
                  <Link
                    to={
                      user.role === 'ADMIN'
                        ? '/admin-dashboard'
                        : user.role === 'ORGANIZER'
                        ? '/organizer-dashboard'
                        : '/student-dashboard'
                    }
                    className="btn btn-outline-light btn-lg px-4"
                  >
                    <i className="bi bi-speedometer2 me-2"></i> Go to My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="py-4 bg-white border-bottom shadow-sm">
        <div className="container-xl">
          <div className="row text-center g-3">
            <div className="col-md-3 col-6 border-end">
              <h3 className="fw-bold text-primary mb-0">100%</h3>
              <small className="text-muted text-uppercase fw-semibold">Real-time Capacity Checks</small>
            </div>
            <div className="col-md-3 col-6 border-end">
              <h3 className="fw-bold text-success mb-0">Role-Based</h3>
              <small className="text-muted text-uppercase fw-semibold">Student / Organizer / Admin</small>
            </div>
            <div className="col-md-3 col-6 border-end">
              <h3 className="fw-bold text-info mb-0">Instant</h3>
              <small className="text-muted text-uppercase fw-semibold">Registration Confirmation</small>
            </div>
            <div className="col-md-3 col-6">
              <h3 className="fw-bold text-warning mb-0">Export</h3>
              <small className="text-muted text-uppercase fw-semibold">CSV Attendance Reports</small>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-5">
        <div className="container-xl">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Campus Events</h2>
              <p className="text-muted mb-0">Don't miss the upcoming workshops, competitions, and seminars</p>
            </div>
            <Link to="/events" className="btn btn-outline-primary btn-sm fw-semibold">
              View All Events <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading upcoming events...</p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="card text-center p-5 border-dashed">
              <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
              <h5>No upcoming events at this moment</h5>
              <p className="text-muted">Stay tuned or check the full catalog!</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredEvents.map(event => (
                <div key={event.id} className="col-lg-4 col-md-6">
                  <div className="card event-card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <CategoryBadge category={event.category} />
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-people me-1"></i>
                          {event.registeredCount} / {event.maxCapacity}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-2">{event.title}</h5>
                      <p className="card-text text-muted small flex-grow-1">
                        {event.description?.length > 130
                          ? `${event.description.substring(0, 130)}...`
                          : event.description}
                      </p>
                      <div className="border-top pt-3 mt-2 text-muted small">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-calendar3 text-primary me-2"></i>
                          <span>{formatDate(event.eventDate)} &bull; {formatTime(event.startTime)}</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <i className="bi bi-geo-alt text-danger me-2"></i>
                          <span className="text-truncate">{event.location}</span>
                        </div>
                        <div className="d-flex gap-2">
                          <Link to={`/events?id=${event.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
                            Details
                          </Link>
                          {user?.role === 'STUDENT' && (
                            <Link to={`/events?id=${event.id}`} className="btn btn-primary btn-sm flex-grow-1">
                              Register Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore By Category */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Explore by Category</h2>
            <p className="text-muted">Find activities that align with your passions and career goals</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Technical', icon: 'bi-cpu', color: 'primary', desc: 'Hackathons, coding challenges, and tech symposiums' },
              { name: 'Cultural', icon: 'bi-music-note-beats', color: 'success', desc: 'Music, dance, drama, and campus festivals' },
              { name: 'Sports', icon: 'bi-trophy', color: 'warning', desc: 'Tournaments, track & field, and intramural games' },
              { name: 'Workshop', icon: 'bi-tools', color: 'info', desc: 'Hands-on practical training and expert bootcamps' },
              { name: 'Seminar', icon: 'bi-mic', color: 'danger', desc: 'Guest lectures, industry keynotes, and research talks' }
            ].map((cat) => (
              <div key={cat.name} className="col-lg col-md-4 col-sm-6">
                <Link
                  to={`/events?category=${cat.name}`}
                  className="text-decoration-none"
                >
                  <div className="card h-100 text-center p-3 hover-shadow border">
                    <div className="mb-3">
                      <div className={`d-inline-flex p-3 rounded-circle bg-${cat.color} bg-opacity-10 text-${cat.color}`}>
                        <i className={`bi ${cat.icon} fs-2`}></i>
                      </div>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{cat.name}</h5>
                    <p className="text-muted small mb-0">{cat.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5">
        <div className="container-xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Seamless 3-Step Participation</h2>
            <p className="text-muted">Designed for student ease and organizer efficiency</p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
                <div className="badge bg-primary fs-5 rounded-circle p-3 mb-3">1</div>
                <h5 className="fw-bold">Discover & Select</h5>
                <p className="text-muted small">
                  Filter events by category, date, and available seats. Review full details, venue, and scheduling.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
                <div className="badge bg-success fs-5 rounded-circle p-3 mb-3">2</div>
                <h5 className="fw-bold">1-Click Register</h5>
                <p className="text-muted small">
                  Instant registration with atomic concurrency guards preventing overbooking. Instant pass generated.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
                <div className="badge bg-warning fs-5 rounded-circle p-3 mb-3 text-dark">3</div>
                <h5 className="fw-bold">Attend & Validate</h5>
                <p className="text-muted small">
                  Show your registration pass at check-in. Organizers mark attendance live, with full CSV reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
