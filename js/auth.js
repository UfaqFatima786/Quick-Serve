const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-active");
});
async function qsGetCurrentUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return null;

    const { data: profile, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (error || !profile) return null;

    return profile;
}

async function qsLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
}

async function qsRequireLogin(requiredRole) {
    const user = await qsGetCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.href =
            user.role === "provider"
                ? "provider-dashboard.html"
                : "customer-dashboard.html";
        return null;
    }

    return user;
}

function qsGenerateBookingId() {
    const stamp = Date.now().toString().slice(-7);
    const rand = Math.floor(10 + Math.random() * 90);
    return `QS-${stamp}${rand}`;
}

async function qsUploadImage(file, bucket, userId) {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseClient
        .storage
        .from(bucket)
        .upload(path, file, { upsert: true });

    if (uploadError) {
        console.error("Upload failed:", uploadError);
        alert("Image upload failed: " + uploadError.message);
        return null;
    }

    const { data } = supabaseClient
        .storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}

async function qsUpdateNavUI() {
    const loginBtn =
        document.getElementById("navLoginBtn") ||
        document.querySelector(".login-btn");

    if (!loginBtn) return;

    const user = await qsGetCurrentUser();

    if (!user) return;

    const firstName = user.full_name.split(" ")[0];

    loginBtn.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${firstName}`;

    loginBtn.href =
        user.role === "provider"
            ? "provider-dashboard.html"
            : "customer-dashboard.html";

    if (!document.getElementById("navLogoutBtn")) {
        const logoutBtn = document.createElement("a");

        logoutBtn.href = "#";
        logoutBtn.id = "navLogoutBtn";
        logoutBtn.className = "login-btn";
        logoutBtn.title = "Logout";
        logoutBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i>`;

        logoutBtn.addEventListener("click", event => {
            event.preventDefault();
            qsLogout();
        });

        loginBtn.insertAdjacentElement("afterend", logoutBtn);
    }
}

document.addEventListener("DOMContentLoaded", qsUpdateNavUI);
