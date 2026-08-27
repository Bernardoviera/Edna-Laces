/* =========================================================
   Comportamentos da página. Não é necessário editar este
   arquivo — as informações ficam em config.js.
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var WA_NUMBER = String(CFG.whatsapp || "").replace(/\D/g, "");
  var DEFAULT_MSG = CFG.mensagemPadrao || "Olá! Vim pelo site e quero agendar uma avaliação.";

  /* ---------- Link do WhatsApp ---------- */
  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message || DEFAULT_MSG);
  }

  /* Todo elemento com [data-wa] vira um link para o WhatsApp.
     Um texto em data-wa personaliza a mensagem daquele botão. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-wa]"), function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-wa")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* Todo elemento com [data-checkout="ebook"] ou [data-checkout="mentoria"] aponta pro
     link de compra daquele produto, quando existir. Sem link configurado, mantém o
     href original (âncora pra seção "o que você recebe" da própria página). */
  Array.prototype.forEach.call(document.querySelectorAll("[data-checkout]"), function (el) {
    var produto = el.getAttribute("data-checkout");
    var url = produto === "mentoria" ? CFG.checkoutUrlMentoria : CFG.checkoutUrlEbook;
    if (url) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });

  /* Formulário de candidatura da mentoria: sem backend, então em vez de enviar
     os dados pra algum lugar, monta uma mensagem com as respostas e abre o
     WhatsApp da Edna já preenchido — é só a pessoa confirmar o envio. */
  var formCandidatura = document.getElementById("form-candidatura");
  if (formCandidatura) {
    formCandidatura.setAttribute("action", "https://wa.me/" + WA_NUMBER);
    formCandidatura.addEventListener("submit", function (e) {
      e.preventDefault();
      var dados = new FormData(formCandidatura);
      var linhas = [
        "Olá, Edna! Quero me candidatar a uma vaga na mentoria.",
        "",
        "Nome: " + dados.get("nome"),
        "WhatsApp: " + dados.get("whatsapp"),
        "Área de atuação: " + dados.get("area"),
        "Já trabalha com mega hair, lace ou perucas? " + dados.get("experiencia"),
        "O que busca na mentoria: " + dados.get("objetivo")
      ];
      var cidade = dados.get("cidade");
      if (cidade) { linhas.push("Cidade: " + cidade); }
      var mensagem = dados.get("mensagem");
      if (mensagem) { linhas.push("", mensagem); }
      window.open(waLink(linhas.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Dados vindos da configuração ---------- */
  var ig = document.querySelector("[data-instagram]");
  if (ig && CFG.instagram) {
    ig.setAttribute("href", "https://instagram.com/" + CFG.instagram);
    ig.textContent = "@" + CFG.instagram;
  }

  var endereco = document.querySelector("[data-address]");
  if (endereco && CFG.endereco) { endereco.textContent = CFG.endereco; }

  var horarios = document.querySelector("[data-hours]");
  if (horarios && CFG.horarios) { horarios.textContent = CFG.horarios; }

  var ano = document.querySelector("[data-year]");
  if (ano) { ano.textContent = String(new Date().getFullYear()); }

  /* ---------- Animação de entrada das seções ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ---------- Barra fixa de CTA no mobile (com bounce só na 1ª aparição) ---------- */
  var stickyCta = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  var stickyCtaBounced = false;

  if (stickyCta) {
    stickyCta.addEventListener("animationend", function (e) {
      if (e.animationName === "sticky-bounce") { stickyCta.classList.remove("bounce-once"); }
    });
  }

  if (stickyCta && hero && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      var visible = !entries[0].isIntersecting;
      if (visible && !stickyCtaBounced) {
        stickyCta.classList.add("bounce-once");
        stickyCtaBounced = true;
      }
      stickyCta.classList.toggle("is-visible", visible);
    }, { threshold: 0 });
    ctaObserver.observe(hero);
  } else if (stickyCta) {
    stickyCta.classList.add("is-visible");
  }

  /* ---------- Parallax sutil na textura do hero ---------- */
  if (!prefersReduced && hero) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        var offset = Math.max(-40, Math.min(40, window.scrollY * 0.12));
        hero.style.setProperty("--parallax-y", offset + "px");
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Leve inclinação 3D nos cards, acompanhando o mouse ---------- */
  if (!prefersReduced && window.matchMedia("(hover: hover)").matches) {
    Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (py * -6) + "deg) rotateY(" + (px * 6) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Números dos passos contam de 0 até o valor final ---------- */
  var stepNums = document.querySelectorAll(".step__num");
  if (stepNums.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      /* já mostram o número final no HTML, nada a fazer */
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          var el = entry.target;
          var target = parseInt(el.textContent, 10);
          var start = null;
          var duration = 700;
          function tick(ts) {
            if (start === null) { start = ts; }
            var progress = Math.min(1, (ts - start) / duration);
            var value = Math.round(progress * target);
            el.textContent = value < 10 ? "0" + value : String(value);
            if (progress < 1) { window.requestAnimationFrame(tick); }
          }
          window.requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      }, { threshold: 0.6 });
      Array.prototype.forEach.call(stepNums, function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- Carrossel automático de depoimentos no mobile ---------- */
  var quotesList = document.querySelector(".quotes");
  if (quotesList) {
    var quoteItems = Array.prototype.slice.call(quotesList.children);
    var quoteIndex = 0;
    var quoteTimer = null;
    var carouselOn = false;
    var mqCarousel = window.matchMedia("(max-width: 859px)");

    function goToQuote(i) {
      quoteIndex = (i + quoteItems.length) % quoteItems.length;
      quotesList.style.transform = "translateX(-" + (quoteIndex * 100) + "%)";
    }

    function startCarousel() {
      if (carouselOn) { return; }
      carouselOn = true;
      quotesList.style.display = "flex";
      quoteItems.forEach(function (li) { li.style.flex = "0 0 100%"; });
      quotesList.style.overflow = "hidden";
      goToQuote(0);
      if (!prefersReduced) {
        quoteTimer = window.setInterval(function () { goToQuote(quoteIndex + 1); }, 5000);
        quotesList.addEventListener("mouseenter", pauseCarousel);
        quotesList.addEventListener("mouseleave", resumeCarousel);
        quotesList.addEventListener("focusin", pauseCarousel);
        quotesList.addEventListener("focusout", resumeCarousel);
      }
    }

    function pauseCarousel() { if (quoteTimer) { window.clearInterval(quoteTimer); quoteTimer = null; } }
    function resumeCarousel() {
      if (!quoteTimer && !prefersReduced && carouselOn) {
        quoteTimer = window.setInterval(function () { goToQuote(quoteIndex + 1); }, 5000);
      }
    }

    function stopCarousel() {
      if (!carouselOn) { return; }
      carouselOn = false;
      pauseCarousel();
      quotesList.style.display = "";
      quotesList.style.overflow = "";
      quotesList.style.transform = "";
      quoteItems.forEach(function (li) { li.style.flex = ""; });
    }

    function syncCarousel() {
      if (mqCarousel.matches) { startCarousel(); } else { stopCarousel(); }
    }

    if (quoteItems.length > 1) {
      syncCarousel();
      if (mqCarousel.addEventListener) { mqCarousel.addEventListener("change", syncCarousel); }
    }
  }

})();
