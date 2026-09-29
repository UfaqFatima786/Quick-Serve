document.addEventListener("DOMContentLoaded", () => {

    // already logged in? send them straight to their dashboard
    const existing = qsGetCurrentUser();
    if (existing) {
        window.location.href =
            existing.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginNote = document.getElementById("loginNote");

    function showNote(message) {
        loginNote.textContent = message;
        loginNote.classList.add("show");
    }

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        loginNote.classList.remove("show");
        emailError.classList.remove("show");
        passwordError.classList.remove("show");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        let hasError = false;

        if (!emailValid) {
            emailError.classList.add("show");
            hasError = true;
        }

        if (!password) {
            passwordError.classList.add("show");
            hasError = true;
        }

        if (hasError) return;

        const user = qsFindUserByEmail(email);

        if (!user || user.password !== password) {
            showNote("Incorrect email or password. Please try again.");
            return;
        }

        qsSetCurrentUser(user);

        window.location.href =
            user.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";

    });

});
