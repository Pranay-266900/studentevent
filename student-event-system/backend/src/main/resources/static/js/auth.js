// =====================================================================
// Authentication and Session State Management
// =====================================================================

const Auth = (() => {
    const USER_KEY = 'college_event_user';

    const getUser = () => {
        try {
            const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    };

    const setUser = (user, remember = true) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(user));
    };

    const clearUser = () => {
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(USER_KEY);
    };

    const isLoggedIn = () => {
        return getUser() !== null;
    };

    const hasRole = (role) => {
        const user = getUser();
        return user && user.role === role;
    };

    const hasAnyRole = (...roles) => {
        const user = getUser();
        return user && roles.includes(user.role);
    };

    const fetchCurrentUser = async () => {
        try {
            const user = await API.get('/auth/me');
            if (user) {
                setUser(user);
                return user;
            }
        } catch (err) {
            clearUser();
            return null;
        }
    };

    const requireAuth = (allowedRoles = []) => {
        const user = getUser();
        if (!user) {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            return false;
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            window.location.href = 'access-denied.html';
            return false;
        }
        return true;
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (ignored) {}
        clearUser();
        window.location.href = 'login.html';
    };

    // Dynamically render role-based navigation bar
    const renderNavbar = (activePage = '') => {
        const navContainer = document.getElementById('navbar-container');
        if (!navContainer) return;

        const user = getUser();

        let roleLinks = '';
        if (user) {
            if (user.role === 'STUDENT') {
                roleLinks = `
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'student-dashboard' ? 'active' : ''}" href="student-dashboard.html">
                            <i class="bi bi-speedometer2 me-1"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'events' ? 'active' : ''}" href="events.html">
                            <i class="bi bi-calendar-event me-1"></i> Browse Events
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'my-registrations' ? 'active' : ''}" href="my-registrations.html">
                            <i class="bi bi-ticket-perforated me-1"></i> My Registrations
                        </a>
                    </li>
                `;
            } else if (user.role === 'ORGANIZER') {
                roleLinks = `
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'organizer-dashboard' ? 'active' : ''}" href="organizer-dashboard.html">
                            <i class="bi bi-speedometer2 me-1"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'events' ? 'active' : ''}" href="events.html">
                            <i class="bi bi-calendar-event me-1"></i> Events Catalog
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'organizer-event-form' ? 'active' : ''}" href="organizer-event-form.html">
                            <i class="bi bi-plus-circle me-1"></i> Create Event
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'organizer-participants' ? 'active' : ''}" href="organizer-participants.html">
                            <i class="bi bi-people me-1"></i> Attendance
                        </a>
                    </li>
                `;
            } else if (user.role === 'ADMIN') {
                roleLinks = `
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'admin-dashboard' ? 'active' : ''}" href="admin-dashboard.html">
                            <i class="bi bi-speedometer2 me-1"></i> Admin Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'events' ? 'active' : ''}" href="events.html">
                            <i class="bi bi-calendar-event me-1"></i> Events
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'admin-users' ? 'active' : ''}" href="admin-users.html">
                            <i class="bi bi-people me-1"></i> Users
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'admin-events' ? 'active' : ''}" href="admin-events.html">
                            <i class="bi bi-gear me-1"></i> Manage Events
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'admin-reports' ? 'active' : ''}" href="admin-reports.html">
                            <i class="bi bi-file-earmark-bar-graph me-1"></i> Reports & CSV
                        </a>
                    </li>
                `;
            }
        } else {
            roleLinks = `
                <li class="nav-item">
                    <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${activePage === 'events' ? 'active' : ''}" href="events.html">Browse Events</a>
                </li>
            `;
        }

        let userMenu = '';
        if (user) {
            let roleBadgeClass = 'bg-primary';
            if (user.role === 'ADMIN') roleBadgeClass = 'bg-danger';
            if (user.role === 'ORGANIZER') roleBadgeClass = 'bg-success';

            userMenu = `
                <div class="dropdown">
                    <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle fs-6"></i>
                        <span>${user.fullName}</span>
                        <span class="badge ${roleBadgeClass} user-badge">${user.role}</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow">
                        <li>
                            <h6 class="dropdown-header">${user.email}</h6>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item" href="profile.html">
                                <i class="bi bi-person me-2"></i> My Profile
                            </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <button class="dropdown-item text-danger" onclick="Auth.logout()">
                                <i class="bi bi-box-arrow-right me-2"></i> Log Out
                            </button>
                        </li>
                    </ul>
                </div>
            `;
        } else {
            userMenu = `
                <div class="d-flex gap-2">
                    <a href="login.html" class="btn btn-outline-light btn-sm">Log In</a>
                    <a href="register.html" class="btn btn-primary btn-sm">Register</a>
                </div>
            `;
        }

        navContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
                <div class="container-fluid container-xl">
                    <a class="navbar-brand" href="index.html">
                        <i class="bi bi-mortarboard-fill text-warning fs-4"></i>
                        <span>CampusEventHub</span>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            ${roleLinks}
                        </ul>
                        <div class="d-flex align-items-center">
                            ${userMenu}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    };

    return {
        getUser,
        setUser,
        clearUser,
        isLoggedIn,
        hasRole,
        hasAnyRole,
        fetchCurrentUser,
        requireAuth,
        logout,
        renderNavbar
    };
})();
