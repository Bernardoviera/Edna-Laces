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

  /* ---------- Barra fixa de CTA no mobile ---------- */
  var stickyCta = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");

  if (stickyCta && hero && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      stickyCta.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { threshold: 0 });
    ctaObserver.observe(hero);
  } else if (stickyCta) {
    stickyCta.classList.add("is-visible");
  }

  /* ---------- Máscara simples de telefone ---------- */
  var telefone = document.getElementById("telefone");
  if (telefone) {
    telefone.addEventListener("input", function () {
      var d = telefone.value.replace(/\D/g, "").slice(0, 11);
      var out = d;
      if (d.length > 6) {
        out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length > 10 ? 7 : 6) +
              "-" + d.slice(d.length > 10 ? 7 : 6);
      } else if (d.length > 2) {
        out = "(" + d.slice(0, 2) + ") " + d.slice(2);
      } else if (d.length > 0) {
        out = "(" + d;
      }
      telefone.value = out;
    });
  }

  /* ---------- Formulário: monta a mensagem e abre o WhatsApp ---------- */
  var form = document.getElementById("form-agendamento");

  function setError(input, message) {
    var field = input.closest(".field");
    var box = document.querySelector('[data-error-for="' + input.id + '"]');
    var invalid = Boolean(message);

    if (field) { field.classList.toggle("is-invalid", invalid); }
    input.setAttribute("aria-invalid", invalid ? "true" : "false");

    if (box) {
      box.textContent = message || "";
      box.hidden = !invalid;
      if (invalid) { box.setAttribute("role", "alert"); }
    }
    return !invalid;
  }

  function validate(input) {
    var value = input.value.trim();

    if (input.id === "nome") {
      if (value.length < 2) { return setError(input, "Escreva seu nome para eu saber como te chamar."); }
      return setError(input, "");
    }

    if (input.id === "telefone") {
      var digits = value.replace(/\D/g, "");
      if (digits.length < 10) { return setError(input, "Informe um WhatsApp válido com DDD."); }
      return setError(input, "");
    }

    return true;
  }

  if (form) {
    ["nome", "telefone"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) { return; }
      /* valida ao sair do campo, não a cada tecla */
      input.addEventListener("blur", function () { validate(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) { validate(input); }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nome = document.getElementById("nome");
      var tel = document.getElementById("telefone");
      var okNome = validate(nome);
      var okTel = validate(tel);

      if (!okNome || !okTel) {
        (okNome ? tel : nome).focus();
        return;
      }

      var objetivo = document.getElementById("objetivo");
      var periodo = document.getElementById("periodo");

      var mensagem =
        "Olá, Edna! Meu nome é " + nome.value.trim() + "." +
        "\nInteresse: " + (objetivo ? objetivo.value : "Lace sob medida") +
        "\nMelhor período: " + (periodo ? periodo.value : "Qualquer horário") +
        "\nMeu WhatsApp: " + tel.value.trim() +
        "\n\nVim pelo site e gostaria de agendar uma avaliação.";

      var status = document.getElementById("form-status");
      if (status) { status.textContent = "Abrindo o WhatsApp com a sua mensagem…"; }

      window.open(waLink(mensagem), "_blank", "noopener");
    });
  }
})();
