document.addEventListener("DOMContentLoaded", () => {

    const user = qsRequireLogin();
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

    function initials(name) {
        return name
            .split(" ")
            .map(p => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function render(user) {
        avatarEl.textContent = initials(user.name);
        fullNameEl.textContent = user.name;
        roleTagEl.textContent = user.role;

        nameInput.value = user.name;
        emailInput.value = user.email;
        phoneInput.value = user.phone;

        goToDashboard.href =
            user.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
    }

    render(user);

    profileForm.addEventListener("submit", event => {

        event.preventDefault();

        const updated = qsUpdateUser(user.id, {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim()
        });

        render(updated);

        saveMsg.classList.add("show");

        setTimeout(() => saveMsg.classList.remove("show"), 2500);

    });

    logoutBtn.addEventListener("click", () => qsLogout());

});
