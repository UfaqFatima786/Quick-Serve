document.addEventListener("DOMContentLoaded", async () => {

    const providersGrid = document.getElementById("providersGrid");
    const providerSearch = document.getElementById("providerSearch");
    const locationFilter = document.getElementById("locationFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const resetFilters = document.getElementById("resetFilters");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    const breadcrumbService = document.getElementById("breadcrumbService");
    const serviceBadge = document.getElementById("serviceBadge");
    const serviceTitle = document.getElementById("serviceTitle");
    const headingService = document.getElementById("headingService");

    /* =========================================
       GET SERVICE FROM URL (?service=Cleaning)
    ========================================= */

    const params = new URLSearchParams(window.location.search);
    let selectedService = params.get("service");

    if (selectedService) {
        selectedService = decodeURIComponent(selectedService).trim();
    }

    function updateServiceUI() {
        const label = selectedService || "Professionals";

        if (breadcrumbService) breadcrumbService.textContent = label;
        if (serviceBadge) serviceBadge.textContent = selectedService ? label : "All Services";
        if (serviceTitle) serviceTitle.textContent = selectedService ? label : "professional";
        if (headingService) headingService.textContent = label;

        document.title = selectedService
            ? `QuickServe | ${label} Providers`
            : "QuickServe | Find Providers";
    }

    /* =========================================
       FETCH PROVIDERS FROM SUPABASE
    ========================================= */

    let allProviders = [];

    async function loadProviders() {

        providersGrid.innerHTML = `<p style="padding:40px; text-align:center; color:var(--muted, #888);">Loading providers...</p>`;

        const { data, error } = await supabaseClient
            .from("providers")
            .select(`
                id,
                service_name,
                location,
                experience,
                price,
                rating,
                description,
                image_url,
                profiles ( full_name )
            `)
            .order("rating", { ascending: false });

        if (error) {
            console.error(error);
            providersGrid.innerHTML = `<p style="padding:40px; text-align:center; color:#ff5c5c;">Could not load providers: ${error.message}</p>`;
            return;
        }

        allProviders = data || [];
        renderProviders();
    }

    function initials(name) {
        if (!name) return "?";
        return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
    }

    function providerCardHTML(p) {

        const name = p.profiles?.full_name || "Provider";
        const ratingValue = p.rating ? Number(p.rating).toFixed(1) : "New";
        const avatarStyle = p.image_url
            ? `background-image:url('${p.image_url}'); background-size:cover; background-position:center;`
            : "";

        return `
            <article
                class="provider-card"
                data-name="${name.toLowerCase()}"
                data-service="${(p.service_name || "").toLowerCase()}"
                data-location="${(p.location || "").toLowerCase()}"
                data-rating="${p.rating || 0}"
                data-id="${p.id}">

                <div class="provider-top">
                    <div class="provider-avatar" style="${avatarStyle}">
                        ${p.image_url ? "" : initials(name)}
                    </div>
                    <span class="verified">
                        <i class="fa-solid fa-circle-check"></i>
                        Verified
                    </span>
                </div>

                <div class="provider-info">
                    <h3>${name}</h3>
                    <span class="provider-role">${p.service_name || ""}</span>

                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <strong>${ratingValue}</strong>
                    </div>

                    <div class="provider-meta">
                        <span><i class="fa-solid fa-location-dot"></i> ${p.location || "N/A"}</span>
                        <span><i class="fa-solid fa-briefcase"></i> ${p.experience || 0} Years</span>
                    </div>

                    <div class="provider-bottom">
                        <div class="price">
                            <small>Starting from</small>
                            <strong>PKR ${Number(p.price || 0).toLocaleString()}</strong>
                        </div>

                        <button class="profile-btn" data-provider-id="${p.id}">
                            View Profile
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    /* =========================================
       FILTER + RENDER
    ========================================= */

    function renderProviders() {

        const search = providerSearch ? providerSearch.value.trim().toLowerCase() : "";
        const location = locationFilter ? locationFilter.value.toLowerCase() : "all";
        const rating = ratingFilter ? ratingFilter.value : "all";

        const filtered = allProviders.filter(p => {

            const name = (p.profiles?.full_name || "").toLowerCase();
            const service = (p.service_name || "").toLowerCase();
            const loc = (p.location || "").toLowerCase();
            const ratingValue = parseFloat(p.rating || 0);

            const serviceMatch = selectedService
                ? service === selectedService.toLowerCase()
                : true;

            const searchMatch = search
                ? name.includes(search) || service.includes(search)
                : true;

            const locationMatch = location !== "all" ? loc === location : true;
            const ratingMatch = rating !== "all" ? ratingValue >= parseFloat(rating) : true;

            return serviceMatch && searchMatch && locationMatch && ratingMatch;
        });

        if (resultsCount) resultsCount.textContent = filtered.length;

        if (filtered.length === 0) {
            providersGrid.innerHTML = "";
            if (noResults) noResults.style.display = "block";
            return;
        }

        if (noResults) noResults.style.display = "none";

        providersGrid.innerHTML = filtered.map(providerCardHTML).join("");

        // wire up "View Profile" buttons
        providersGrid.querySelectorAll(".profile-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.providerId;
                window.location.href = `providers-profile.html?id=${encodeURIComponent(id)}`;
            });
        });
    }

    /* =========================================
       FILTER EVENTS
    ========================================= */

    if (providerSearch) providerSearch.addEventListener("input", renderProviders);
    if (locationFilter) locationFilter.addEventListener("change", renderProviders);
    if (ratingFilter) ratingFilter.addEventListener("change", renderProviders);

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (providerSearch) providerSearch.value = "";
            if (locationFilter) locationFilter.value = "all";
            if (ratingFilter) ratingFilter.value = "all";
            selectedService = null;
            updateServiceUI();
            renderProviders();
        });
    }

    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => navLinks.classList.toggle("show"));
    }

    /* =========================================
       INIT
    ========================================= */

    updateServiceUI();
    await loadProviders();
});
