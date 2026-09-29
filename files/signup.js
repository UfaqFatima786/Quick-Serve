document.addEventListener("DOMContentLoaded", () => {

    const existing = qsGetCurrentUser();
    if (existing) {
        window.location.href =
            existing.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
        return;
    }

    let selectedRole = "customer";

    const roleCustomerBtn = document.getElementById("roleCustomerBtn");
    const roleProviderBtn = document.getElementById("roleProviderBtn");

    roleCustomerBtn.addEventListener("click", () => {
        selectedRole = "customer";
        roleCustomerBtn.classList.add("active");
        roleProviderBtn.classList.remove("active");
    });

    roleProviderBtn.addEventListener("click", () => {
        selectedRole = "provider";
        roleProviderBtn.classList.add("active");
        roleCustomerBtn.classList.remove("active");
    });


    const signupForm = document.getElementById("signupForm");

    const nameInput = document.getElementById("signupName");
    const emailInput = document.getElementById("signupEmail");
    const phoneInput = document.getElementById("signupPhone");
    const passwordInput = document.getElementById("signupPassword");
    const confirmInput = document.getElementById("signupConfirmPassword");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("signupEmailError");
    const phoneError = document.getElementById("phoneError");
    const passwordError = document.getElementById("signupPasswordError");
    const confirmError = document.getElementById("confirmPasswordError");
    const signupNote = document.getElementById("signupNote");


    signupForm.addEventListener("submit", event => {

        event.preventDefault();

        [nameError, emailError, phoneError, passwordError, confirmError]
            .forEach(el => el.classList.remove("show"));
        signupNote.classList.remove("show");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneValid = /^[0-9+\-\s]{10,15}$/.test(phone);

        let hasError = false;

        if (!name) {
            nameError.classList.add("show");
            hasError = true;
        }

        if (!emailValid) {
            emailError.classList.add("show");
            hasError = true;
        }

        if (!phoneValid) {
            phoneError.classList.add("show");
            hasError = true;
        }

        if (password.length < 6) {
            passwordError.classList.add("show");
            hasError = true;
        }

        if (confirm !== password) {
            confirmError.classList.add("show");
            hasError = true;
        }

        if (hasError) return;

        if (qsFindUserByEmail(email)) {
            signupNote.textContent =
                "An account with this email already exists. Please login instead.";
            signupNote.classList.add("show");
            return;
        }

        const newUser = qsCreateUser({
            name,
            email,
            phone,
            password,
            role: selectedRole
        });

        qsSetCurrentUser(newUser);

        // signup ke baad seedha home page par bhejna hai,
        // dashboard par nahi (login karne par dashboard khulega)
        window.location.href = "index.html";

    });

});
