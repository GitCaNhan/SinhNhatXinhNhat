document.addEventListener('DOMContentLoaded', () => {
    const cakeSection = document.getElementById('cakeSection');
    const messagesSection = document.getElementById('messagesSection');
    const charImg = document.getElementById('charImg');
    const storyText = document.getElementById('storyText');
    const storyCursor = document.getElementById('storyCursor');
    const finalControls = document.getElementById('finalControls');
    const replayPage3Btn = document.getElementById('replayPage3Btn');

    const soundCake = document.getElementById('soundCake');
    const soundKeyboard = document.getElementById('soundKeyboard');

    // Hiệu ứng mưa bánh rán và Doraemon khóc hạnh phúc
    if (typeof initRainEffect === 'function') {
        initRainEffect('assets/mua_2_nobg.png', 'assets/mua_5_nobg.png');
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // Bắn pháo hoa Confetti
    function fireConfetti(durationMs = 3500) {
        if (typeof confetti !== 'function') return;
        const animationEnd = Date.now() + durationMs;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            confetti({
                particleCount: 45,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: 0.2 + Math.random() * 0.6, y: 0.3 + Math.random() * 0.3 },
                colors: ['#ff4d94', '#00a0e9', '#ffcc00', '#ff70a6', '#ffd166', '#a0c4ff'],
                zIndex: 2000
            });
        }, 300);
    }

    // Hiệu ứng gõ máy từng chữ kèm âm thanh bàn phím
    function typeText(text, speed = 65) {
        return new Promise((resolve) => {
            if (!storyText) return resolve();
            storyText.textContent = '';
            if (storyCursor) storyCursor.style.display = 'inline-block';

            if (soundKeyboard) {
                soundKeyboard.currentTime = 0;
                soundKeyboard.loop = true;
                const p = soundKeyboard.play();
                if (p) p.catch(() => {});
            }

            let index = 0;
            const timer = setInterval(() => {
                if (index < text.length) {
                    storyText.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(timer);
                    if (soundKeyboard) {
                        soundKeyboard.pause();
                        soundKeyboard.currentTime = 0;
                    }
                    if (storyCursor) {
                        setTimeout(() => {
                            storyCursor.style.display = 'none';
                        }, 500);
                    }
                    resolve();
                }
            }, speed);
        });
    }

    // Đổi ảnh nhân vật với hiệu ứng mượt mà
    async function setCharacter(src, animClass) {
        if (!charImg) return;
        charImg.style.opacity = '0';
        charImg.style.transform = 'scale(0.8)';
        await delay(300);

        charImg.src = src;
        charImg.className = 'character-anim ' + animClass;
        await delay(100);

        charImg.style.opacity = '1';
        charImg.style.transform = 'scale(1)';
        await delay(300);
    }

    // ==================== KỊCH BẢN CHÍNH TRANG 3 ====================
    async function runPage3Timeline() {
        console.log("Bắt đầu kịch bản Bánh sinh nhật & Lời chúc...");

        // 1. Phát nhạc nền bánh sinh nhật
        if (soundCake) {
            soundCake.currentTime = 0;
            soundCake.loop = true;
            const p = soundCake.play();
            if (p) p.catch(() => {});
        }

        // 2. Chờ bánh sinh nhật hoàn thành xuất hiện (khoảng 7.5s)
        await delay(7500);

        // Bắn pháo hoa chúc mừng bánh sinh nhật hoàn tất
        fireConfetti(2500);
        await delay(2500);

        // 3. Thu nhỏ bánh sinh nhật để nhường không gian cho lời chúc
        cakeSection.classList.add('compact');
        await delay(800);

        // Hiện vùng lời chúc
        messagesSection.classList.remove('hidden');
        await delay(50);
        messagesSection.classList.add('visible');
        await delay(600);

        // ----------------------------------------------------
        // LỜI CHÚC 1: Doraemon em bé
        // "là ngày một em bé cute nhất thế giới chào đời"
        // ----------------------------------------------------
        await setCharacter('assets/processed/doremon_em_be.png', 'anim-baby');
        await typeText("là ngày một em bé cute nhất thế giới chào đời", 65);
        await delay(3500);

        // ----------------------------------------------------
        // LỜI CHÚC 2: Doraemon xúc động khóc
        // "được gặp em là điều may mắn và hạnh phúc nhất cuộc đời tui "
        // ----------------------------------------------------
        await setCharacter('assets/processed/doremon_khoc.png', 'anim-crying');
        await typeText("được gặp em là điều may mắn và hạnh phúc nhất cuộc đời tui", 65);
        await delay(3500);

        // ----------------------------------------------------
        // LỜI CHÚC 3: Doraemon hạnh phúc
        // "sinh nhật tuổi 23, chúc em luôn xinh đẹp, vui tươi, hạnh phúc... mong mọi điều tốt đẹp nhất luôn đến với em"
        // ----------------------------------------------------
        await setCharacter('assets/processed/doremon_hanh_phuc.png', 'anim-happy');
        await typeText("sinh nhật tuổi 23, chúc em luôn xinh đẹp, vui tươi, hạnh phúc... mong mọi điều tốt đẹp nhất luôn đến với em ✨", 60);

        // Bắn pháo hoa cao trào kết thúc
        await delay(800);
        fireConfetti(5000);

        // Hiện nút điều khiển xem lại
        await delay(1500);
        finalControls.classList.remove('hidden');
    }

    // Lưu thời gian phát nhạc liên tục vào sessionStorage
    if (soundCake) {
        soundCake.addEventListener('timeupdate', () => {
            sessionStorage.setItem('bgMusicTime', soundCake.currentTime.toString());
        });
    }

    // Nút Tiếp theo chuyển sang trang hoa
    const nextToFlowerBtn = document.getElementById('nextToFlowerBtn');
    if (nextToFlowerBtn) {
        nextToFlowerBtn.addEventListener('click', () => {
            if (soundCake) {
                sessionStorage.setItem('bgMusicTime', soundCake.currentTime.toString());
                sessionStorage.setItem('bgMusicPlaying', 'true');
            }
            window.location.href = 'page4.html';
        });
    }

    // Tự động kích hoạt kịch bản
    runPage3Timeline();

    // Hỗ trợ autoplay nếu trình duyệt cần cử chỉ người dùng
    const enableAudio = () => {
        if (soundCake && soundCake.paused) {
            soundCake.play().catch(() => {});
        }
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('touchstart', enableAudio);
    };
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
});
