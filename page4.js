document.addEventListener('DOMContentLoaded', () => {
    // 1. Kích hoạt hiệu ứng hoa nở ngay khi tải trang
    document.body.classList.remove('container');

    const bottomSection = document.getElementById('bottomSection');
    const bottomText = document.getElementById('bottomText');
    const bottomCursor = document.getElementById('bottomCursor');
    const nextStepContainer = document.getElementById('nextStepContainer');
    const nextPage4Btn = document.getElementById('nextPage4Btn');

    const soundBg = document.getElementById('soundBg');
    const soundKeyboard = document.getElementById('soundKeyboard');

    // Hiệu ứng mưa bánh rán và Doraemon GIF ăn bánh rán
    if (typeof initRainEffect === 'function') {
        initRainEffect('assets/mua_1_nobg.png', 'assets/mua_4_nobg.gif');
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // ==================== PHÁT TIẾP TỤC NHẠC NỀN TỪ TRANG 3 ====================
    function initContinuousMusic() {
        if (window.SoundMaster) {
            window.SoundMaster.playBgMusic('assets/sound_cake.mp3');
            return;
        }
        if (!soundBg) return;

        soundBg.loop = true;
        const savedTimeStr = sessionStorage.getItem('bgMusicTime');
        const savedTime = savedTimeStr ? parseFloat(savedTimeStr) : 0;

        const applyAndPlay = () => {
            if (!isNaN(savedTime) && savedTime > 0) {
                try {
                    soundBg.currentTime = savedTime;
                } catch (err) {
                    console.warn("Không thể gán currentTime ngay lập tức:", err);
                }
            }
            const playPromise = soundBg.play();
            if (playPromise) {
                playPromise.then(() => {
                    console.log("Nhạc đang phát tiếp tục từ giây:", soundBg.currentTime);
                }).catch((err) => {
                    console.log("Trình duyệt chờ cử chỉ chạm để phát nhạc:", err);
                });
            }
        };

        if (soundBg.readyState >= 1) {
            applyAndPlay();
        } else {
            soundBg.addEventListener('loadedmetadata', applyAndPlay, { once: true });
            applyAndPlay();
        }

        // Cập nhật liên tục thời gian phát nhạc vào sessionStorage
        soundBg.addEventListener('timeupdate', () => {
            sessionStorage.setItem('bgMusicTime', soundBg.currentTime.toString());
        });
    }


    // ==================== HIỆU ỨNG GÕ PHÍM KÈM ÂM THANH ====================
    function typeText(targetEl, cursorEl, text, speed = 65) {
        return new Promise((resolve) => {
            if (!targetEl) return resolve();
            targetEl.textContent = '';
            if (cursorEl) cursorEl.style.display = 'inline-block';

            if (soundKeyboard) {
                if (window.SoundMaster) {
                    window.SoundMaster.playSfx(soundKeyboard, true);
                } else {
                    soundKeyboard.currentTime = 0;
                    soundKeyboard.loop = true;
                    const p = soundKeyboard.play();
                    if (p) p.catch(() => {});
                }
            }

            let index = 0;
            const timer = setInterval(() => {
                if (index < text.length) {
                    targetEl.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(timer);
                    if (soundKeyboard) {
                        if (window.SoundMaster) {
                            window.SoundMaster.stopSfx(soundKeyboard);
                        } else {
                            soundKeyboard.pause();
                            soundKeyboard.currentTime = 0;
                        }
                    }
                    if (cursorEl) {
                        setTimeout(() => {
                            cursorEl.style.display = 'none';
                        }, 500);
                    }
                    resolve();
                }
            }, speed);
        });
    }

    // ==================== KỊCH BẢN CHÍNH TRANG 4 ====================
    // HOA NỞ TOÀN BỘ TRƯỚC -> SAU ĐÓ MỚI CHẠY CHỮ & LỜI THOẠI
    async function runPage4Timeline() {
        console.log("Hoa đang nở rực rỡ ở giữa màn hình...");

        // Bật nhạc nền tiếp tục từ trang trước
        initContinuousMusic();

        // 1. Chờ hoa nở rộ hoàn toàn (5.0 giây - toàn bộ hoa, cành lá, cỏ và đốm sáng nở hết)
        // Trong suốt thời gian này, không có chữ hay khung thoại nào che khuất hoa
        await delay(5000);

        // 2. Sau khi hoa nở xong, xuất hiện khung thoại Doraemon làm nũng ở phía dưới
        if (bottomSection) {
            bottomSection.classList.remove('hidden');
            // Kích hoạt animation slide-up và fade-in
            void bottomSection.offsetWidth;
            bottomSection.classList.add('visible');
        }
        await delay(600);

        // 3. Chạy chữ gõ máy kèm âm thanh bàn phím:
        // "quá nhiều điều tui muốn nói, nhưng chắc em hiểu mình mà"
        await typeText(bottomText, bottomCursor, "quá nhiều điều tui muốn nói, nhưng chắc em hiểu mình mà 💖", 65);

        // 4. Xuất hiện nút "Tiếp theo ➔"
        await delay(800);

        if (nextStepContainer) {
            nextStepContainer.classList.remove('hidden');
        }
    }

    // Sự kiện khi bấm nút "Tiếp theo ➔" chuyển sang trang vẽ Bánh sinh nhật khổng lồ
    if (nextPage4Btn) {
        nextPage4Btn.addEventListener('click', () => {
            if (typeof window.navigateTo === 'function') {
                window.navigateTo('page5.html');
            } else {
                if (soundBg) {
                    sessionStorage.setItem('bgMusicTime', soundBg.currentTime.toString());
                }
                window.location.href = 'page5.html';
            }
        });
    }

    // Kích hoạt kịch bản trang 4
    runPage4Timeline();

    // Hỗ trợ autoplay nếu trình duyệt chặn phát âm thanh tự động
    const enableAudio = () => {
        if (soundBg && soundBg.paused) {
            const savedTime = parseFloat(sessionStorage.getItem('bgMusicTime') || '0');
            if (!isNaN(savedTime) && savedTime > 0 && Math.abs(soundBg.currentTime - savedTime) > 2) {
                try { soundBg.currentTime = savedTime; } catch (e) {}
            }
            soundBg.play().catch(() => {});
        }
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('touchstart', enableAudio);
    };
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
});
