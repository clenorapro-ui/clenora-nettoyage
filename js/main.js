/* ==========================================================================
   CLENORA NETTOYAGE — Interactions & animations (JavaScript vanilla)
   ========================================================================== */
(function () {
  "use strict";

  /* ----------  Active les animations seulement si JS tourne  ---------- */
  document.documentElement.classList.add("js");

  /* ----------  Année dynamique dans le footer  ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------  Header : ombre au scroll  ---------- */
  var header = document.getElementById("header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------  Menu mobile (burger)  ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ----------  Révélation au scroll (fade-in-up)  ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });

    // Filet de sécurité : révèle immédiatement tout élément déjà visible à
    // l'écran (au cas où l'IntersectionObserver tarderait à se déclencher).
    var safety = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh - 40) el.classList.add("visible");
      });
    };
    window.addEventListener("load", safety);
    setTimeout(safety, 300);
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ----------  Compteurs animés (stats)  ---------- */
  var counters = document.querySelectorAll(".num[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1800;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easing out-cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent =
        el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ----------  FAQ accordéon  ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // Fermer les autres
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        var oa = other.querySelector(".faq-a");
        if (oa) oa.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ----------  Bouton retour en haut  ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      function () {
        toTop.classList.toggle("show", window.scrollY > 500);
      },
      { passive: true }
    );
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------  Formulaire de devis (démo)  ---------- */
  var form = document.getElementById("quoteForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Validation simple
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // 👉 Branchez ici votre envoi réel (fetch vers votre API / service e-mail).
      if (success) success.classList.add("show");
      form.reset();
      setTimeout(function () {
        if (success) success.classList.remove("show");
      }, 6000);
    });
  }

  /* ----------  Effet léger de parallaxe sur le visuel hero  ---------- */
  var heroImg = document.querySelector(".hero-img");
  if (heroImg && window.matchMedia("(hover: hover)").matches) {
    var heroVisual = document.querySelector(".hero-visual");
    heroVisual.addEventListener("mousemove", function (e) {
      var r = heroVisual.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      heroImg.style.transform =
        "rotateY(" + px * 6 + "deg) rotateX(" + -py * 6 + "deg)";
    });
    heroVisual.addEventListener("mouseleave", function () {
      heroImg.style.transform = "rotateY(0) rotateX(0)";
    });
    heroImg.style.transition = "transform 0.3s ease";
    heroImg.style.transformStyle = "preserve-3d";
  }
})();
