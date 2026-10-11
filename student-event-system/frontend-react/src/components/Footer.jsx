import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer>
      <div className="container-xl">
        <div className="row gy-4">
          <div className="col-md-5">
            <h5 className="text-white fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-mortarboard-fill text-warning"></i> CampusEventHub
            </h5>
            <p className="text-muted small mb-2">
              Student Event Registration & Participation System — built with React, Spring Boot, and MySQL.
            </p>
            <p className="text-muted small mb-0">&copy; 2026 CampusEventHub. All rights reserved.</p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-semibold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small">
              <li className="mb-1"><Link to="/events">Upcoming Events</Link></li>
              <li className="mb-1"><Link to="/login">Login Portal</Link></li>
              <li className="mb-1"><Link to="/register">Student Sign Up</Link></li>
              <li className="mb-1"><Link to="/register-organizer">Organizer Sign Up</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white fw-semibold mb-3">Campus Administration</h6>
            <p className="text-muted small mb-1"><i className="bi bi-geo-alt me-2"></i>Central Campus, Academic Block 4</p>
            <p className="text-muted small mb-0"><i className="bi bi-envelope me-2"></i>admin@college.edu</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
