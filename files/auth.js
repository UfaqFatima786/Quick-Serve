/* ============================================================
   QUICKSERVE — SHARED AUTH & DATA LAYER
   Temporary localStorage version (MVP). Will be swapped for
   Supabase later — every function below is a candidate to be
   replaced by a supabase.from(...) call without touching the
   pages that use it.
============================================================ */

const QS_USERS_KEY = "qs_users";
const QS_CURRENT_USER_KEY = "qs_current_user";
const QS_BOOKINGS_KEY = "qs_bookings";


/* ================= USERS ================= */

function qsGetUsers() {
    return JSON.parse(localStorage.getItem(QS_USERS_KEY) || "[]");
}

function qsSaveUsers(users) {
    localStorage.setItem(QS_USERS_KEY, JSON.stringify(users));
}

function qsFindUserByEmail(email) {
    return qsGetUsers().find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );
}

function qsCreateUser({ name, email, phone, password, role }) {
    const users = qsGetUsers();

    const newUser = {
        id: "U" + Date.now(),
        name,
        email,
        phone,
        password,
        role, // "customer" | "provider"
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    qsSaveUsers(users);

    return newUser;
}

function qsUpdateUser(id, changes) {
    const users = qsGetUsers();
    const idx = users.findIndex(u => u.id === id);

    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...changes };
    qsSaveUsers(users);

    // keep session in sync if it's the logged-in user
    const current = qsGetCurrentUser();
    if (current && current.id === id) {
        qsSetCurrentUser(users[idx]);
    }

    return users[idx];
}


/* ================= SESSION ================= */

function qsGetCurrentUser() {
    return JSON.parse(localStorage.getItem(QS_CURRENT_USER_KEY) || "null");
}

function qsSetCurrentUser(user) {
    localStorage.setItem(QS_CURRENT_USER_KEY, JSON.stringify(user));
}

function qsLogout() {
    localStorage.removeItem(QS_CURRENT_USER_KEY);
    window.location.href = "index.html";
}

/* Redirect to login if nobody is logged in. Call at top of
   protected pages (dashboards, profile). Returns the user. */
function qsRequireLogin(requiredRole) {
    const user = qsGetCurrentUser();

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


/* ================= BOOKINGS ================= */

function qsGetBookings() {
    return JSON.parse(localStorage.getItem(QS_BOOKINGS_KEY) || "[]");
}

function qsSaveBookings(bookings) {
    localStorage.setItem(QS_BOOKINGS_KEY, JSON.stringify(bookings));
}

function qsGenerateBookingId() {
    const stamp = Date.now().toString().slice(-7);
    const rand = Math.floor(10 + Math.random() * 90);
    return `QS-${stamp}${rand}`;
}

function qsCreateBooking(data) {
    const bookings = qsGetBookings();

    const booking = {
        id: qsGenerateBookingId(),
        status: "Pending", // Pending -> Accepted/Rejected -> In Progress -> Completed
        review: null,
        createdAt: new Date().toISOString(),
        ...data
    };

    bookings.push(booking);
    qsSaveBookings(bookings);

    return booking;
}

function qsUpdateBooking(id, changes) {
    const bookings = qsGetBookings();
    const idx = bookings.findIndex(b => b.id === id);

    if (idx === -1) return null;

    bookings[idx] = { ...bookings[idx], ...changes };
    qsSaveBookings(bookings);

    return bookings[idx];
}

function qsGetBookingsForCustomer(customerId) {
    return qsGetBookings().filter(b => b.customerId === customerId);
}

function qsGetBookingsForProvider(providerName) {
    return qsGetBookings().filter(b => b.providerName === providerName);
}


/* ================= NAVBAR AUTH STATE ================= */

function qsUpdateNavUI() {
    const loginBtn =
        document.getElementById("navLoginBtn") ||
        document.querySelector(".login-btn");

    if (!loginBtn) return;

    const user = qsGetCurrentUser();

    if (!user) return;

    const firstName = user.name.split(" ")[0];

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
