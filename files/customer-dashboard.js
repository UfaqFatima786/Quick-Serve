document.addEventListener("DOMContentLoaded", () => {

    const user = qsRequireLogin("customer");
    if (!user) return;

    const welcomeText = document.getElementById("welcomeText");
    const statsRow = document.getElementById("statsRow");
    const bookingList = document.getElementById("bookingList");
    const emptyState = document.getElementById("emptyState");

    welcomeText.textContent = `Welcome back, ${user.name.split(" ")[0]}!`;

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
            <div class="stat-card"><strong>${counts.total}</strong><span>Total Bookings</span></div>
            <div class="stat-card"><strong>${counts.pending}</strong><span>Pending</span></div>
            <div class="stat-card"><strong>${counts.active}</strong><span>Active</span></div>
            <div class="stat-card"><strong>${counts.completed}</strong><span>Completed</span></div>
        `;
    }

    function starPickerHTML(bookingId) {
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fa-solid fa-star" data-value="${i}" data-booking="${bookingId}"></i>`;
        }
        return stars;
    }

    function renderBookingCard(booking) {

        const statusClass = STATUS_CLASS[booking.status] || "status-pending";

        let reviewSection = "";

        if (booking.status === "Completed") {

            if (booking.review) {
                reviewSection = `
                    <div class="review-box">
                        <div class="submitted-review">
                            ${"★".repeat(booking.review.rating)}${"☆".repeat(5 - booking.review.rating)}
                            <span>Thanks for your review!</span>
                        </div>
                    </div>
                `;
            } else {
                reviewSection = `
                    <div class="review-box">
                        <label style="font-size:13px;color:var(--muted);display:block;margin-bottom:8px;">
                            Rate this service
                        </label>
                        <div class="star-picker" id="stars-${booking.id}">
                            ${starPickerHTML(booking.id)}
                        </div>
                        <textarea placeholder="Write a short review (optional)" id="reviewText-${booking.id}"></textarea>
                        <button class="btn-review" data-booking="${booking.id}" data-action="submit-review">
                            <i class="fa-solid fa-paper-plane"></i> Submit Review
                        </button>
                    </div>
                `;
            }
        }

        return `
            <div class="booking-card" id="card-${booking.id}">
                <div class="booking-main">
                    <span class="booking-id">#${booking.id}</span>
                    <h3>${booking.service} — ${booking.providerName}</h3>
                    <div class="booking-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${booking.date || "N/A"}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${booking.address || "N/A"}</span>
                        <span><i class="fa-solid fa-tag"></i> ${booking.price || ""}</span>
                    </div>
                    ${reviewSection}
                </div>
                <div>
                    <span class="status-badge ${statusClass}">${booking.status}</span>
                </div>
            </div>
        `;
    }

    function renderBookings() {

        const bookings = qsGetBookingsForCustomer(user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        renderStats(bookings);

        if (bookings.length === 0) {
            bookingList.innerHTML = "";
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        bookingList.innerHTML = bookings.map(renderBookingCard).join("");

        attachReviewHandlers();
    }

    function attachReviewHandlers() {

        document.querySelectorAll(".star-picker").forEach(picker => {

            let selected = 0;
            const stars = picker.querySelectorAll("i");

            stars.forEach(star => {
                star.addEventListener("click", () => {
                    selected = parseInt(star.dataset.value, 10);
                    stars.forEach(s => {
                        s.classList.toggle(
                            "active",
                            parseInt(s.dataset.value, 10) <= selected
                        );
                    });
                    picker.dataset.selected = selected;
                });
            });
        });

        document.querySelectorAll('[data-action="submit-review"]').forEach(btn => {

            btn.addEventListener("click", () => {

                const bookingId = btn.dataset.booking;
                const picker = document.getElementById(`stars-${bookingId}`);
                const rating = parseInt(picker.dataset.selected || "0", 10);
                const textEl = document.getElementById(`reviewText-${bookingId}`);

                if (!rating) {
                    alert("Please select a star rating before submitting.");
                    return;
                }

                qsUpdateBooking(bookingId, {
                    review: {
                        rating,
                        comment: textEl.value.trim(),
                        createdAt: new Date().toISOString()
                    }
                });

                renderBookings();
            });
        });
    }

    renderBookings();

});
