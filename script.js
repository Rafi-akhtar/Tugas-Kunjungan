const documentationPhotos = [
  {
    src: "pic1.jpg",
    tag: "Foto 1",
  },
  {
    src: "pic2.jpg",
    tag: "Foto 2",
  },
  {
    src: "pic3.jpg",
    tag: "Foto 3",
  },
  {
    src: "pic4.jpg",
    tag: "Foto 4",
  },
  {
    src: "pic5.jpg",
    tag: "Foto 5",
  },
  {
    src: "pic6.jpg",
    tag: "Foto 6",
  },
  {
    src: "pic7.jpeg",
    tag: "Foto 7",
  }
];

const row1 = document.getElementById('marquee-row-1');
const row2 = document.getElementById('marquee-row-2');
const carouselTrack = document.getElementById('carousel-track');

if (row1 && row2) {
  const marqueeItems = [
    ...documentationPhotos, 
    ...documentationPhotos, 
    ...documentationPhotos, 
    ...documentationPhotos
  ];

  marqueeItems.forEach((item, idx) => {
    const realIndex = idx % documentationPhotos.length;

    const pill1 = document.createElement('div');
    pill1.className = 'doc-pill';
    pill1.innerHTML = `<img src="${item.src}" alt="${item.title}"><div class="doc-pill-badge">Lihat Foto ↗</div>`;
    pill1.onclick = function() { jumpToGallery(realIndex); };
    row1.appendChild(pill1);

    const revIndex = (documentationPhotos.length - 1 - realIndex);
    const revItem = documentationPhotos[revIndex];
    const pill2 = document.createElement('div');
    pill2.className = 'doc-pill';
    pill2.innerHTML = `<img src="${revItem.src}" alt="${revItem.title}"><div class="doc-pill-badge">Lihat Foto ↗</div>`;
    pill2.onclick = function() { jumpToGallery(revIndex); };
    row2.appendChild(pill2);
  });
}

if (carouselTrack) {
  documentationPhotos.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    slide.innerHTML = `
      <img src="${item.src}" alt="${item.title}">
      <div class="slide-overlay">
        <span class="slide-tag">${item.tag}</span>
      </div>
    `;
    slide.onclick = function() { openLightbox(index); };
    carouselTrack.appendChild(slide);
  });
}

let currentSlide = 0;
const totalSlides = documentationPhotos.length;
const slideCounter = document.getElementById('slide-counter');

function updateCarousel() {
  const slides = document.querySelectorAll('.gallery-slide');
  if (!slides.length || !carouselTrack) return;
  const slideWidth = slides[0].offsetWidth + 24;
  const maxIndex = window.innerWidth > 860 ? Math.max(0, totalSlides - 3) : totalSlides - 1;
  if (currentSlide > maxIndex) currentSlide = maxIndex;
  if (currentSlide < 0) currentSlide = 0;

  carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  if (slideCounter) {
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }
}

const prevSlideBtn = document.getElementById('prev-slide');
const nextSlideBtn = document.getElementById('next-slide');

if (prevSlideBtn) {
  prevSlideBtn.addEventListener('click', function() {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    updateCarousel();
  });
}

if (nextSlideBtn) {
  nextSlideBtn.addEventListener('click', function() {
    const maxIndex = window.innerWidth > 860 ? Math.max(0, totalSlides - 3) : totalSlides - 1;
    currentSlide = currentSlide < maxIndex ? currentSlide + 1 : 0;
    updateCarousel();
  });
}

window.addEventListener('resize', updateCarousel);

function jumpToGallery(index) {
  const dokEl = document.getElementById('dokumentasi');
  if (dokEl) {
    dokEl.scrollIntoView({ behavior: 'smooth' });
  }
  currentSlide = index;
  setTimeout(updateCarousel, 350);
}

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
let lbIndex = 0;

function openLightbox(index) {
  if (!lightbox) return;
  lbIndex = index;
  updateLightboxContent();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
    if (!lbImg || !lbTitle) return;

    const item = documentationPhotos[lbIndex];

    lbImg.src = item.src;
    lbTitle.textContent = item.tag;
}

const lbCloseBtn = document.getElementById('lb-close');
const lbPrevBtn = document.getElementById('lb-prev');
const lbNextBtn = document.getElementById('lb-next');

if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);

if (lbPrevBtn) {
  lbPrevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    lbIndex = (lbIndex - 1 + totalSlides) % totalSlides;
    updateLightboxContent();
  });
}

if (lbNextBtn) {
  lbNextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    lbIndex = (lbIndex + 1 + totalSlides) % totalSlides;
    updateLightboxContent();
  });
}

if (lightbox) {
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', function(e) {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    lbIndex = (lbIndex - 1 + totalSlides) % totalSlides;
    updateLightboxContent();
  }
  if (e.key === 'ArrowRight') {
    lbIndex = (lbIndex + 1 + totalSlides) % totalSlides;
    updateLightboxContent();
  }
});

let touchStartX = 0;
if (lightbox) {
  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', function(e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        lbIndex = (lbIndex + 1) % totalSlides;
      } else {
        lbIndex = (lbIndex - 1 + totalSlides) % totalSlides;
      }
      updateLightboxContent();
    }
  });
}

const revealEls = document.querySelectorAll('.reveal');
const navbar = document.getElementById('navbar');
const fungsiSection = document.getElementById('fungsi');

(function scrollAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;


  revealEls.forEach(function (el) {
    if (el.dataset.anim) return;
    const sibs = el.parentElement
      ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'))
      : [el];
    const i = sibs.indexOf(el);
    let anim = 'up';
    if (sibs.length === 2) anim = i === 0 ? 'left' : 'right';
    else if (sibs.length > 2) anim = i % 2 === 0 ? 'zoom' : 'up';
    el.dataset.anim = anim;
    el.style.setProperty('--d', (Math.min(i, 5) * 0.09).toFixed(2) + 's');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const t = entry.target;
        t.classList.add('visible');
        observer.unobserve(t);
        setTimeout(function () { t.style.setProperty('--d', '0s'); }, 1600); // hover tidak ikut delay
      }
    });
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));

  window.addEventListener('load', function () {
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
  });

  if (reduce) {
    revealEls.forEach(el => el.classList.add('visible'));
    window.addEventListener('scroll', function () {
      if (!navbar || !fungsiSection) return;
      navbar.classList.toggle('light-mode', window.scrollY >= fungsiSection.offsetTop - 80);
    }, { passive: true });
    return;
  }

  const bar = document.createElement('div');
  bar.className = 'sa-progress';
  document.body.appendChild(bar);

  const scrubItems = [];
  const skip = '#carousel-track, #lightbox, .lightbox, #navbar, .navbar, .doc-pill, .gallery-slide, .func-card, button, a, footer, [data-scrub="off"]';

  function splitTextNodes(root) {
    const words = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const s = document.createElement('span');
        s.className = 'sa-word';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = part;
        frag.appendChild(s);
        words.push(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return words;
  }

  document.querySelectorAll('[data-scrub], .about-statement, section h1, section h2, section h3, section p, header h1, header p')
    .forEach(function (el) {
      if (el.closest(skip) || !el.textContent.trim() || el.querySelector('svg, img, input, video, canvas')) return;
      if (el.dataset.scrubDone) return;
      el.dataset.scrubDone = '1';
      el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
      const heading = /^H[1-3]$/.test(el.tagName);
      const words = splitTextNodes(el);
      words.forEach(s => { s.style.opacity = heading ? '0' : '0.12'; });
      scrubItems.push({ el, words, heading, p: 0, last: -1, auto: !!el.closest('.hero-section') });
    });

  function updateScrub(H) {
    const atBottom = window.scrollY >= document.documentElement.scrollHeight - H - 2;
    scrubItems.forEach(function (it) {
      const r = it.el.getBoundingClientRect();
      const start = it.heading ? 0.96 : 0.92;
      const end = it.heading ? 0.62 : 0.42;
      let target = clamp((H * start - r.top) / (H * (start - end)));
      if (it.auto || (atBottom && r.top < H)) target = 1; // hero tampil otomatis saat load
      it.p = Math.abs(it.p - target) < 0.002 ? target : lerp(it.p, target, it.auto ? 0.05 : 0.14);
      if (it.p === it.last) return;
      it.last = it.p;
      const n = it.words.length;
      for (let i = 0; i < n; i++) {
        const wp = clamp((it.p * (n + 3) - i) / 3);
        const s = it.words[i].style;
        s.opacity = ((it.heading ? 0 : 0.12) + (it.heading ? 1 : 0.88) * wp).toFixed(3);
        s.filter = wp >= 0.999 ? 'none' : 'blur(' + ((1 - wp) * 8).toFixed(1) + 'px)';
        s.translate = it.heading ? '0 ' + ((1 - wp) * 0.7).toFixed(3) + 'em' : '';
      }
    });
  }

  const hero = document.querySelector('.hero-section, #hero, .hero, section');
  const heroCanvas = document.getElementById('webgl-canvas');
  let heroItems = hero
    ? Array.from(hero.children).filter(function (c) {
        if (c.tagName === 'CANVAS' || c.contains(heroCanvas)) return false;
        const pos = getComputedStyle(c).position;
        return pos !== 'absolute' && pos !== 'fixed';
      })
    : [];
  if (heroItems.length === 1) heroItems = Array.from(heroItems[0].children); // logo, judul, deskripsi, tombol
  const splitCards = hero ? Array.from(hero.querySelectorAll('.split-card')) : [];
  let lastHeroP = -1;

  function updateHero(y) {
    if (!hero) return;
    const p = clamp(y / Math.max(1, hero.offsetHeight));
    if (p === lastHeroP) return;
    lastHeroP = p;
    const active = p > 0.01;
    heroItems.forEach(function (el, i) {
      const s = el.style;
      if (!active) { s.translate = ''; s.opacity = ''; s.scale = ''; s.filter = ''; s.transition = ''; return; }
      s.transition = 'none';
      s.translate = '0 ' + (p * (70 + i * 45)).toFixed(1) + 'px';
      s.opacity = clamp(1 - p * 1.35).toFixed(3);
      s.scale = (1 - p * 0.07).toFixed(3);
      s.filter = p > 0.03 ? 'blur(' + (p * 10).toFixed(1) + 'px)' : 'none';
    });
    splitCards.forEach(function (c, i) { // 3 kepingan logo merenggang saat scroll
      const k = i - 1;
      c.style.translate = active ? (k * p * 80).toFixed(1) + 'px 0' : '';
      c.style.rotate = active ? (k * p * 12).toFixed(1) + 'deg' : '';
    });
    if (heroCanvas) heroCanvas.style.scale = (1 + p * 0.14).toFixed(3);
  }


  const rows = [
    { el: document.getElementById('marquee-row-1'), dir: 1, x: 0 },
    { el: document.getElementById('marquee-row-2'), dir: -1, x: 0 }
  ].filter(r => r.el);

  function updateMarquee(H, vel) {
    const av = Math.abs(vel);
    rows.forEach(function (r) {
      const rect = r.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > H + 200) return;
      const pr = clamp((H - rect.top) / (H + rect.height));
      r.x = lerp(r.x, (pr - 0.5) * 2 * 260 * r.dir, 0.12);
      r.el.style.translate = r.x.toFixed(1) + 'px 0';
      r.el.style.scale = (1 + Math.min(av * 0.006, 0.1)).toFixed(3) + ' 1';
      const blur = Math.min(av * 0.16, 6);
      r.el.style.filter = blur > 0.25 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
    });
  }

  const slides = Array.from(document.querySelectorAll('.gallery-slide'));
  slides.forEach(function (s) {
    const img = s.querySelector('img');
    if (img) img.style.scale = '1.18';
  });

  function updateGallery(W, H) {
    slides.forEach(function (s) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -100 || r.top > H + 100) return;
      const cx = r.left + r.width / 2;
      const d = clamp(Math.abs(cx - W / 2) / (W * 0.75));
      const ent = clamp((H * 0.98 - r.top) / (H * 0.55));
      s.style.scale = (1 - d * 0.1).toFixed(3);
      s.style.rotate = (((cx - W / 2) / W) * 3).toFixed(2) + 'deg';
      s.style.translate = '0 ' + ((1 - ent) * 80).toFixed(1) + 'px';
      s.style.opacity = ((0.35 + 0.65 * ent) * (1 - d * 0.35)).toFixed(3);
      const img = s.querySelector('img');
      if (img) {
        const pv = clamp((r.top + r.height / 2) / H);
        img.style.translate = '0 ' + ((0.5 - pv) * 36).toFixed(1) + 'px';
      }
    });
  }

  const curtainPairs = [['.about-section', '.functions-section'], ['.functions-section', '.gallery-section']]
    .map(function (q) { return { a: document.querySelector(q[0]), b: document.querySelector(q[1]), last: -1 }; })
    .filter(x => x.a && x.b)
    .map(function (x) { x.kids = Array.from(x.a.children); return x; });

  function updateCurtain(H) {
    curtainPairs.forEach(function (pr) {
      const p = clamp(1 - pr.b.getBoundingClientRect().top / H);
      if (p === pr.last) return;
      pr.last = p;
      pr.kids.forEach(function (k) {
        k.style.transformOrigin = '50% 100%';
        k.style.scale = p > 0 ? (1 - p * 0.06).toFixed(3) : '';
        k.style.opacity = p > 0 ? (1 - p * 0.55).toFixed(3) : '';
      });
    });
  }

  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  function updateParallax(H) {
    parallaxEls.forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > H + 100) return;
      const k = parseFloat(el.dataset.parallax) || 0.15;
      el.style.translate = '0 ' + (((r.top + r.height / 2 - H / 2) * -k)).toFixed(1) + 'px';
    });
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counterObs.unobserve(e.target);
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const t0 = performance.now();
      (function tick(now) {
        const k = clamp((now - t0) / 1600);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 4))).toLocaleString('id-ID');
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObs.observe(c));

  if (carouselTrack && carouselTrack.parentElement) {
    let sx = 0, sy = 0;
    const wrap = carouselTrack.parentElement;
    wrap.addEventListener('touchstart', function (e) {
      sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY;
    }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        (dx < 0 ? nextSlideBtn : prevSlideBtn)?.click();
      }
    }, { passive: true });
  }

  let lastY = window.scrollY, vel = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const y = window.scrollY, H = window.innerHeight, W = window.innerWidth;
    const dy = y - lastY;
    lastY = y;
    vel = lerp(vel, dy, 0.12);
    if (Math.abs(vel) < 0.05) vel = 0;

    const max = document.documentElement.scrollHeight - H;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max) : 0).toFixed(4) + ')';

    if (navbar) {
      if (fungsiSection) navbar.classList.toggle('light-mode', y >= fungsiSection.offsetTop - 80);
      if (y > 220 && dy > 4) navbar.classList.add('nav-hidden');
      else if (dy < -4 || y < 120) navbar.classList.remove('nav-hidden');
    }

    window.__scrollY = y;
    window.__scrollVel = vel;
    updateHero(y);
    updateScrub(H);
    updateMarquee(H, vel);
    updateGallery(W, H);
    updateParallax(H);
    updateCurtain(H);
  }
  requestAnimationFrame(frame);
})();


(function initWebGLShader() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Shader error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  const vertexShaderSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = (uv - 0.5) * 2.0;
      p.x *= u_resolution.x / u_resolution.y;

      vec2 m = (u_mouse - 0.5) * 1.4;
      float t = u_time * 0.45 + u_scroll * 2.2;
      float amp = 0.48 + u_scroll * 0.22;

      float wave1 = sin(p.x * (2.2 + u_scroll) + t + m.x) * cos(p.y * 2.0 - t * 0.8 + m.y);
      float wave2 = sin(length(p - m * 0.5) * 3.5 - t * 1.4);
      float d = abs(p.y + wave1 * amp + wave2 * 0.15);
      float ribbon = smoothstep(0.02, 0.28, d);

      float glowLine = clamp(0.022 / (d + 0.018), 0.0, 1.4);

      vec3 baseBlack = vec3(0.028, 0.028, 0.032);
      vec3 darkCrimson = vec3(0.28, 0.02, 0.04);
      vec3 brightRed = vec3(1.0, 0.12, 0.18);

      vec3 color = mix(darkCrimson, baseBlack, ribbon);
      color += brightRed * glowLine * 0.55;

      float vig = 1.0 - smoothstep(0.5, 1.6, length(p));
      color *= (0.45 + 0.55 * vig);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShaderSrc));
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc));
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const resLoc = gl.getUniformLocation(program, 'u_resolution');
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
  const scrollLoc = gl.getUniformLocation(program, 'u_scroll');

  let mouseX = 0.5, mouseY = 0.5, smx = 0.5, smy = 0.5, sScroll = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = 1.0 - (e.clientY / window.innerHeight);
  });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
    canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  let visible = true, running = false;
  const startTime = Date.now();
  function render() {
    if (!visible) { running = false; return; }
    const elapsed = (Date.now() - startTime) * 0.001;
    smx += (mouseX - smx) * 0.06;
    smy += (mouseY - smy) * 0.06;
    sScroll += ((window.scrollY / window.innerHeight) - sScroll) * 0.08;
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, elapsed);
    gl.uniform2f(mouseLoc, smx, smy);
    gl.uniform1f(scrollLoc, sScroll);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  function start() { if (!running) { running = true; render(); } }

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }).observe(canvas);
  start();
})();
