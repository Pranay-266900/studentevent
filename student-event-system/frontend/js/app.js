// =====================================================================
// UI Helpers, Badges, Formatters, Modals, and Toast Notifications
// =====================================================================

const App = (() => {

    // Toast Notifications
    const showToast = (message, type = 'success') => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'bi-check-circle-fill text-success',
            danger: 'bi-exclamation-triangle-fill text-danger',
            warning: 'bi-exclamation-circle-fill text-warning',
            info: 'bi-info-circle-fill text-info'
        };

        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        toast.innerHTML = `
            <i class="bi ${icons[type] || icons.info} fs-5"></i>
            <div class="flex-grow-1" style="font-size: 0.9rem; font-weight: 500;">${message}</div>
            <button type="button" class="btn-close btn-close-sm" style="font-size: 0.75rem;" onclick="this.parentElement.remove()"></button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 400);
            }
        }, 4500);
    };

    // Generic Confirmation Modal
    const showConfirmModal = (title, message, confirmText = 'Confirm', onConfirm = () => {}, isDanger = false) => {
        let modalEl = document.getElementById('global-confirm-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'global-confirm-modal';
            modalEl.className = 'modal fade';
            modalEl.tabIndex = -1;
            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="modal-message"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn" id="modal-confirm-btn"></button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalEl);
        }

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;

        const confirmBtn = document.getElementById('modal-confirm-btn');
        confirmBtn.textContent = confirmText;
        confirmBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

        const bsModal = new bootstrap.Modal(modalEl);

        confirmBtn.onclick = async () => {
            bsModal.hide();
            await onConfirm();
        };

        bsModal.show();
    };

    // Format Date: e.g. "Nov 15, 2026"
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format Time: e.g. "09:00 AM"
    const formatTime = (timeStr) => {
        if (!timeStr) return 'N/A';
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || '00';
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    // Format DateTime: e.g. "Oct 10, 2026 14:30"
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return 'N/A';
        const d = new Date(dateTimeStr);
        return d.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Category Badges
    const getCategoryBadge = (category) => {
        const cat = (category || '').toLowerCase();
        let cls = 'badge-cat-other';
        if (cat === 'technical') cls = 'badge-cat-technical';
        else if (cat === 'cultural') cls = 'badge-cat-cultural';
        else if (cat === 'sports') cls = 'badge-cat-sports';
        else if (cat === 'workshop') cls = 'badge-cat-workshop';
        else if (cat === 'seminar') cls = 'badge-cat-seminar';
        return `<span class="badge badge-category ${cls}">${category || 'General'}</span>`;
    };

    // Event Status Badges
    const getStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        let cls = 'badge-status-upcoming';
        if (s === 'ONGOING') cls = 'badge-status-ongoing';
        else if (s === 'COMPLETED') cls = 'badge-status-completed';
        else if (s === 'CANCELLED') cls = 'badge-status-cancelled';
        return `<span class="badge ${cls}">${s}</span>`;
    };

    // Attendance Badges
    const getAttendanceBadge = (status) => {
        const s = (status || '').toUpperCase();
        let cls = 'badge-attendance-pending';
        let icon = 'bi-hourglass-split';
        if (s === 'PRESENT') {
            cls = 'badge-attendance-present';
            icon = 'bi-check2-circle';
        } else if (s === 'ABSENT') {
            cls = 'badge-attendance-absent';
            icon = 'bi-x-circle';
        }
        return `<span class="badge ${cls}"><i class="bi ${icon} me-1"></i>${s}</span>`;
    };

    // Registration Status Badges
    const getRegistrationStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'REGISTERED') {
            return `<span class="badge bg-success"><i class="bi bi-check-lg me-1"></i>Registered</span>`;
        }
        return `<span class="badge bg-secondary"><i class="bi bi-slash-circle me-1"></i>Cancelled</span>`;
    };

    // Loading indicator
    const showLoading = (elementId, message = 'Loading data...') => {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-3 mb-0" style="font-weight: 500;">${message}</p>
                </div>
            `;
        }
    };

    // Empty state renderer
    const renderEmptyState = (title, message, icon = 'bi-inbox', actionHtml = '') => {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="bi ${icon}"></i>
                </div>
                <h4 class="empty-state-title">${title}</h4>
                <p class="empty-state-desc">${message}</p>
                ${actionHtml}
            </div>
        `;
    };

    return {
        showToast,
        showConfirmModal,
        formatDate,
        formatTime,
        formatDateTime,
        getCategoryBadge,
        getStatusBadge,
        getAttendanceBadge,
        getRegistrationStatusBadge,
        showLoading,
        renderEmptyState
    };
})();
