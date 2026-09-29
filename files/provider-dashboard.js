document.addEventListener("DOMContentLoaded", () => {

    const user = qsRequireLogin("provider");
    if (!user) return;

    const welcomeText = document.getElementById("welcomeText");
    const statsRow = document.getElementById("statsRow");
    const bookingList = document.getElementById("bookingList");
    const emptyState = document.getElementById("emptyState");

    welcomeText.textContent = `Welcome back, ${user.name.split(" ")[0]}! Here are your booking requests.`;

    const STATUS_CLASS = {
        "Pending": "status-pending",
        "Accepted": "status-accepted",
        "In Progress": "status-inprogress",
        "Completed": "status-completed",
        "Rejected": "status-rejected"
    };

    function renderStats(bookings) {

        const counts = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === "Pending").length,
            active: bookings.filter(b =>
                b.status === "Accepted" || b.status === "In Progress"
            ).length,
            completed: bookings.filter(b => b.status === "Completed").length
        };

        statsRow.innerHTML = `
            <div class="stat-card"><strong>${counts.total}</strong><span>Total Requests</span></div>
            <div class="stat-card"><strong>${counts.pending}</strong><span>Pending</span></div>
            <div class="stat-card"><strong>${counts.active}</strong><span>Active Jobs</span></div>
            <div class="stat-card"><strong>${counts.completed}</strong><span>Completed</span></div>
        `;
    }

    function actionsFor(booking) {

        // business rules: rejected can never move forward,
        // completed can never be edited again
        if (booking.status === "Pending") {
            return `
                <button class="btn-accept" data-action="accept" data-booking="${booking.id}">
                    <i class="fa-solid fa-check"></i> Accept
                </button>
                <button class="btn-reject" data-action="reject" data-booking="${booking.id}">
                    <i class="fa-solid fa-xmark"></i> Reject
                </button>
            `;
        }

        if (booking.status === "Accepted") {
            return `
                <button class="btn-progress" data-action="progress" data-booking="${booking.id}">
                    <i class="fa-solid fa-person-digging"></i> Mark In Progress
                </button>
            `;
        }

        if (booking.status === "In Progress") {
            return `
                <button class="btn-progress" data-action="complete" data-booking="${booking.id}">
                    <i class="fa-solid fa-flag-checkered"></i> Mark Completed
                </button>
            `;
        }

        return "";
    }

    function renderBookingCard(booking) {

        const statusClass = STATUS_CLASS[booking.status] || "status-pending";

        return `
            <div class="booking-card" id="card-${booking.id}">
                <div class="booking-main">
                    <span class="booking-id">#${booking.id}</span>
                    <h3>${booking.service} — ${booking.customerName}</h3>
                    <div class="booking-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${booking.date || "N/A"}</span>
                        <span><i class="fa-solid fa-phone"></i> ${booking.customerPhone || "N/A"}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${booking.address || "N/A"}</span>
                    </div>
                    ${booking.details ? `<p style="margin-top:10px;font-size:13px;color:var(--muted);">${booking.details}</p>` : ""}
                    ${booking.review ? `
                        <div class="submitted-review" style="margin-top:10px;">
                            ${"★".repeat(booking.review.rating)}${"☆".repeat(5 - booking.review.rating)}
                            ${booking.review.comment ? `<span>"${booking.review.comment}"</span>` : ""}
                        </div>
                    ` : ""}
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-end;">
                    <span class="status-badge ${statusClass}">${booking.status}</span>
                    <div class="booking-actions">${actionsFor(booking)}</div>
                </div>
            </div>
        `;
    }

    function renderBookings() {

        const bookings = qsGetBookingsForProvider(user.name)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        renderStats(bookings);

        if (bookings.length === 0) {
            bookingList.innerHTML = "";
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        bookingList.innerHTML = bookings.map(renderBookingCard).join("");

        attachActionHandlers();
    }

    function attachActionHandlers() {

        bookingList.querySelectorAll("[data-action]").forEach(btn => {

            btn.addEventListener("click", () => {

                const bookingId = btn.dataset.booking;
                const action = btn.dataset.action;

                const statusMap = {
                    accept: "Accepted",
                    reject: "Rejected",
                    progress: "In Progress",
                    complete: "Completed"
                };

                qsUpdateBooking(bookingId, { status: statusMap[action] });

                renderBookings();
            });
        });
    }

    renderBookings();

});
