document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const providerId = params.get("id");

    const profileAvatar = document.getElementById("profileAvatar");
    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");
    const profileService = document.getElementById("profileService");
    const profileRating = document.getElementById("profileRating");
    const profileReviews = document.getElementById("profileReviews");
    const profileLocation = document.getElementById("profileLocation");
    const profileExperience = document.getElementById("profileExperience");
    const profileDescription = document.getElementById("profileDescription");
    const profilePrice = document.getElementById("profilePrice");
    const aboutProvider = document.getElementById("aboutProvider");
    const skillsList = document.getElementById("skillsList");

    function initials(name) {
        if (!name) return "?";
        return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
    }

    function showNotFound() {
        profileName.textContent = "Provider Not Found";
        profileRole.textContent = "This provider profile does not exist.";
        profileService.textContent = "QuickServe";
        profileDescription.textContent = "Please go back and select a valid provider.";
        profileAvatar.textContent = "?";
        const bookBtn = document.getElementById("bookServiceBtn");
        if (bookBtn) bookBtn.style.display = "none";
    }

    if (!providerId) {
        showNotFound();
        return;
    }

    /* =========================================
       FETCH PROVIDER FROM SUPABASE
    ========================================= */

    const { data: provider, error } = await supabaseClient
        .from("providers")
        .select(`
            id,
            user_id,
            service_id,
            service_name,
            location,
            experience,
            price,
            rating,
            description,
            image_url,
            profiles ( full_name )
        `)
        .eq("id", providerId)
        .single();

    if (error || !provider) {
        console.error(error);
        showNotFound();
        return;
    }

    // Reviews (count + are already fetched via provider.rating, but get count)
    const { count: reviewCount } = await supabaseClient
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("provider_id", providerId);

    const providerName = provider.profiles?.full_name || "Provider";

    /* =========================================
       FILL PROFILE
    ========================================= */

    if (provider.image_url) {
        profileAvatar.style.backgroundImage = `url('${provider.image_url}')`;
        profileAvatar.style.backgroundSize = "cover";
        profileAvatar.style.backgroundPosition = "center";
        profileAvatar.textContent = "";
    } else {
        profileAvatar.textContent = initials(providerName);
    }

    profileName.textContent = providerName;
    profileRole.textContent = `${provider.service_name} Provider`;
    profileService.textContent = provider.service_name;
    profileRating.textContent = provider.rating ? Number(provider.rating).toFixed(1) : "New";
    profileReviews.textContent = `(${reviewCount || 0} reviews)`;
    profileLocation.textContent = provider.location;
    profileExperience.textContent = `${provider.experience || 0} Years`;
    profileDescription.textContent = provider.description || "Professional service provider.";
    profilePrice.textContent = `PKR ${Number(provider.price || 0).toLocaleString()}`;
    aboutProvider.textContent = provider.description || "Professional service provider.";

    document.title = `QuickServe | ${providerName}`;

    /* skills — we only store one service per provider, show it as a tag */
    if (skillsList) {
        skillsList.innerHTML = `
            <span class="skill-tag">
                <i class="fa-solid fa-check"></i>
                ${provider.service_name}
            </span>
        `;
    }

    /* =========================================
       BOOKING MODAL
    ========================================= */

    const bookingModal = document.getElementById("bookingModal");
    const bookServiceBtn = document.getElementById("bookServiceBtn");
    const closeModal = document.getElementById("closeModal");
    const bookingProviderName = document.getElementById("bookingProviderName");
    const bookingForm = document.getElementById("bookingForm");
    const submitBtn = bookingForm ? bookingForm.querySelector(".submit-booking") : null;

    if (bookingProviderName) bookingProviderName.textContent = providerName;

    if (bookServiceBtn) {
        bookServiceBtn.addEventListener("click", async () => {

            const currentUser = await qsGetCurrentUser();

            if (!currentUser) {
                alert("Please login as a customer first to book a service.");
                window.location.href = "login.html";
                return;
            }

            if (currentUser.role === "provider") {
                alert("Provider accounts cannot book services. Please login as a customer.");
                return;
            }

            const nameField = document.getElementById("customerName");
            if (nameField && !nameField.value) nameField.value = currentUser.full_name;

            const phoneField = document.getElementById("customerPhone");
            if (phoneField && !phoneField.value) phoneField.value = currentUser.phone || "";

            bookingModal.classList.add("active");
        });
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => bookingModal.classList.remove("active"));
    }

    if (bookingModal) {
        bookingModal.addEventListener("click", event => {
            if (event.target === bookingModal) bookingModal.classList.remove("active");
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", async event => {

            event.preventDefault();

            const currentUser = await qsGetCurrentUser();

            if (!currentUser) {
                alert("Your session expired. Please login again.");
                window.location.href = "login.html";
                return;
            }

            const addressValue = document.getElementById("customerAddress").value.trim();
            const dateValue = document.getElementById("bookingDate").value;
            const timeValue = document.getElementById("bookingTime").value;
            const detailsValue = document.getElementById("bookingDetails").value.trim();

            if (!addressValue || !dateValue || !timeValue) {
                alert("Please fill in all required fields before submitting.");
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
            }

            const { error: insertError } = await supabaseClient
                .from("bookings")
                .insert({
                    booking_id: qsGenerateBookingId(),
                    customer_id: currentUser.id,
                    provider_id: provider.id,
                    service_id: provider.service_id,
                    booking_date: dateValue,
                    booking_time: timeValue,
                    location: addressValue,
                    description: detailsValue,
                    status: "pending"
                });

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Booking Request`;
            }

            if (insertError) {
                console.error(insertError);
                alert("Could not submit booking: " + insertError.message);
                return;
            }

            bookingForm.reset();
            bookingModal.classList.remove("active");
            window.location.href = "customer-dashboard.html";
        });
    }

    /* =========================================
       CONTACT PROVIDER
    ========================================= */

    const contactBtn = document.getElementById("contactBtn");
    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            alert(`You selected ${providerName}. Contact feature can be added later (e.g. WhatsApp link).`);
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
});
