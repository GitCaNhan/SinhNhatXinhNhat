function showLetter() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) {
    alert("Vui lòng nhập tên của bạn trước khi gửi!");
    return;
  }

  const greetings = [
    `💖 Nhân ngày 20/10! Chúc ${name} luôn mạnh mẽ, xinh đẹp và hạnh phúc mỗi ngày. 💐`,
    `🌸 Chúc ${name} có một ngày 20/10 thật đặc biệt, tràn ngập tiếng cười và yêu thương! 💕`,
    `🌼 Nhân ngày 20/10, chúc ${name} luôn rạng rỡ, thành công và gặp nhiều niềm vui trong cuộc sống! 🌺`,
    `💐 Gửi tới ${name} lời chúc ấm áp nhất! Mong ${name} luôn được yêu thương và trân trọng như hôm nay. 💖`
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  document.getElementById('input-box').style.display = 'none';
  const envelope = document.getElementById('envelope');
  envelope.style.display = 'block';
  document.getElementById('greeting').textContent = randomGreeting;

  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}

function openLetter() {
  const envelope = document.getElementById('envelope');
  envelope.classList.add('open');
}

function nextPage(e) {
  e.stopPropagation();
  // Chuyển sang trang mà bạn sẽ tự làm
  window.location.href = "20_10_p2.html"; // ← đổi tên nếu bạn dùng file khác
}


// 🌸 Hiệu ứng cánh hoa rơi
function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.style.left = Math.random() * window.innerWidth + 'px';
  petal.style.animationDuration = 5 + Math.random() * 5 + 's';
  petal.style.opacity = Math.random() * 0.7 + 0.3;
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 10000);
}
setInterval(createPetal, 400);


