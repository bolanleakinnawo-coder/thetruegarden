const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Open / close mobile menu
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close menu after clicking a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const icon = button.querySelector("strong");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    // Close all FAQ items
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-question strong").textContent = "+";
    });

    // Open clicked item
    if (!isOpen) {
      item.classList.add("active");
      icon.textContent = "−";
    }
  });
});

const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = document.querySelectorAll(".video-testimonial");
const testimonialPrev = document.querySelector(".testimonial-prev");
const testimonialNext = document.querySelector(".testimonial-next");
const testimonialDots = document.querySelectorAll(".testimonial-dot");

let testimonialIndex = 0;

function getVisibleCards() {
  if (window.innerWidth <= 850) return 1;
  if (window.innerWidth <= 1000) return 2;
  return 3;
}

function updateTestimonials() {
  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, testimonialCards.length - visibleCards);

  testimonialIndex = Math.min(testimonialIndex, maxIndex);

  const cardWidth = testimonialCards[0].offsetWidth;
  const gap = 20;

  testimonialTrack.style.transform = `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;

  testimonialDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === testimonialIndex);
  });
}

testimonialNext.addEventListener("click", () => {
  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, testimonialCards.length - visibleCards);

  if (testimonialIndex < maxIndex) {
    testimonialIndex++;
    updateTestimonials();
  }
});

testimonialPrev.addEventListener("click", () => {
  if (testimonialIndex > 0) {
    testimonialIndex--;
    updateTestimonials();
  }
});

testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    testimonialIndex = index;
    updateTestimonials();
  });
});

window.addEventListener("resize", updateTestimonials);

/* MOBILE SWIPE */

let touchStartX = 0;
let touchEndX = 0;

const testimonialWrapper = document.querySelector(".testimonial-track-wrapper");

testimonialWrapper.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true },
);

testimonialWrapper.addEventListener(
  "touchend",
  (event) => {
    touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) < 50) return;

    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, testimonialCards.length - visibleCards);

    if (swipeDistance > 0 && testimonialIndex < maxIndex) {
      testimonialIndex++;
    }

    if (swipeDistance < 0 && testimonialIndex > 0) {
      testimonialIndex--;
    }

    updateTestimonials();
  },
  { passive: true },
);

updateTestimonials();

const umrahForm = document.getElementById("umrahForm");
const formResult = document.getElementById("formResult");
const formSubmitButton = document.getElementById("formSubmitButton");
const submitText = document.getElementById("submitText");
const submitArrow = document.getElementById("submitArrow");
const travelPreference = document.getElementById("travel-preference");
const preferredDateGroup = document.getElementById("preferred-date-group");
const preferredDate = document.getElementById("preferred-date");

function togglePreferredDate() {
  const wantsDate = travelPreference.value === "preferred";
  preferredDateGroup.hidden = !wantsDate;
  preferredDate.required = wantsDate;
  if (!wantsDate) preferredDate.value = "";
}

travelPreference.addEventListener("change", togglePreferredDate);
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzJXjR_Xg96swjffWWRxiN-GGFrRSvOBS6l5AmPMcO-vi2gW5LuRi2inLaKUM5OPn-nIQ/exec";

umrahForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Check required fields
  if (!umrahForm.checkValidity()) {
    umrahForm.reportValidity();
    return;
  }

  // Disable button while submitting
  formSubmitButton.disabled = true;
  submitText.textContent = "SENDING...";
  submitArrow.textContent = "•";

  formResult.className = "form-result";
  formResult.textContent = "";

  // Collect form data
  const formData = new FormData(umrahForm);

  const data = {
    fullName: formData.get("fullName"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    package: formData.get("package"),
    departure: formData.get("departure"),
    travelPreference: formData.get("travelPreference"),
    deposit: formData.get("deposit"),
    departureState: formData.get("departureState"),
    umrahBudget: formData.get("umrahBudget"),
    packageType: formData.get("packageType"),
    travelPreference: formData.get("travelPreference"),
    preferredDate: formData.get("preferredDate") || "",
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });

    const result = await response.json();
    if (result.result !== "success") {
      throw new Error(result.message || "Submission failed");
    }

    if (typeof fbq === "function") fbq("track", "Lead"); // handy for your Meta ads

    formResult.className = "form-result success";
    formResult.innerHTML = `
    <strong>Application received!</strong><br>
    Thank you for your interest in the December 2026 Umrah.
    Taking you to WhatsApp...
  `;

    umrahForm.reset();
    togglePreferredDate();
    submitText.textContent = "APPLICATION SENT";
    submitArrow.textContent = "✓";

    setTimeout(() => {
      window.location.href = "https://wa.link/op9yo2";
    }, 1000);
  } catch (error) {
    console.error("Submission error:", error);

    formResult.className = "form-result error";

    formResult.innerHTML = `
        <strong>Unable to submit application.</strong><br>
        Please try again or contact True Gardens Travels directly.
      `;

    submitText.textContent = "TRY AGAIN";
    submitArrow.textContent = "→";

    formSubmitButton.disabled = false;
  }
});
