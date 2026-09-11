document.addEventListener('DOMContentLoaded', () => {
    // Các phần tử DOM
    const topHeader = document.getElementById('topHeader');
    const typewriterText = document.getElementById('typewriterText');
    const typewriterCursor = document.getElementById('typewriterCursor');
    const finalBanner = document.getElementById('finalBanner');
    const replayBtn = document.getElementById('replayBtn');
    const treasureAura = document.getElementById('treasureAura');
    const sparklesContainer = document.getElementById('sparkles');

    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    const card3 = document.getElementById('card3');
    const card4 = document.getElementById('card4');
    const card5 = document.getElementById('card5');
    const card6 = document.getElementById('card6');

    const dots1 = document.getElementById('dots1');
    const dots2 = document.getElementById('dots2');

    const audioKeyboard = document.getElementById('audioKeyboard');
    const audio1 = document.getElementById('audio1');
    const audio2 = document.getElementById('audio2');
    const audio3 = document.getElementById('audio3');
    const audio6 = document.getElementById('audio6');

    // Hiệu ứng mưa bánh rán và Doraemon ôm bánh rán rơi nhẹ nhàng
    if (typeof initRainEffect === 'function') {
        initRainEffect('assets/mua_1_nobg.png', 'assets/mua_3_nobg.png');
    }

    const INTRO_TEXT = "Hello người đẹp, hôm nay là ngày gì vậy nhỉiii ?";
    let isRunning = false;

    // Tạo các hạt sao lấp lánh cho hào quang bảo bối
    function initSparkles() {
        if (!sparklesContainer) return;
        sparklesContainer.innerHTML = '';
        const symbols = ['✨', '⭐', '🌟', '💫', '💖', '✨'];
        for (let i = 0; i < 14; i++) {
            const span = document.createElement('span');
            span.className = 'sparkle-star';
            span.textContent = symbols[i % symbols.length];
            const angle = (i / 14) * 2 * Math.PI;
            const dist = 140 + Math.random() * 90;
            const x = 50 + (Math.cos(angle) * dist) / 6;
            const y = 50 + (Math.sin(angle) * dist) / 6;
            span.style.left = `${x}%`;
            span.style.top = `${y}%`;
            span.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
            span.style.fontSize = `${(1 + Math.random() * 0.8).toFixed(1)}rem`;
            sparklesContainer.appendChild(span);
        }
    }

    // Phát audio với Promise hoàn thành khi bài phát xong (tích hợp SoundMaster mở khóa di động)
    function playAudio(audioEl) {
        if (window.SoundMaster) {
            return window.SoundMaster.playSfx(audioEl);
        }
        return new Promise((resolve) => {
            if (!audioEl) return resolve();
            audioEl.currentTime = 0;

            let resolved = false;
            const cleanup = () => {
                if (!resolved) {
                    resolved = true;
                    audioEl.removeEventListener('ended', cleanup);
                    audioEl.removeEventListener('error', cleanup);
                    resolve();
                }
            };

            audioEl.addEventListener('ended', cleanup);
            audioEl.addEventListener('error', cleanup);

            const playPromise = audioEl.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('Audio play prevented or failed:', err);
                    cleanup();
                });
            }
        });
    }

    // Dừng tất cả âm thanh
    function stopAllAudio() {
        [audioKeyboard, audio1, audio2, audio3, audio6].forEach(a => {
            if (a) {
                a.pause();
                a.currentTime = 0;
            }
        });
    }

    // Hiệu ứng gõ chữ typewriter từng ký tự kèm âm thanh gõ bàn phím
    function typeIntroText(text, speed = 65) {
        return new Promise((resolve) => {
            if (!typewriterText) return resolve();
            typewriterText.textContent = '';
            if (typewriterCursor) typewriterCursor.style.display = 'inline-block';

            // Bật âm thanh bàn phím lặp lại trong lúc gõ
            if (audioKeyboard) {
                if (window.SoundMaster) {
                    window.SoundMaster.playSfx(audioKeyboard, true);
                } else {
                    audioKeyboard.currentTime = 0;
                    audioKeyboard.loop = true;
                    const p = audioKeyboard.play();
                    if (p) p.catch(() => {});
                }
            }

            let index = 0;
            const timer = setInterval(() => {
                if (index < text.length) {
                    typewriterText.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(timer);
                    // Dừng âm thanh bàn phím khi gõ xong
                    if (audioKeyboard) {
                        if (window.SoundMaster) {
                            window.SoundMaster.stopSfx(audioKeyboard);
                        } else {
                            audioKeyboard.pause();
                            audioKeyboard.currentTime = 0;
                        }
                    }
                    if (typewriterCursor) {
                        setTimeout(() => {
                            typewriterCursor.style.display = 'none';
                        }, 500);
                    }
                    resolve();
                }
            }, speed);
        });
    }

    // Chạy hiệu ứng dấu '...' ở góc dưới bên phải (mỗi chấm cách 0.3s, lặp lại 2 lần)
    function runDots(dotsEl, cycles = 2, intervalMs = 300) {
        return new Promise((resolve) => {
            if (!dotsEl) return resolve();
            dotsEl.classList.remove('hidden-done');
            dotsEl.classList.add('active');
            const dots = dotsEl.querySelectorAll('.dot');
            
            let currentCycle = 0;
            let step = 0; // 0, 1, 2

            const clear = () => dots.forEach(d => d.classList.remove('lit'));
            clear();

            const timer = setInterval(() => {
                if (step < 3) {
                    dots[step].classList.add('lit');
                    step++;
                } else {
                    currentCycle++;
                    clear();
                    step = 0;
                    if (currentCycle >= cycles) {
                        clearInterval(timer);
                        setTimeout(() => {
                            resolve();
                        }, 250);
                    }
                }
            }, intervalMs);
        });
    }

    // Bắn pháo hoa confetti
    function fireConfettiCelebration() {
        if (typeof confetti !== 'function') return;
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            confetti({
                particleCount: 40,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.4 },
                colors: ['#ff4d94', '#00a0e9', '#ffcc00', '#70d6ff', '#ff70a6', '#ffd166'],
                zIndex: 2000
            });
        }, 350);
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // Đặt lại toàn bộ trạng thái
    function resetTimeline() {
        stopAllAudio();
        [card1, card2, card3, card4, card5, card6].forEach(c => {
            if (c) c.classList.remove('visible', 'fade-out', 'center-stage');
        });
        if (dots1) {
            dots1.classList.remove('active');
            dots1.classList.remove('hidden-done');
        }
        if (dots2) {
            dots2.classList.remove('active');
            dots2.classList.remove('hidden-done');
        }
        if (treasureAura) treasureAura.classList.remove('active');
        if (topHeader) topHeader.classList.remove('fade-out');
        if (finalBanner) finalBanner.classList.add('hidden');
        if (typewriterText) typewriterText.textContent = '';
    }

    // ==================== KỊCH BẢN CHÍNH (TIMELINE) ====================
    async function startTimeline() {
        if (isRunning) return;
        isRunning = true;
        resetTimeline();

        console.log("Bắt đầu mở màn với text gõ bàn phím...");

        // ----------------------------------------------------
        // BƯỚC 0: TEXT MỞ BÀI DẠNG TYPEWRITER KÈM SOUND KEYBOARD
        // "hello người đẹp, hôm nay là ngày gì vậy nhỉiii ?"
        // ----------------------------------------------------
        await delay(300);
        await typeIntroText(INTRO_TEXT, 65);
        // Tạm dừng một chút để người xem kịp đọc câu hỏi
        await delay(700);

        // ----------------------------------------------------
        // BƯỚC 1: ẢNH 1
        // Hiện ảnh 1 + phát sound ảnh 1 + dấu '...' góc dưới bên phải chạy 2 lần
        // ----------------------------------------------------
        card1.classList.add('visible');
        const pAudio1 = playAudio(audio1);
        await delay(200);
        const pDots1 = runDots(dots1, 2, 300);
        await Promise.all([pAudio1, pDots1]);
        await delay(300);

        // ----------------------------------------------------
        // BƯỚC 2: ẢNH 2
        // Khi hiện ảnh tiếp theo thì dấu chấm của ảnh 1 BIẾN MẤT
        // Hiện ảnh 2 + phát sound ảnh 2 + dấu '...' góc dưới bên phải chạy 2 lần
        // ----------------------------------------------------
        dots1.classList.remove('active');
        dots1.classList.add('hidden-done'); // Dấu chấm biến mất

        card2.classList.add('visible');
        const pAudio2 = playAudio(audio2);
        await delay(200);
        const pDots2 = runDots(dots2, 2, 300);
        await Promise.all([pAudio2, pDots2]);
        await delay(300);

        // ----------------------------------------------------
        // BƯỚC 3: ẢNH 3
        // Dấu chấm của ảnh 2 BIẾN MẤT
        // Hiện ảnh 3 + phát sound ảnh 3 (không chạy '...')
        // ----------------------------------------------------
        dots2.classList.remove('active');
        dots2.classList.add('hidden-done'); // Dấu chấm biến mất

        card3.classList.add('visible');
        const pAudio3 = playAudio(audio3);
        await pAudio3;
        await delay(400);

        // ----------------------------------------------------
        // BƯỚC 4: ẢNH 4
        // Hiện ảnh 4 (không cần nhạc)
        // ----------------------------------------------------
        card4.classList.add('visible');
        await delay(900);

        // ----------------------------------------------------
        // BƯỚC 5: ẢNH 5
        // Tiếp tục hiện ảnh 5
        // ----------------------------------------------------
        card5.classList.add('visible');
        await delay(900);

        // ----------------------------------------------------
        // BƯỚC 6: ẢNH 6 (BẢO BỐI DORAEMON)
        // - Hiện ảnh 6 cùng các tia sáng hào quang bảo bối Doraemon
        // - Các ảnh 1-5 và text mở bài mờ dần
        // - Ảnh 6 phóng to dần ra giữa màn hình khớp với sound ảnh 6
        // ----------------------------------------------------
        card6.classList.add('visible');
        
        // Bật âm thanh bảo bối Doraemon
        const pAudio6 = playAudio(audio6);

        // Bật hào quang bảo bối xoay tròn
        initSparkles();
        treasureAura.classList.add('active');

        // Làm mờ các ảnh 1, 2, 3, 4, 5 và thanh text
        [card1, card2, card3, card4, card5].forEach(c => c.classList.add('fade-out'));
        topHeader.classList.add('fade-out');

        // Phóng to và di chuyển ảnh 6 ra chính giữa màn hình
        await delay(250);
        card6.classList.add('center-stage');

        // Chờ âm thanh 6 tiếp tục ngân vang và hoàn tất
        await delay(1200);
        await pAudio6;

        // Hiện banner lời chúc và các nút điều khiển
        finalBanner.classList.remove('hidden');
        isRunning = false;
    }

    // Sự kiện nút Tiếp theo sang trang bánh sinh nhật
    const nextToCakeBtn = document.getElementById('nextToCakeBtn');
    if (nextToCakeBtn) {
        nextToCakeBtn.addEventListener('click', () => {
            stopAllAudio();
            // Khởi động nhạc bánh sinh nhật ngay tức thì trong cử chỉ click trực tiếp của người dùng
            if (window.SoundMaster) {
                window.SoundMaster.playBgMusic('assets/sound_cake.mp3');
            }
            if (typeof window.navigateTo === 'function') {
                window.navigateTo('page3.html');
            } else {
                sessionStorage.setItem('bgMusicPlaying', 'true');
                sessionStorage.setItem('bgMusicTime', '0');
                window.location.href = 'page3.html';
            }
        });
    }

    // Sự kiện nút Xem lại (nếu có)
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            startTimeline();
        });
    }

    // Tự động kích hoạt ngay khi tải trang (không cần qua bất kỳ trang/modal mở quà nào)
    startTimeline();

    // Để đề phòng trình duyệt yêu cầu tương tác đầu tiên để kích hoạt audio:
    // Thêm listener 1 lần cho click/touch bất kỳ đâu nếu audio ban đầu bị chặn
    const enableAudioOnGesture = () => {
        if (audioKeyboard && audioKeyboard.paused && isRunning) {
            audioKeyboard.play().catch(() => {});
        }
        window.removeEventListener('click', enableAudioOnGesture);
        window.removeEventListener('touchstart', enableAudioOnGesture);
    };
    window.addEventListener('click', enableAudioOnGesture, { once: true });
    window.addEventListener('touchstart', enableAudioOnGesture, { once: true });
});
