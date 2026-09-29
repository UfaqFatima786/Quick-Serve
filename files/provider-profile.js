document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       PROVIDER DATA
    ========================================= */

    const providers = {

        "Ayesha Khan": {

            service: "Cleaning",

            role: "Home & Deep Cleaning Expert",

            location: "Karachi",

            experience: "6 Years",

            rating: "4.9",

            reviews: "142 reviews",

            price: "PKR 1,500",

            avatar: "AK",

            description:
                "Ayesha is an experienced home cleaning professional specializing in deep cleaning, kitchen cleaning and complete home maintenance. She is known for reliable and detailed service.",

            about:
                "With 6 years of professional cleaning experience, Ayesha helps families maintain clean, healthy and comfortable homes. She focuses on quality, attention to detail and customer satisfaction.",

            skills: [
                "Home Cleaning",
                "Deep Cleaning",
                "Kitchen Cleaning",
                "Bathroom Cleaning",
                "Office Cleaning"
            ]

        },


        "Sana Malik": {

            service: "Cleaning",

            role: "Professional Cleaning Specialist",

            location: "Lahore",

            experience: "5 Years",

            rating: "4.8",

            reviews: "98 reviews",

            price: "PKR 1,300",

            avatar: "SM",

            description:
                "Sana provides professional cleaning solutions for homes and offices with a strong focus on hygiene, quality and customer satisfaction.",

            about:
                "Sana has 5 years of experience in professional cleaning services. She provides reliable cleaning solutions for residential and office spaces.",

            skills: [
                "House Cleaning",
                "Office Cleaning",
                "Deep Cleaning",
                "Kitchen Cleaning",
                "General Cleaning"
            ]

        },


        "Hina Ahmed": {

            service: "Cleaning",

            role: "Residential Cleaning Expert",

            location: "Islamabad",

            experience: "4 Years",

            rating: "4.7",

            reviews: "76 reviews",

            price: "PKR 1,200",

            avatar: "HA",

            description:
                "Hina specializes in residential cleaning and provides detailed cleaning services for kitchens, bathrooms and living spaces.",

            about:
                "Hina has built a strong reputation for reliable residential cleaning services. Her focus is on delivering clean and comfortable spaces for every customer.",

            skills: [
                "Residential Cleaning",
                "Kitchen Cleaning",
                "Bathroom Cleaning",
                "Deep Cleaning",
                "Home Maintenance"
            ]

        },


        /* =========================================
           PLUMBING
        ========================================= */

        "Bilal Ahmed": {

            service: "Plumbing",

            role: "Professional Plumber",

            location: "Karachi",

            experience: "7 Years",

            rating: "4.9",

            reviews: "121 reviews",

            price: "PKR 1,000",

            avatar: "BA",

            description:
                "Bilal is a professional plumber providing fast and reliable plumbing solutions for homes and offices.",

            about:
                "With 7 years of plumbing experience, Bilal handles everything from pipe repairs and water leakage to bathroom installations and maintenance.",

            skills: [
                "Pipe Repair",
                "Water Leakage Repair",
                "Bathroom Plumbing",
                "Kitchen Plumbing",
                "Pipe Installation"
            ]

        },


        "Usman Raza": {

            service: "Plumbing",

            role: "Plumbing & Pipe Specialist",

            location: "Lahore",

            experience: "6 Years",

            rating: "4.8",

            reviews: "89 reviews",

            price: "PKR 1,100",

            avatar: "UR",

            description:
                "Usman specializes in water pipes, drainage systems and general plumbing repair for residential properties.",

            about:
                "Usman has 6 years of hands-on plumbing experience and provides dependable repair and installation services.",

            skills: [
                "Water Pipe Repair",
                "Drainage Repair",
                "Pipe Installation",
                "Bathroom Plumbing",
                "Leakage Repair"
            ]

        },


        "Kamran Shah": {

            service: "Plumbing",

            role: "Home Plumbing Expert",

            location: "Islamabad",

            experience: "4 Years",

            rating: "4.6",

            reviews: "64 reviews",

            price: "PKR 900",

            avatar: "KS",

            description:
                "Kamran provides affordable and reliable home plumbing services including bathroom and kitchen repairs.",

            about:
                "Kamran is a skilled home plumbing expert with 4 years of professional experience serving residential customers.",

            skills: [
                "Home Plumbing",
                "Bathroom Repair",
                "Kitchen Plumbing",
                "Pipe Repair",
                "Leakage Fixing"
            ]

        },


        /* =========================================
           ELECTRICIAN
        ========================================= */

        "Hamza Ali": {

            service: "Electrician",

            role: "Certified Electrician",

            location: "Karachi",

            experience: "8 Years",

            rating: "4.9",

            reviews: "137 reviews",

            price: "PKR 1,400",

            avatar: "HA",

            description:
                "Hamza is a certified electrician specializing in wiring, electrical repairs and home electrical installations.",

            about:
                "With 8 years of electrical experience, Hamza provides safe and professional electrical solutions for homes and offices.",

            skills: [
                "Electrical Wiring",
                "Electrical Repair",
                "Fan Installation",
                "Light Installation",
                "Switch & Socket Repair"
            ]

        },


        "Saad Khan": {

            service: "Electrician",

            role: "Home Electrical Specialist",

            location: "Lahore",

            experience: "6 Years",

            rating: "4.8",

            reviews: "105 reviews",

            price: "PKR 1,200",

            avatar: "SK",

            description:
                "Saad provides professional electrical repair and installation services for residential customers.",

            about:
                "Saad has 6 years of experience handling home electrical systems, wiring and appliance-related electrical work.",

            skills: [
                "Home Wiring",
                "Fan Repair",
                "Light Installation",
                "Electrical Repair",
                "Switch Repair"
            ]

        },


        "Imran Ahmed": {

            service: "Electrician",

            role: "Electrical Repair Expert",

            location: "Islamabad",

            experience: "5 Years",

            rating: "4.7",

            reviews: "82 reviews",

            price: "PKR 1,000",

            avatar: "IA",

            description:
                "Imran specializes in electrical repairs, wiring and appliance-related electrical services.",

            about:
                "Imran provides reliable electrical repair services with a focus on safety and professional workmanship.",

            skills: [
                "Electrical Repair",
                "Wiring",
                "Appliance Repair",
                "Fan Repair",
                "Light Repair"
            ]

        },


        /* =========================================
           AC REPAIR
        ========================================= */

        "Fahad Khan": {

            service: "AC Repair",

            role: "AC Repair & Maintenance Expert",

            location: "Karachi",

            experience: "7 Years",

            rating: "4.9",

            reviews: "116 reviews",

            price: "PKR 1,800",

            avatar: "FK",

            description:
                "Fahad is an experienced AC technician specializing in AC repair, maintenance and cooling problems.",

            about:
                "With 7 years of experience, Fahad provides professional air conditioner repair, maintenance and installation services.",

            skills: [
                "AC Repair",
                "AC Maintenance",
                "Gas Refilling",
                "Cooling Problem Repair",
                "AC Installation"
            ]

        },


        "Waqas Ali": {

            service: "AC Repair",

            role: "AC Technician",

            location: "Lahore",

            experience: "6 Years",

            rating: "4.8",

            reviews: "91 reviews",

            price: "PKR 1,600",

            avatar: "WA",

            description:
                "Waqas provides reliable AC repair and servicing for homes and offices.",

            about:
                "Waqas has 6 years of experience working with different air conditioning systems and cooling problems.",

            skills: [
                "AC Service",
                "AC Repair",
                "Cooling Repair",
                "Gas Refilling",
                "AC Maintenance"
            ]

        },


        "Danish Ahmed": {

            service: "AC Repair",

            role: "AC Maintenance Specialist",

            location: "Islamabad",

            experience: "4 Years",

            rating: "4.6",

            reviews: "58 reviews",

            price: "PKR 1,400",

            avatar: "DA",

            description:
                "Danish specializes in AC maintenance, repair and troubleshooting for residential customers.",

            about:
                "Danish provides professional AC maintenance and repair services with a focus on quick and reliable solutions.",

            skills: [
                "AC Maintenance",
                "AC Repair",
                "AC Cleaning",
                "Cooling Troubleshooting",
                "Gas Checking"
            ]

        },


        /* =========================================
           PAINTING
        ========================================= */

        "Zain Abbas": {

            service: "Painting",

            role: "Interior Painting Expert",

            location: "Karachi",

            experience: "8 Years",

            rating: "4.9",

            reviews: "103 reviews",

            price: "PKR 2,000",

            avatar: "ZA",

            description:
                "Zain is an experienced painter specializing in interior wall painting and home transformation.",

            about:
                "With 8 years of painting experience, Zain helps customers transform their homes with professional finishing and quality workmanship.",

            skills: [
                "Interior Painting",
                "Wall Painting",
                "Home Painting",
                "Color Consultation",
                "Wall Finishing"
            ]

        },


        "Rashid Ali": {

            service: "Painting",

            role: "Home Painting Specialist",

            location: "Lahore",

            experience: "6 Years",

            rating: "4.7",

            reviews: "71 reviews",

            price: "PKR 1,700",

            avatar: "RA",

            description:
                "Rashid provides professional home painting and wall painting services with clean finishing.",

            about:
                "Rashid has 6 years of experience in residential painting and specializes in delivering neat and professional finishes.",

            skills: [
                "House Painting",
                "Wall Painting",
                "Interior Painting",
                "Color Selection",
                "Wall Finishing"
            ]

        },


        "Noman Shah": {

            service: "Painting",

            role: "Professional Painter",

            location: "Islamabad",

            experience: "5 Years",

            rating: "4.6",

            reviews: "55 reviews",

            price: "PKR 1,500",

            avatar: "NS",

            description:
                "Noman provides reliable home painting and decorating services for residential customers.",

            about:
                "Noman is a professional painter with 5 years of experience in home painting and decorative finishing.",

            skills: [
                "Home Painting",
                "Wall Painting",
                "Decoration",
                "Interior Painting",
                "Wall Repair"
            ]

        }

    };


    /* =========================================
       GET PROVIDER FROM URL
    ========================================= */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const providerName =
        params.get("provider");


    /* =========================================
       FIND PROVIDER
    ========================================= */

    const provider =
        providerName
            ? providers[providerName]
            : null;


    /* =========================================
       ELEMENTS
    ========================================= */

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileName =
        document.getElementById("profileName");

    const profileRole =
        document.getElementById("profileRole");

    const profileService =
        document.getElementById("profileService");

    const profileRating =
        document.getElementById("profileRating");

    const profileReviews =
        document.getElementById("profileReviews");

    const profileLocation =
        document.getElementById("profileLocation");

    const profileExperience =
        document.getElementById("profileExperience");

    const profileDescription =
        document.getElementById("profileDescription");

    const profilePrice =
        document.getElementById("profilePrice");

    const aboutProvider =
        document.getElementById("aboutProvider");

    const skillsList =
        document.getElementById("skillsList");


    /* =========================================
       PROVIDER NOT FOUND
    ========================================= */

    if (!provider) {

        profileName.textContent =
            "Provider Not Found";

        profileRole.textContent =
            "This provider profile does not exist.";

        profileService.textContent =
            "QuickServe";

        profileDescription.textContent =
            "Please go back and select a valid provider.";

        profileAvatar.textContent =
            "?";

        return;

    }


    /* =========================================
       FILL PROFILE
    ========================================= */

    profileAvatar.textContent =
        provider.avatar;

    profileName.textContent =
        providerName;

    profileRole.textContent =
        provider.role;

    profileService.textContent =
        provider.service;

    profileRating.textContent =
        provider.rating;

    profileReviews.textContent =
        `(${provider.reviews})`;

    profileLocation.textContent =
        provider.location;

    profileExperience.textContent =
        provider.experience;

    profileDescription.textContent =
        provider.description;

    profilePrice.textContent =
        provider.price;

    aboutProvider.textContent =
        provider.about;


    /* =========================================
       SKILLS
    ========================================= */

    skillsList.innerHTML = "";


    provider.skills.forEach(skill => {

        const skillElement =
            document.createElement("span");

        skillElement.className =
            "skill-tag";

        skillElement.innerHTML = `
            <i class="fa-solid fa-check"></i>
            ${skill}
        `;

        skillsList.appendChild(
            skillElement
        );

    });


    /* =========================================
       PAGE TITLE
    ========================================= */

    document.title =
        `QuickServe | ${providerName}`;


    /* =========================================
       BOOKING MODAL
    ========================================= */

    const bookingModal =
        document.getElementById("bookingModal");

    const bookServiceBtn =
        document.getElementById("bookServiceBtn");

    const closeModal =
        document.getElementById("closeModal");

    const bookingProviderName =
        document.getElementById(
            "bookingProviderName"
        );


    if (bookingProviderName) {

        bookingProviderName.textContent =
            providerName;

    }


    if (bookServiceBtn) {

        bookServiceBtn.addEventListener(
            "click",
            () => {

                const currentUser =
                    typeof qsGetCurrentUser === "function"
                        ? qsGetCurrentUser()
                        : null;

                if (!currentUser) {

                    alert(
                        "Please login as a customer first to book a service."
                    );

                    window.location.href =
                        "login.html";

                    return;

                }

                if (currentUser.role === "provider") {

                    alert(
                        "Provider accounts cannot book services. Please login as a customer."
                    );

                    return;

                }


                // pre-fill the name field from the logged-in account
                const nameField =
                    document.getElementById("customerName");

                if (nameField && !nameField.value) {

                    nameField.value =
                        currentUser.name;

                }


                bookingModal.classList.add(
                    "active"
                );

            }
        );

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            () => {

                bookingModal.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =========================================
       CLOSE MODAL OUTSIDE
    ========================================= */

    if (bookingModal) {

        bookingModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === bookingModal
                ) {

                    bookingModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================
       BOOKING FORM
    ========================================= */

    const bookingForm =
        document.getElementById("bookingForm");


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const currentUser =
                    typeof qsGetCurrentUser === "function"
                        ? qsGetCurrentUser()
                        : null;

                if (!currentUser) {

                    alert(
                        "Your session expired. Please login again."
                    );

                    window.location.href =
                        "login.html";

                    return;

                }


                const nameValue =
                    document.getElementById("customerName").value.trim();

                const phoneValue =
                    document.getElementById("customerPhone").value.trim();

                const addressValue =
                    document.getElementById("customerAddress").value.trim();

                const dateValue =
                    document.getElementById("bookingDate").value;

                const detailsValue =
                    document.getElementById("bookingDetails").value.trim();


                if (!nameValue || !phoneValue || !addressValue || !dateValue) {

                    alert(
                        "Please fill in all required fields before submitting."
                    );

                    return;

                }


                qsCreateBooking({
                    customerId: currentUser.id,
                    customerName: nameValue,
                    customerPhone: phoneValue,
                    address: addressValue,
                    date: dateValue,
                    details: detailsValue,
                    providerName: providerName,
                    service: provider.service,
                    price: provider.price
                });


                // form khud band + reset, then customer dashboard par redirect
                bookingForm.reset();

                bookingModal.classList.remove(
                    "active"
                );

                window.location.href =
                    "customer-dashboard.html";

            }
        );

    }


    /* =========================================
       CONTACT PROVIDER
    ========================================= */

    const contactBtn =
        document.getElementById("contactBtn");


    if (contactBtn) {

        contactBtn.addEventListener(
            "click",
            () => {

                alert(
                    `You selected ${providerName}. Contact feature can be connected to your booking/login system.`
                );

            }
        );

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "show"
                );

            }
        );

    }


    console.log(
        "Provider Profile Loaded:",
        providerName
    );

});