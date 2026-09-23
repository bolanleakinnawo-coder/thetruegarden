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
    const maxIndex = Math.max(
      0,
      testimonialCards.length - visibleCards
    );

    testimonialIndex = Math.min(testimonialIndex, maxIndex);

    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 20;

    testimonialTrack.style.transform =
      `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;

    testimonialDots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === testimonialIndex
      );
    });
  }


  testimonialNext.addEventListener("click", () => {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(
      0,
      testimonialCards.length - visibleCards
    );

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

  const testimonialWrapper = document.querySelector(
    ".testimonial-track-wrapper"
  );

  testimonialWrapper.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  testimonialWrapper.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].screenX;

      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) < 50) return;

      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(
        0,
        testimonialCards.length - visibleCards
      );

      if (swipeDistance > 0 && testimonialIndex < maxIndex) {
        testimonialIndex++;
      }

      if (swipeDistance < 0 && testimonialIndex > 0) {
        testimonialIndex--;
      }

      updateTestimonials();
    },
    { passive: true }
  );


updateTestimonials();