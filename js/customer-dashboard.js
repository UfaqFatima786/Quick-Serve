document.addEventListener("DOMContentLoaded", async () => {

    const user = await qsRequireLogin("customer");
    if (!user) return;

    const welcomeText = document.getElementById("welcomeText");
    const statsRow = document.getElementById("statsRow");
    const bookingList = document.getElementById("bookingList");
    const emptyState = document.getElementById("emptyState");

    welcomeText.textContent = `Welcome back, ${user.full_name.split(" ")[0]}!`;

    const STATUS_CLASS = {
        pending: "status-pending",
        accepted: "status-accepted",
        in_progress: "status-inprogress",
        completed: "status-completed",
        rejected: "status-rejected"
    };

    const STATUS_LABEL = {
        pending: "Pending",
        accepted: "Accepted",
        in_progress: "In Progress",
        completed: "Completed",
        rejected: "Rejected"
    };

    let bookings = [];

    async function loadBookings() {

        bookingList.innerHTML = `<p style="padding:30px; text-align:center; color:var(--muted,#888);">Loading your bookings...</p>`;

        const { data, error } = await supabaseClient
            .from("bookings")
            .select(`
                id,
                booking_id,
                booking_date,
                booking_time,
                location,
                description,
                status,
                provider_id,
                providers ( service_name, price, profiles ( full_name ) ),
                reviews ( id, rating, review )
            `)
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            bookingList.innerHTML = `<p style="padding:30px; text-align:center; color:#ff5c5c;">Could not load bookings: ${error.message}</p>`;
            return;
        }

        bookings = data || [];
        renderBookings();
    }

    function renderStats() {
        const counts = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === "pending").length,
            active: bookings.filter(b => b.status === "accepted" || b.status === "in_progress").length,
            completed: bookings.filter(b => b.status === "completed").length
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
        const statusLabel = STATUS_LABEL[booking.status] || booking.status;
        const providerName = booking.providers?.profiles?.full_name || "Provider";
        const serviceName = booking.providers?.service_name || "Service";
        const price = booking.providers?.price;
        const existingReview = Array.isArray(booking.reviews) ? booking.reviews[0] : booking.reviews;

        let reviewSection = "";

        if (booking.status === "completed") {

            if (existingReview) {
                reviewSection = `
                    <div class="review-box">
                        <div class="submitted-review">
                            ${"★".repeat(existingReview.rating)}${"☆".repeat(5 - existingReview.rating)}
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
                        <button class="btn-review" data-booking="${booking.id}" data-provider="${booking.provider_id}" data-action="submit-review">
                            <i class="fa-solid fa-paper-plane"></i> Submit Review
                        </button>
                    </div>
                `;
            }
        }

        return `
            <div class="booking-card" id="card-${booking.id}">
                <div class="booking-main">
                    <span class="booking-id">#${booking.booking_id}</span>
                    <h3>${serviceName} — ${providerName}</h3>
                    <div class="booking-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${booking.booking_date || "N/A"} ${booking.booking_time || ""}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${booking.location || "N/A"}</span>
                        ${price ? `<span><i class="fa-solid fa-tag"></i> PKR ${Number(price).toLocaleString()}</span>` : ""}
                    </div>
                    ${reviewSection}
                </div>
                <div>
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </div>
            </div>
        `;
    }

    function renderBookings() {

        renderStats();

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
                        s.classList.toggle("active", parseInt(s.dataset.value, 10) <= selected);
                    });
                    picker.dataset.selected = selected;
                });
            });
        });

        document.querySelectorAll('[data-action="submit-review"]').forEach(btn => {
            btn.addEventListener("click", async () => {

                const bookingId = btn.dataset.booking;
                const providerId = btn.dataset.provider;
                const picker = document.getElementById(`stars-${bookingId}`);
                const rating = parseInt(picker.dataset.selected || "0", 10);
                const textEl = document.getElementById(`reviewText-${bookingId}`);

                if (!rating) {
                    alert("Please select a star rating before submitting.");
                    return;
                }

                btn.disabled = true;
                btn.textContent = "Submitting...";

                const { error } = await supabaseClient
                    .from("reviews")
                    .insert({
                        booking_id: bookingId,
                        customer_id: user.id,
                        provider_id: providerId,
                        rating: rating,
                        review: textEl.value.trim() || null
                    });

                if (error) {
                    alert("Could not submit review: " + error.message);
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Review`;
                    return;
                }

                // update the provider's average rating
                const { data: providerReviews } = await supabaseClient
                    .from("reviews")
                    .select("rating")
                    .eq("provider_id", providerId);

                if (providerReviews && providerReviews.length > 0) {
                    const avg = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
                    await supabaseClient
                        .from("providers")
                        .update({ rating: avg.toFixed(1) })
                        .eq("id", providerId);
                }

                await loadBookings();
            });
        });
    }

    await loadBookings();
});
