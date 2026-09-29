document.addEventListener("DOMContentLoaded", () => {

    let selectedRole = "customer";

    const roleCustomerBtn = document.getElementById("roleCustomerBtn");
    const roleProviderBtn = document.getElementById("roleProviderBtn");

    if (roleCustomerBtn && roleProviderBtn) {

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
    }

    document.getElementById("signupForm").addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            console.log(error);
            alert(error.message);
            return;
        }

        const newUser = data.user;
        if (newUser && Array.isArray(newUser.identities) && newUser.identities.length === 0) {
            alert("This email is already registered. Please log in instead.");
            window.location.href = "login.html";
            return;
        }
        if (!newUser || !data.session) {
            alert("Account created! Please check your email to confirm, then log in.\n\n(For the hackathon demo, turn OFF 'Confirm email' in Supabase Auth settings so this works instantly.)");
            window.location.href = "login.html";
            return;
        }

        // 2. Create (or refresh, if it somehow already exists) the profiles row.
        // upsert instead of insert so re-submitting never crashes on the
        // profiles_pkey unique constraint.
        const { error: profileError } = await supabaseClient
            .from("profiles")
            .upsert({
                id: newUser.id,
                full_name: name,
                email: email,
                phone: phone,
                role: selectedRole
            }, { onConflict: "id" });

        if (profileError) {
            console.log(profileError);
            alert("Account created but profile setup failed: " + profileError.message);
            return;
        }

        alert("Account created successfully!");

        window.location.href =
            selectedRole === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
    });

});