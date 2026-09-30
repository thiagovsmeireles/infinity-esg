/* ============================================================
   INFINITY ESG — interações (vanilla, leve, sem libs)
   © Thiago Vinicius de Souza Meireles — Todos os direitos reservados.
   Uso, cópia ou redistribuição sem autorização é proibida.
   header blur · menu fullscreen · reveals · parallax hero ·
   contadores · jornada sticky · chain tabs · serviços hover ·
   mapa · cursor custom · botões magnéticos · formulário
   ============================================================ */
(function(){
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll ---------- */
  var header = document.querySelector("[data-header]");
  function onScrollHeader(){
    if(!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, {passive:true});
  onScrollHeader();

  /* ---------- Menu mobile fullscreen ---------- */
  var burger = document.querySelector("[data-burger]");
  if(burger){
    burger.addEventListener("click", function(){
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function(a){
      a.addEventListener("click", function(){ document.body.classList.remove("menu-open"); });
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") document.body.classList.remove("menu-open");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var rvEls = document.querySelectorAll(".rv,.rv-l,.rv-r,.rv-scale");
  if("IntersectionObserver" in window && !prefersReduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
    rvEls.forEach(function(el){ io.observe(el); });
  } else {
    rvEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---------- Parallax sutil do hero (WOW #1) ---------- */
  var heroImg = document.querySelector("[data-hero-img]");
  var heroInner = document.querySelector("[data-hero-inner]");
  if(heroImg && !prefersReduced){
    var ticking = false;
    window.addEventListener("scroll", function(){
      if(ticking) return; ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if(y < window.innerHeight * 1.2){
          heroImg.style.transform = "scale(1.08) translateY(" + (y * .12) + "px)";
          if(heroInner){ heroInner.style.transform = "translateY(" + (y * -.06) + "px)"; heroInner.style.opacity = Math.max(0, 1 - y/(window.innerHeight*.85)); }
        }
        ticking = false;
      });
    }, {passive:true});
  }

  /* ---------- Contadores (WOW #3) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1600, start = null;
    function fmt(n){
      return n.toLocaleString("pt-BR", {maximumFractionDigits:0});
    }
    if(prefersReduced){ el.textContent = fmt(target); return; }
    function frame(ts){
      if(!start) start = ts;
      var p = Math.min(1, (ts-start)/dur);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = fmt(target * eased);
      if(p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if("IntersectionObserver" in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ animateCount(en.target); cio.unobserve(en.target); }
      });
    }, {threshold:.4});
    counters.forEach(function(c){ cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Chain tabs (problema) ---------- */
  var chainBtns = document.querySelectorAll("[data-chain-btn]");
  var chainImgs = document.querySelectorAll("[data-chain-img]");
  chainBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      chainBtns.forEach(function(b){ b.setAttribute("aria-selected","false"); });
      btn.setAttribute("aria-selected","true");
      var key = btn.getAttribute("data-chain-btn");
      chainImgs.forEach(function(img){
        img.classList.toggle("off", img.getAttribute("data-chain-img") !== key);
      });
    });
  });

  /* ---------- Jornada sticky (WOW #2) ---------- */
  var steps = document.querySelectorAll("[data-step]");
  var jImgs = document.querySelectorAll("[data-jimg]");
  var jBar = document.querySelector("[data-jbar]");
  function journeyUpdate(){
    if(!steps.length) return;
    var current = 0;
    steps.forEach(function(st, i){
      var r = st.getBoundingClientRect();
      if(r.top < window.innerHeight * .6) current = i;
    });
    steps.forEach(function(st, i){ st.classList.toggle("on", i === current); });
    jImgs.forEach(function(im){ im.classList.toggle("on", im.getAttribute("data-jimg") === steps[current].getAttribute("data-step")); });
    if(jBar) jBar.style.width = ((current+1)/steps.length*100) + "%";
  }
  if(steps.length){
    window.addEventListener("scroll", journeyUpdate, {passive:true});
    journeyUpdate();
  }

  /* ---------- Serviços: preview flutuante ---------- */
  var preview = document.querySelector("[data-svc-preview]");
  var previewImg = preview ? preview.querySelector("img") : null;
  if(preview && window.matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".svc[data-img]").forEach(function(svc){
      svc.addEventListener("mouseenter", function(){
        previewImg.src = svc.getAttribute("data-img");
        preview.classList.add("on");
      });
      svc.addEventListener("mousemove", function(e){
        preview.style.left = (e.clientX + 24) + "px";
        preview.style.top = (e.clientY - 100) + "px";
      });
      svc.addEventListener("mouseleave", function(){ preview.classList.remove("on"); });
      /* teclado: preview não é essencial, só realça */
      svc.addEventListener("focus", function(){ previewImg.src = svc.getAttribute("data-img"); preview.classList.add("on"); });
      svc.addEventListener("blur", function(){ preview.classList.remove("on"); });
    });
  }

  /* ---------- Mapa: unidades ---------- */
  var units = document.querySelectorAll("[data-unit]");
  units.forEach(function(u){
    u.addEventListener("click", function(){
      var open = u.getAttribute("aria-expanded") === "true";
      units.forEach(function(x){ x.setAttribute("aria-expanded","false"); });
      u.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* ---------- Cursor customizado ---------- */
  if(window.matchMedia("(hover:hover) and (pointer:fine)").matches && !prefersReduced){
    var cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden","true");
    document.body.appendChild(cur);
    var cx=0, cy=0, tx=0, ty=0;
    document.addEventListener("mousemove", function(e){ tx=e.clientX; ty=e.clientY; });
    (function loop(){
      cx += (tx-cx)*.2; cy += (ty-cy)*.2;
      cur.style.transform = "translate(" + (cx) + "px," + (cy) + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,.svc,.unit,button").forEach(function(el){
      el.addEventListener("mouseenter", function(){ cur.classList.add("big"); });
      el.addEventListener("mouseleave", function(){ cur.classList.remove("big"); });
    });
  }

  /* ---------- Botões magnéticos ---------- */
  if(window.matchMedia("(hover:hover)").matches && !prefersReduced){
    document.querySelectorAll(".btn-primary").forEach(function(btn){
      btn.addEventListener("mousemove", function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) * .12;
        var y = (e.clientY - r.top - r.height/2) * .18;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", function(){ btn.style.transform = ""; });
    });
  }

  /* ---------- Formulário premium (sem backend real) ---------- */
  /* Configure o endpoint real aqui. Ex.: "https://formspree.io/f/SEU-ID" */
  var FORM_ENDPOINT = (document.querySelector("[data-form-endpoint]") || {}).getAttribute?.("data-form-endpoint") || "";
  var form = document.querySelector("[data-contact-form]");
  if(form){
    var status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function(f){
        var wrap = f.closest(".field");
        var bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        if(wrap) wrap.classList.toggle("invalid", bad);
        if(bad) valid = false;
      });
      if(!valid){
        status.className = "form-status bad";
        status.textContent = "Confira os campos destacados e tente novamente.";
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = "ENVIANDO…";
      function done(ok){
        btn.disabled = false; btn.textContent = "SOLICITAR CONTATO";
        status.className = "form-status " + (ok ? "ok" : "bad");
        status.textContent = ok
          ? "Recebido! Nossa equipe retorna em breve. (Demonstração — conecte o endpoint real no atributo data-form-endpoint.)"
          : "Não foi possível enviar agora. Tente novamente em instantes.";
        if(ok) form.reset();
      }
      if(FORM_ENDPOINT){
        fetch(FORM_ENDPOINT, {method:"POST", body:new FormData(form), headers:{Accept:"application/json"}})
          .then(function(r){ done(r.ok); })
          .catch(function(){ done(false); });
      } else {
        setTimeout(function(){ done(true); }, 900);
      }
    });
  }

  /* ---------- Ano dinâmico ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* ---------- Anti-cópia (dissuasão para link de demonstração) ---------- */
  /* NOTA: nada no front-end impede clonagem por curl/devtools avançado.
     Isso bloqueia cópia casual (botão direito, arrastar, atalhos) e o
     acesso real é controlado pelo link temporário no servidor. */
  (function guard(){
    document.body.classList.add("protected");
    var tag = document.createElement("div");
    tag.id = "demo-tag"; tag.textContent = "PRÉVIA · DEMONSTRAÇÃO";
    document.body.appendChild(tag);
    var overlay = document.createElement("div");
    overlay.id = "demo-guard";
    overlay.innerHTML = "<div><h2>Visualização protegida</h2><p>Esta prévia é para avaliação. Para o projeto final, fale com o responsável pelo desenvolvimento.</p></div>";
    document.body.appendChild(overlay);

    document.addEventListener("contextmenu", function(e){ e.preventDefault(); });
    document.addEventListener("dragstart", function(e){ e.preventDefault(); });
    document.addEventListener("copy", function(e){ e.preventDefault(); });
    document.addEventListener("cut", function(e){ e.preventDefault(); });
    document.addEventListener("keydown", function(e){
      var k = (e.key || "").toLowerCase();
      if(e.key === "F12"){ e.preventDefault(); return; }
      if((e.ctrlKey || e.metaKey) && ["u","s","p","c","j","i"].indexOf(k) > -1){ e.preventDefault(); return; }
      if(e.ctrlKey && e.shiftKey && ["i","j","c","k"].indexOf(k) > -1){ e.preventDefault(); }
    });
    /* PrintScreen: apaga a tela por 1s como dissuasão */
    document.addEventListener("keyup", function(e){
      if(e.key === "PrintScreen"){
        overlay.classList.add("on");
        setTimeout(function(){ overlay.classList.remove("on"); }, 1000);
      }
    });
    /* DevTools aberto (heurística por resize): exibe aviso */
    var warned = false;
    setInterval(function(){
      if(warned) return;
      var open = (window.outerWidth - window.innerWidth > 220) || (window.outerHeight - window.innerHeight > 220);
      if(open){ warned = true; overlay.classList.add("on"); }
    }, 1500);
  })();
})();
