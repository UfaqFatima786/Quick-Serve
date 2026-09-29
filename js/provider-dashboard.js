document.addEventListener("DOMContentLoaded", async () => {

    const user = await qsRequireLogin("provider");
    if (!user) return;

    const welcomeText = document.getElementById("welcomeText");
    const statsRow = document.getElementById("statsRow");
    const bookingList = document.getElementById("bookingList");
    const emptyState = document.getElementById("emptyState");

    welcomeText.textContent = `Welcome back, ${user.full_name.split(" ")[0]}! Here are your booking requests.`;

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

    /* =========================================
       CHECK PROVIDER LISTING EXISTS
    ========================================= */

    const { data: providerRow, error: providerError } = await supabaseClient
        .from("providers")
        .select("id, service_name")
        .eq("user_id", user.id)
        .maybeSingle();

    if (providerError) {
        console.error(providerError);
    }

    if (!providerRow) {
        bookingList.innerHTML = "";
        statsRow.innerHTML = "";
        emptyState.style.display = "none";
        document.querySelector(".dashboard-container").insertAdjacentHTML("beforeend", `
            <div class="empty-state" style="display:block;">
                <i class="fa-solid fa-circle-info"></i>
                <p>You haven't set up your listing yet.</p>
                <a href="provider-setup.html" class="nav-cta" style="margin-top:12px; display:inline-flex;">
                    <i class="fa-solid fa-pen-to-square"></i> Create My Listing
                </a>
            </div>
        `);
        return;
    }

    let bookings = [];

    async function loadBookings() {

        bookingList.innerHTML = `<p style="padding:30px; text-align:center; color:var(--muted,#888);">Loading requests...</p>`;

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
                profiles ( full_name, phone ),
                reviews ( rating, review )
            `)
            .eq("provider_id", providerRow.id)
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
            <div class="stat-card"><strong>${counts.total}</strong><span>Total Requests</span></div>
            <div class="stat-card"><strong>${counts.pending}</strong><span>Pending</span></div>
            <div class="stat-card"><strong>${counts.active}</strong><span>Active Jobs</span></div>
            <div class="stat-card"><strong>${counts.completed}</strong><span>Completed</span></div>
        `;
    }

    function actionsFor(booking) {

        if (booking.status === "pending") {
            return `
                <button class="btn-accept" data-action="accepted" data-booking="${booking.id}">
                    <i class="fa-solid fa-check"></i> Accept
                </button>
                <button class="btn-reject" data-action="rejected" data-booking="${booking.id}">
                    <i class="fa-solid fa-xmark"></i> Reject
                </button>
            `;
        }

        if (booking.status === "accepted") {
            return `
                <button class="btn-progress" data-action="in_progress" data-booking="${booking.id}">
                    <i class="fa-solid fa-person-digging"></i> Mark In Progress
                </button>
            `;
        }

        if (booking.status === "in_progress") {
            return `
                <button class="btn-progress" data-action="completed" data-booking="${booking.id}">
                    <i class="fa-solid fa-flag-checkered"></i> Mark Completed
                </button>
            `;
        }

        return "";
    }

    function renderBookingCard(booking) {

        const statusClass = STATUS_CLASS[booking.status] || "status-pending";
        const statusLabel = STATUS_LABEL[booking.status] || booking.status;
        const customerName = booking.profiles?.full_name || "Customer";
        const customerPhone = booking.profiles?.phone || "N/A";
        const review = Array.isArray(booking.reviews) ? booking.reviews[0] : booking.reviews;

        return `
            <div class="booking-card" id="card-${booking.id}">
                <div class="booking-main">
                    <span class="booking-id">#${booking.booking_id}</span>
                    <h3>${providerRow.service_name} — ${customerName}</h3>
                    <div class="booking-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${booking.booking_date || "N/A"} ${booking.booking_time || ""}</span>
                        <span><i class="fa-solid fa-phone"></i> ${customerPhone}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${booking.location || "N/A"}</span>
                    </div>
                    ${booking.description ? `<p style="margin-top:10px;font-size:13px;color:var(--muted);">${booking.description}</p>` : ""}
                    ${review ? `
                        <div class="submitted-review" style="margin-top:10px;">
                            ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
                            ${review.review ? `<span>"${review.review}"</span>` : ""}
                        </div>
                    ` : ""}
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-end;">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                    <div class="booking-actions">${actionsFor(booking)}</div>
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
        attachActionHandlers();
    }

    function attachActionHandlers() {

        bookingList.querySelectorAll("[data-action]").forEach(btn => {

            btn.addEventListener("click", async () => {

                const bookingId = btn.dataset.booking;
                const newStatus = btn.dataset.action;

                btn.disabled = true;

                const { error } = await supabaseClient
                    .from("bookings")
                    .update({ status: newStatus })
                    .eq("id", bookingId);

                if (error) {
                    alert("Could not update booking: " + error.message);
                    btn.disabled = false;
                    return;
                }

                await loadBookings();
            });
        });
    }

    await loadBookings();
});
