document.addEventListener("DOMContentLoaded", function() {
    const userLang = navigator.language || navigator.userLanguage;
    const p = document.querySelector('p[translate="yes"]');
    if (p && !userLang.startsWith('en')) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${userLang.split('-')[0]}&dt=t&q=${encodeURIComponent(p.textContent)}`)
            .then(res => res.json())
            .then(data => {
                if (data && data[0] && data[0][0]) {
                    let translated = data[0][0][0];
                    translated = translated.charAt(0).toLowerCase() + translated.slice(1);
                    p.textContent = translated;
                }
            });
    }
});

window.addEventListener('beforeunload', function () {
    localStorage.clear();
    sessionStorage.clear();
});



const pastelPalette = [
  "#ffb3ec", // rosa claro
  "#bdb2ff", // roxo claro
  "#a0c4ff", // azul claro
  "#cdb4db", // lilás
  "#ffc6ff", // rosa pastel
  "#b5ead7", // verde água
  "#f1c0e8", // rosa/lilás
  "#bde0fe", // azul bebê
  "#d0f4de", // verde menta
  "#f3c4fb"  // lavanda
];

document.querySelectorAll('.link a.link-btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    const color = pastelPalette[Math.floor(Math.random() * pastelPalette.length)];
    btn.style.background = color;
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.background = "#202020";
  });
});


// Cursor pesado (inércia)
const cursor = document.createElement('div');
cursor.style.position = 'fixed';
cursor.style.top = '0';
cursor.style.left = '0';
cursor.style.width = '18px';
cursor.style.height = '18px';
cursor.style.borderRadius = '50%';
cursor.style.background = '#fff6';
cursor.style.pointerEvents = 'none';
cursor.style.zIndex = '9999';
cursor.style.transition = 'background 0.2s';
document.body.appendChild(cursor);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
const peso = 0.15; // quanto menor, mais pesado (mais lento)

window.addEventListener('mousemove', e => {
  mouseX = e.clientX - 9; // centraliza o cursor customizado
  mouseY = e.clientY - 9;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * peso;
  cursorY += (mouseY - cursorY) * peso;
  cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const iframe = document.querySelector('iframe');
if (iframe) {
  iframe.addEventListener('mouseenter', () => {
    cursor.style.display = 'none';
  });
  iframe.addEventListener('mouseleave', () => {
    cursor.style.display = 'block';
  });
}




// --- Várias bolinhas livres no viewport ---
const NUM_BALLS = 20;
const balls = [];
const colors = [
  "#ffb3ec", "#bdb2ff", "#a0c4ff", "#cdb4db", "#ffc6ff",
  "#b5ead7", "#f1c0e8", "#bde0fe", "#d0f4de", "#f3c4fb"
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < NUM_BALLS; i++) {
  const ball = document.createElement('div');
  ball.style.position = 'fixed';
  ball.style.width = rand(24, 40) + 'px'; // tamanho aleatório
  ball.style.height = ball.style.width;
  ball.style.borderRadius = '50%';
  ball.style.background = colors[Math.floor(Math.random() * colors.length)] + Math.floor(rand(16, 64)).toString(16); // transparência aleatória
  ball.style.boxShadow = `0 2px 12px ${colors[Math.floor(Math.random() * colors.length)]}${Math.floor(rand(8, 32)).toString(16)}`;
  ball.style.zIndex = Math.floor(rand(1, 4)); // z-index aleatório
  ball.style.left = rand(0, window.innerWidth - 40) + 'px';
  ball.style.top = rand(0, window.innerHeight - 40) + 'px';
  document.body.appendChild(ball);

  balls.push({
    el: ball,
    x: rand(0, window.innerWidth - 40),
    y: rand(0, window.innerHeight - 40),
    vx: rand(-1.5, 1.5), // velocidade inicial aleatória
    vy: rand(-1.5, 1.5),
    gravity: rand(0.05, 0.25), // gravidade aleatória
    bounce: rand(0.15, 0.7),   // bounce aleatório
    maxHeight: rand(0.5, 1.5)  // altura máxima aleatória
  });
}

function animateBalls() {
  for (const b of balls) {
    b.vy += b.gravity;
    b.x += b.vx;
    b.y += b.vy;

    // Quica nas laterais
    if (b.x < 0) {
      b.x = 0;
      b.vx *= -b.bounce * rand(0.7, 1.3); // bounce lateral aleatório
    }
    if (b.x > window.innerWidth - parseInt(b.el.style.width)) {
      b.x = window.innerWidth - parseInt(b.el.style.width);
      b.vx *= -b.bounce * rand(0.7, 1.3);
    }
    // Quica no topo
    if (b.y < 0) {
      b.y = 0;
      b.vy *= -b.bounce * rand(0.7, 1.3);
    }
    // Quica no fundo, altura máxima diferente para cada bola
    if (b.y > window.innerHeight - parseInt(b.el.style.height)) {
      b.y = window.innerHeight - parseInt(b.el.style.height);
      b.vy = -Math.abs(b.vy) * b.bounce * b.maxHeight * rand(0.7, 1.3);
      if (Math.abs(b.vy) < 0.1) b.vy = 0;
    }

    b.el.style.left = b.x + 'px';
    b.el.style.top = b.y + 'px';
  }
  requestAnimationFrame(animateBalls);
}
animateBalls();

// Impulso nas bolinhas ao rolar a página (aleatoriedade ampliada)
let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const delta = window.scrollY - lastScroll;
  lastScroll = window.scrollY;
  balls.forEach(b => {
    // Impulso vertical e horizontal bem mais forte e aleatório
    const impulso = rand(-1.5, 1.5) * -delta * rand(0.05, 0.18);
    b.vy += impulso;
    b.vx += rand(-1, 1) * Math.abs(delta) * rand(0.03, 0.2);
  });
});

// Responsivo ao redimensionar
window.addEventListener('resize', () => {
  balls.forEach(b => {
    const w = parseInt(b.el.style.width);
    const h = parseInt(b.el.style.height);
    if (b.x > window.innerWidth - w) b.x = window.innerWidth - w;
    if (b.y > window.innerHeight - h) b.y = window.innerHeight - h;
  });
});

// Timer sequencial para pulo de cada bola (3 segundos entre cada pulo, pulo aleatório)
let currentBall = 0;
setInterval(() => {
  const b = balls[currentBall];
  // Só pula se estiver no chão
  const h = parseInt(b.el.style.height);
  if (b.y >= window.innerHeight - h - 1) {
    b.vy = -rand(4, 12); // pulo aleatório
    b.vx += rand(-2, 2); // impulso lateral aleatório
  }
  currentBall = (currentBall + 1) % balls.length;
}, 3000); // 3 segundos entre cada pulo