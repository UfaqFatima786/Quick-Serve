document.addEventListener("DOMContentLoaded", async () => {

    const user = await qsRequireLogin("provider");
    if (!user) return;

    const form = document.getElementById("providerSetupForm");
    const setupNote = document.getElementById("setupNote");

    const serviceSelect = document.getElementById("serviceSelect");
    const locationInput = document.getElementById("locationInput");
    const experienceInput = document.getElementById("experienceInput");
    const priceInput = document.getElementById("priceInput");
    const descriptionInput = document.getElementById("descriptionInput");

    const imageInput = document.getElementById("imageInput");
    const imagePreview = document.getElementById("imagePreview");
    const saveListingBtn = document.getElementById("saveListingBtn");

    let existingImageUrl = null;

    function showNote(message, isError) {
        setupNote.textContent = message;
        setupNote.classList.add("show");
        setupNote.style.color = isError ? "#ff5c5c" : "#3aa7ff";
    }

    /* ============ LOAD SERVICE OPTIONS ============ */

    const { data: services, error: servicesError } = await supabaseClient
        .from("services")
        .select("id, name")
        .order("name");

    if (servicesError) {
        showNote("Could not load services: " + servicesError.message, true);
    } else {
        services.forEach(service => {
            const opt = document.createElement("option");
            opt.value = service.id;
            opt.textContent = service.name;
            opt.dataset.name = service.name;
            serviceSelect.appendChild(opt);
        });
    }

    /* ============ LOAD EXISTING LISTING (edit mode) ============ */

    const { data: existing, error: existingError } = await supabaseClient
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingError) {
        console.error(existingError);
    }

    if (existing) {
        serviceSelect.value = existing.service_id || "";
        locationInput.value = existing.location || "";
        experienceInput.value = existing.experience || 0;
        priceInput.value = existing.price || 0;
        descriptionInput.value = existing.description || "";
        existingImageUrl = existing.image_url;

        if (existingImageUrl) {
            imagePreview.src = existingImageUrl;
            imagePreview.style.display = "block";
        }

        showNote("You already have a listing — editing it below.", false);
    }

    /* ============ IMAGE PREVIEW ============ */

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
    });

    /* ============ SAVE (upsert) ============ */

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const serviceId = serviceSelect.value;
        const serviceName = serviceSelect.selectedOptions[0]?.dataset.name || "";

        if (!serviceId) {
            document.getElementById("serviceError").style.display = "block";
            return;
        }

        saveListingBtn.disabled = true;
        saveListingBtn.textContent = "Saving...";

        let imageUrl = existingImageUrl;

        const file = imageInput.files[0];
        if (file) {
            const uploaded = await qsUploadImage(file, "provider-images", user.id);
            if (uploaded) imageUrl = uploaded;
        }

        const { error } = await supabaseClient
            .from("providers")
            .upsert({
                user_id: user.id,
                service_id: serviceId,
                service_name: serviceName,
                location: locationInput.value.trim(),
                experience: parseInt(experienceInput.value, 10) || 0,
                price: parseFloat(priceInput.value) || 0,
                description: descriptionInput.value.trim(),
                image_url: imageUrl
            }, { onConflict: "user_id" });

        saveListingBtn.disabled = false;
        saveListingBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Listing`;

        if (error) {
            showNote("Could not save listing: " + error.message, true);
            return;
        }

        showNote("Listing saved! Customers can now find you.", false);

        setTimeout(() => {
            window.location.href = "provider-dashboard.html";
        }, 1200);
    });

});
