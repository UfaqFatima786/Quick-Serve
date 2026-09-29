document.addEventListener("DOMContentLoaded", async () => {

    const searchInput = document.getElementById("serviceSearch");
    const servicesGrid = document.getElementById("servicesGrid");
    const serviceCount = document.getElementById("serviceCount");
    const noResults = document.getElementById("noResults");

    let services = [];
    function getServiceIcon(serviceName) {
        const name = serviceName.toLowerCase();
        if (name.includes("clean")) {
            return "fa-broom";
        }
        if (name.includes("plumb")) {
            return "fa-faucet-drip";
        }
        if (name.includes("electric")) {
            return "fa-bolt";
        }
        if (name.includes("ac")) {
            return "fa-snowflake";
        }
        if (name.includes("appliance")) {
            return "fa-plug";
        }
        if (
            name.includes("beauty") ||
            name.includes("salon")
        ) {
            return "fa-scissors";
        }

        if (name.includes("paint")) {
            return "fa-paint-roller";
        }

        if (name.includes("mov")) {
            return "fa-truck-moving";
        }

        if (
            name.includes("auto") ||
            name.includes("car")
        ) {
            return "fa-car";
        }

        if (
            name.includes("computer") ||
            name.includes("mobile") ||
            name.includes("repair")
        ) {
            return "fa-laptop";
        }

        if (
            name.includes("tutor") ||
            name.includes("education")
        ) {
            return "fa-graduation-cap";
        }

        return "fa-ellipsis";
    }


    // ==========================================
    // LOAD SERVICES FROM SUPABASE
    // ==========================================

    async function loadServices() {

        try {

            if (typeof supabaseClient === "undefined") {

                console.error(
                    "supabaseClient is not defined. Check supabase.js"
                );

                return;
            }

            const {
                data,
                error
            } = await supabaseClient
                .from("services")
                .select("*")
                .order("name", {
                    ascending: true
                });


            if (error) {

                console.error(
                    "Error loading services:",
                    error
                );

                return;
            }


            services = data || [];

            renderServices(services);

        } catch (error) {

            console.error(
                "Unexpected error loading services:",
                error
            );

        }

    }


    // ==========================================
    // RENDER SERVICES
    // ==========================================

    function renderServices(serviceList) {

        if (!servicesGrid) {
            return;
        }

        servicesGrid.innerHTML = "";


        if (serviceList.length === 0) {

            if (serviceCount) {
                serviceCount.textContent = "0 Services";
            }

            if (noResults) {
                noResults.style.display = "block";
            }

            return;
        }


        if (noResults) {
            noResults.style.display = "none";
        }


        serviceList.forEach(service => {

            const card = document.createElement("article");

            card.className = "service-card";

            // service name URL/filter ke liye
            card.dataset.service = service.name;


            const icon = getServiceIcon(service.name);


            card.innerHTML = `

                <div class="service-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>


                <div class="service-content">

                    <h3>
                        ${escapeHtml(service.name)}
                    </h3>


                    <p>
                        ${escapeHtml(
                            service.description ||
                            "Professional services from trusted providers."
                        )}
                    </p>


                    <span class="service-link">

                        Find Providers

                        <i class="fa-solid fa-arrow-right"></i>

                    </span>

                </div>

            `;


            // ==========================================
            // SERVICE CLICK
            // ==========================================

            card.addEventListener("click", () => {

                window.location.href =
                    `providers.html?service=${encodeURIComponent(service.name)}`;

            });


            servicesGrid.appendChild(card);

        });


        if (serviceCount) {

            serviceCount.textContent =
                `${serviceList.length} Services`;

        }

    }


    // ==========================================
    // SEARCH SERVICES
    // ==========================================

    function searchServices() {

        const search = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


        const filteredServices = services.filter(service => {

            const name =
                (service.name || "")
                    .toLowerCase();

            const description =
                (service.description || "")
                    .toLowerCase();


            return (
                name.includes(search) ||
                description.includes(search)
            );

        });


        renderServices(filteredServices);

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    // ==========================================
    // SEARCH EVENT
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchServices
        );

    }


    // ==========================================
    // MOBILE MENU
    // ==========================================

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-active"
                );

            }
        );

    }


    // ==========================================
    // START
    // ==========================================

    await loadServices();

});