document.addEventListener("DOMContentLoaded", async () => {

    const user = await qsRequireLogin();
    if (!user) return;

    const avatarEl = document.getElementById("profileAvatarInitials");
    const fullNameEl = document.getElementById("profileFullName");
    const roleTagEl = document.getElementById("profileRoleTag");

    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");

    const profileForm = document.getElementById("profileForm");
    const saveMsg = document.getElementById("saveMsg");
    const logoutBtn = document.getElementById("logoutBtn");
    const goToDashboard = document.getElementById("goToDashboard");

    const avatarInput = document.getElementById("avatarInput");
    const changePhotoBtn = document.getElementById("changePhotoBtn");

    function initials(name) {
        return name
            .split(" ")
            .map(p => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function render(u) {
        if (u.avatar_url) {
            avatarEl.style.backgroundImage = `url('${u.avatar_url}')`;
            avatarEl.style.backgroundSize = "cover";
            avatarEl.style.backgroundPosition = "center";
            avatarEl.textContent = "";
        } else {
            avatarEl.style.backgroundImage = "";
            avatarEl.textContent = initials(u.full_name);
        }

        fullNameEl.textContent = u.full_name;
        roleTagEl.textContent = u.role;

        nameInput.value = u.full_name;
        emailInput.value = u.email;
        phoneInput.value = u.phone || "";

        goToDashboard.href =
            u.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
    }

    render(user);
    if (changePhotoBtn && avatarInput) {
        changePhotoBtn.addEventListener("click", () => avatarInput.click());
    }

    if (avatarInput) {
        avatarInput.addEventListener("change", async () => {

            const file = avatarInput.files[0];
            if (!file) return;

            changePhotoBtn.disabled = true;
            changePhotoBtn.textContent = "Uploading...";

            const publicUrl = await qsUploadImage(file, "avatars", user.id);

            changePhotoBtn.disabled = false;
            changePhotoBtn.innerHTML = `<i class="fa-solid fa-camera"></i> Change Photo`;

            if (!publicUrl) return;

            const { error } = await supabaseClient
                .from("profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            if (error) {
                alert("Could not save avatar: " + error.message);
                return;
            }

            user.avatar_url = publicUrl;
            render(user);
        });
    }
    profileForm.addEventListener("submit", async event => {

        event.preventDefault();

        const { data: updated, error } = await supabaseClient
            .from("profiles")
            .update({
                full_name: nameInput.value.trim(),
                phone: phoneInput.value.trim()
            })
            .eq("id", user.id)
            .select()
            .single();

        if (error) {
            alert("Update failed: " + error.message);
            return;
        }

        render(updated);

        saveMsg.classList.add("show");
        setTimeout(() => saveMsg.classList.remove("show"), 2500);
    });

    logoutBtn.addEventListener("click", () => qsLogout());

});

/* =========================================
   RESPONSIVE NAVBAR
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    const menuIcon = menuToggle.querySelector("i");


    /* =========================
       OPEN / CLOSE MENU
    ========================= */

    menuToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        navLinks.classList.toggle("mobile-active");

        const isOpen =
            navLinks.classList.contains("mobile-active");

        if (isOpen) {

            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");

        } else {

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

        }

    });


    /* =========================
       CLOSE MENU AFTER LINK CLICK
    ========================= */

    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("mobile-active");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

        });

    });


    /* =========================
       CLOSE MENU WHEN CLICKING
       OUTSIDE NAVBAR
    ========================= */

    document.addEventListener("click", (e) => {

        if (
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {

            navLinks.classList.remove("mobile-active");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 999) {

            navLinks.classList.remove("mobile-active");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

        }

    });

});
