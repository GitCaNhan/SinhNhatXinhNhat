document.addEventListener('DOMContentLoaded', () => {
    const magicPencil = document.getElementById('magicPencil');
    const paperCard = document.querySelector('.sketch-paper-canvas') || document.querySelector('.sketch-paper-card');
    const bgMusic = document.getElementById('bgMusic');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Hiệu ứng mưa cặp bánh rán và Doraemon ôm bánh rán
    if (typeof initRainEffect === 'function') {
        initRainEffect('assets/mua_2_nobg.png', 'assets/mua_3_nobg.png');
    }

    // ==================== NHẠC NỀN LIÊN TỤC TỪ CÁC TRANG TRƯỚC ====================
    function initContinuousMusic() {
        if (window.SoundMaster) {
            window.SoundMaster.playBgMusic('assets/sound_cake.mp3');
            return;
        }
        if (!bgMusic) return;
        bgMusic.loop = true;

        const savedTimeStr = sessionStorage.getItem('bgMusicTime');
        const savedTime = savedTimeStr ? parseFloat(savedTimeStr) : 0;

        const applyPlay = () => {
            if (!isNaN(savedTime) && savedTime > 0) {
                try {
                    bgMusic.currentTime = savedTime;
                } catch (e) {}
            }
            const p = bgMusic.play();
            if (p) p.catch(() => {});
        };

        if (bgMusic.readyState >= 1) {
            applyPlay();
        } else {
            bgMusic.addEventListener('loadedmetadata', applyPlay, { once: true });
            applyPlay();
        }

        bgMusic.addEventListener('timeupdate', () => {
            sessionStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
        });
    }

    // ==================== CHUẨN BỊ VÀ THU THẬP CÁC NHÓM NÉT VẼ ====================
    const drawGroups = [];
    for (let i = 1; i <= 8; i++) {
        const g = document.querySelector(`.draw-group[data-stage="${i}"]`);
        if (g) drawGroups.push(g);
    }

    function prepareAllPaths() {
        drawGroups.forEach(g => {
            const paths = g.querySelectorAll('.sketch-path');
            paths.forEach(p => {
                const len = p.getTotalLength() || 100;
                p.style.strokeDasharray = `${len} ${len}`;
                p.style.strokeDashoffset = len;
                p.style.fillOpacity = '0';
                p.classList.remove('drawn');
            });
        });
    }

    // Cache card bounding rect một lần để tránh layout thrashing trên điện thoại
    let cachedCardRect = paperCard ? paperCard.getBoundingClientRect() : null;
    window.addEventListener('resize', () => {
        if (paperCard) cachedCardRect = paperCard.getBoundingClientRect();
    }, { passive: true });

    // ==================== VẼ MỘT NÉT SVG CỤ THỂ (TỐI ƯU 60FPS) ====================
    function drawSinglePath(path, durationMs = 320) {
        return new Promise((resolve) => {
            const totalLen = path.getTotalLength() || 100;
            const startTime = performance.now();

            path.style.strokeDasharray = `${totalLen} ${totalLen}`;

            // Lấy CTM và CardRect một lần trước vòng lặp animate
            const ctm = path.getScreenCTM();
            if (!cachedCardRect && paperCard) {
                cachedCardRect = paperCard.getBoundingClientRect();
            }

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(1, elapsed / durationMs);

                // Easing mượt mà
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const currentLen = totalLen * (1 - ease);
                path.style.strokeDashoffset = currentLen;

                // Cập nhật vị trí đầu bút vẽ bằng translate3d (GPU tăng tốc)
                if (magicPencil && ctm && cachedCardRect) {
                    try {
                        const drawnLen = totalLen * ease;
                        const pt = path.getPointAtLength(drawnLen);
                        const screenX = pt.x * ctm.a + pt.y * ctm.c + ctm.e;
                        const screenY = pt.x * ctm.b + pt.y * ctm.d + ctm.f;
                        const relX = screenX - cachedCardRect.left;
                        const relY = screenY - cachedCardRect.top;
                        magicPencil.style.transform = `translate3d(${relX}px, ${relY}px, 0)`;
                        magicPencil.style.opacity = '1';
                    } catch (e) {}
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    path.style.strokeDashoffset = '0';
                    if (!path.classList.contains('tiny-t-sketch')) {
                        path.style.fillOpacity = '1';
                    }
                    path.classList.add('drawn');
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    }

    // ==================== KỊCH BẢN VẼ TỰ ĐỘNG TỪNG NÉT ====================
    async function runDrawingTimeline() {
        prepareAllPaths();

        // Vẽ tuần tự qua 8 nhóm
        for (let stageIdx = 0; stageIdx < drawGroups.length; stageIdx++) {
            const group = drawGroups[stageIdx];
            const paths = group.querySelectorAll('.sketch-path');

            for (let pIdx = 0; pIdx < paths.length; pIdx++) {
                const path = paths[pIdx];
                const len = path.getTotalLength() || 100;
                // Thời gian vẽ tỷ lệ thuận với độ dài nét vẽ
                const duration = Math.max(140, Math.min(680, Math.round(len * 0.42)));
                await drawSinglePath(path, duration);
                await delay(15);
            }
            await delay(100);
        }

        // Vẽ xong toàn bộ, ẩn đầu bút vẽ
        if (magicPencil) {
            magicPencil.style.opacity = '0';
        }

        // Hiện chữ 'The End' bên dưới và ngoài khung vẽ hiện lên từ từ
        const theEndContainer = document.getElementById('theEndContainer');
        if (theEndContainer) {
            await delay(600);
            theEndContainer.classList.add('visible');
        }
    }

    // Tự động phát nhạc & kích hoạt vẽ
    initContinuousMusic();

    const startApp = () => {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(() => {});
        }
        window.removeEventListener('click', startApp);
        window.removeEventListener('touchstart', startApp);
    };
    window.addEventListener('click', startApp, { once: true });
    window.addEventListener('touchstart', startApp, { once: true });

    // Bắt đầu vẽ mượt mà sau 800ms
    setTimeout(() => {
        runDrawingTimeline();
    }, 800);
});
