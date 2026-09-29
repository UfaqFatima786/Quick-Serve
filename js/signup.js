document.getElementById("signupForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("signupPhone").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                phone: phone
            }
        }
    });

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    console.log("User created:", data);

    alert("Account created successfully!");

    window.location.href = "page.html";
});