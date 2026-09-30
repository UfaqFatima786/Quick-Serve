const services = [

    {
        name: "Electrician",
        icon: "fa-solid fa-bolt",
        description: "Professional electrical repair, wiring and installation services."
    },

    {
        name: "Plumber",
        icon: "fa-solid fa-faucet-drip",
        description: "Reliable plumbing solutions for leaks, pipes and installations."
    },

    {
        name: "AC Repair",
        icon: "fa-solid fa-snowflake",
        description: "Fast AC repair, maintenance and cooling solutions."
    },

    {
        name: "Cleaning",
        icon: "fa-solid fa-broom",
        description: "Trusted home and office cleaning professionals near you."
    },

    {
        name: "Painter",
        icon: "fa-solid fa-paint-roller",
        description: "Transform your space with experienced painting professionals."
    },

    {
        name: "Home Tutor",
        icon: "fa-solid fa-book-open-reader",
        description: "Find skilled tutors for school, college and professional learning."
    },

    {
        name: "Carpenter",
        icon: "fa-solid fa-hammer",
        description: "Professional furniture repair, woodwork and custom carpentry."
    },

    {
        name: "Appliance Repair",
        icon: "fa-solid fa-screwdriver-wrench",
        description: "Reliable repair services for your home appliances."
    },

    {
        name: "Beauty & Salon",
        icon: "fa-solid fa-scissors",
        description: "Professional beauty, grooming and salon services."
    },

    {
        name: "Computer Repair",
        icon: "fa-solid fa-computer",
        description: "Expert computer, laptop and technical support services."
    },

    {
        name: "Auto Services",
        icon: "fa-solid fa-car",
        description: "Trusted vehicle maintenance and repair services."
    },

    {
        name: "Gardener",
        icon: "fa-solid fa-seedling",
        description: "Professional gardening, lawn care and plant maintenance."
    }

];

const servicesGrid =
    document.getElementById("servicesGrid");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const popularButtons =
    document.querySelectorAll(".popular-searches button");

// const menuToggle =
//     document.getElementById("menuToggle");

// const navLinks =
//     document.getElementById("navLinks");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const closeToast =
    document.getElementById("closeToast");

const viewAllBtn =
    document.getElementById("viewAllBtn");


// ================= RENDER SERVICES =================

function renderServices(serviceList = services) {

    if (!servicesGrid) return;

    servicesGrid.innerHTML = "";

    serviceList.forEach((service, index) => {

        const card =
            document.createElement("article");

        card.className = "service-card";

        // First 6 visible
        // Remaining services hidden
        if (index >= 6) {
            card.classList.add("extra-service");
        }

        card.innerHTML = `

            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>

            <h3>${service.name}</h3>

            <p>
                ${service.description}
            </p>

            <a href="providers.html"
               class="service-link"
               data-service="${service.name}">

                Explore Providers

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        `;

        servicesGrid.appendChild(card);

    });

}


// ================= VIEW ALL SERVICES =================

if (viewAllBtn) {

    viewAllBtn.addEventListener("click", () => {

        const extraServices =
            document.querySelectorAll(".extra-service");

        extraServices.forEach(card => {

            card.style.display = "block";

        });

        // Hide button after showing all
        viewAllBtn.style.display = "none";

        showToast(
            "All services are now displayed."
        );

    });

}


// ================= SEARCH =================

function performSearch() {

    const query =
        searchInput.value.trim().toLowerCase();

    if (!query) {

        showToast(
            "Please enter a service name to search."
        );

        searchInput.focus();

        return;
    }

    const foundService =
        services.find(service =>
            service.name
                .toLowerCase()
                .includes(query)
        );

    if (foundService) {

        showToast(
            `${foundService.name} selected. Providers page will open next.`
        );

        // If you want direct providers page later:
        // window.location.href =
        // `providers.html?service=${encodeURIComponent(foundService.name)}`;

    } else {

        showToast(
            "Service not found. Try Electrician, Plumber, AC Repair or Cleaning."
        );

    }

}


// ================= SEARCH BUTTON =================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        performSearch
    );

}


// ================= ENTER KEY =================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


// ================= POPULAR SEARCH =================

popularButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.dataset.search;

            searchInput.value = value;

            performSearch();

        }
    );

});


// ================= TOAST =================

let toastTimer;

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


if (closeToast) {

    closeToast.addEventListener(
        "click",
        () => {

            toast.classList.remove("show");

        }
    );

}


// ================= MOBILE MENU =================

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "mobile-active"
            );

            const icon =
                menuToggle.querySelector("i");

            if (
                navLinks.classList.contains(
                    "mobile-active"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}


// ================= CLOSE MOBILE MENU =================

document.querySelectorAll(
    ".nav-links a"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks.classList.remove(
                "mobile-active"
            );

            const icon =
                menuToggle?.querySelector("i");

            if (icon) {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

});


// ================= SCROLL REVEAL =================

const revealElements =
    document.querySelectorAll(
        ".service-card, .step-card, .hero-content, .hero-card-main"
    );


const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(element);

});

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderServices();

        console.log(
            "QuickServe Home Page Loaded Successfully."
        );

    }
);