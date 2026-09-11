/**
 * seamless.js - Bộ điều phối chuyển trang mượt mà và Quản lý Âm thanh Xuyên suốt (SPA & Continuous Audio)
 * Giải quyết triệt để vấn đề:
 * 1. Âm thanh bị chặn trên điện thoại di động (iOS Safari / Android Chrome).
 * 2. Khi chuyển trang nhạc không bị load lại từ đầu, phát xuyên suốt không gián đoạn.
 * 3. Người dùng không phải chạm lại vào màn hình ở mỗi trang.
 * 4. Tối ưu hiệu năng, loại bỏ giật lag trên thiết bị di động.
 */

(function () {
    // ==================== QUẢN LÝ ÂM THANH XUYÊN SUỐT ====================
    const SoundMaster = {
        bgAudio: null,
        isAudioUnlocked: false,
        activeSfx: [],

        init() {
            if (!this.bgAudio) {
                // Kiểm tra xem đã có audio element từ trang trước chưa
                let el = document.getElementById('masterBgAudio');
                if (!el) {
                    el = document.createElement('audio');
                    el.id = 'masterBgAudio';
                    el.preload = 'auto';
                    el.loop = true;
                    el.style.display = 'none';
                    document.body.appendChild(el);
                }
                this.bgAudio = el;
                this.bgAudio.addEventListener('timeupdate', () => {
                    sessionStorage.setItem('bgMusicTime', this.bgAudio.currentTime.toString());
                });
            }
            this.bindUnlockGesture();
        },

        // Mở khóa audio cho trình duyệt di động ngay từ tương tác đầu tiên
        unlock() {
            if (this.isAudioUnlocked) return;
            this.isAudioUnlocked = true;

            // Kích hoạt AudioContext nếu có
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                try {
                    const ctx = new AudioCtx();
                    if (ctx.state === 'suspended') {
                        ctx.resume().catch(() => {});
                    }
                } catch (e) {}
            }

            // Kích hoạt bgAudio nếu có
            if (this.bgAudio && this.bgAudio.src) {
                const p = this.bgAudio.play();
                if (p) p.catch(() => {});
            }

            // Ẩn toast gợi ý chạm nếu đang hiện
            const toast = document.getElementById('soundHintToast');
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 400);
            }
        },

        bindUnlockGesture() {
            const unlockHandler = () => {
                this.unlock();
            };
            window.addEventListener('click', unlockHandler, { capture: true, passive: true });
            window.addEventListener('touchstart', unlockHandler, { capture: true, passive: true });
            window.addEventListener('keydown', unlockHandler, { capture: true, passive: true });
        },

        // Phát nhạc nền xuyên suốt không bị tải lại hoặc ngắt quãng
        playBgMusic(src = 'assets/sound_cake.mp3') {
            this.init();
            if (!this.bgAudio) return;

            const currentSrc = this.bgAudio.getAttribute('data-active-src') || '';
            const normalizedSrc = src.replace(/^\.\//, '');

            // Nếu nhạc nền đang phát đúng bài này rồi, KHÔNG LOAD LẠI, tiếp tục phát!
            if (currentSrc === normalizedSrc && !this.bgAudio.paused) {
                console.log("Nhạc nền đang phát liên tục, không reset:", normalizedSrc);
                return;
            }

            // Cập nhật nguồn nhạc nếu đổi bài
            if (currentSrc !== normalizedSrc) {
                this.bgAudio.src = normalizedSrc;
                this.bgAudio.setAttribute('data-active-src', normalizedSrc);
                this.bgAudio.currentTime = 0;
            }

            const playPromise = this.bgAudio.play();
            if (playPromise) {
                playPromise.catch((err) => {
                    console.warn("Mobile autoplay policy prevented audio. Showing hint:", err);
                    this.showSoundHintToast();
                    
                    const onFirstUserTouch = () => {
                        this.unlock();
                        if (this.bgAudio) {
                            this.bgAudio.play().catch(() => {});
                        }
                        window.removeEventListener('touchstart', onFirstUserTouch);
                        window.removeEventListener('click', onFirstUserTouch);
                    };
                    window.addEventListener('touchstart', onFirstUserTouch, { once: true });
                    window.addEventListener('click', onFirstUserTouch, { once: true });
                });
            }
        },

        pauseBgMusic() {
            if (this.bgAudio) {
                this.bgAudio.pause();
            }
        },

        stopBgMusic() {
            if (this.bgAudio) {
                this.bgAudio.pause();
                this.bgAudio.removeAttribute('data-active-src');
                this.bgAudio.currentTime = 0;
            }
        },

        // Phát sound effect (hiệu ứng gõ phím, tiếng pop-up các ảnh)
        playSfx(audioElementOrSrc, loop = false, volume = 1.0) {
            return new Promise((resolve) => {
                let el;
                if (typeof audioElementOrSrc === 'string') {
                    el = new Audio(audioElementOrSrc);
                } else if (audioElementOrSrc instanceof HTMLAudioElement) {
                    el = audioElementOrSrc;
                } else {
                    return resolve();
                }

                el.loop = loop;
                el.volume = volume;
                el.currentTime = 0;

                let resolved = false;
                const done = () => {
                    if (!resolved) {
                        resolved = true;
                        el.removeEventListener('ended', done);
                        el.removeEventListener('error', done);
                        resolve(el);
                    }
                };

                if (!loop) {
                    el.addEventListener('ended', done);
                    el.addEventListener('error', done);
                }

                const p = el.play();
                if (p) {
                    p.then(() => {
                        if (loop) resolve(el);
                    }).catch(err => {
                        console.warn("SFX play prevented:", err);
                        done();
                    });
                } else {
                    if (loop) resolve(el);
                }
            });
        },

        // Dừng một audio effect cụ thể
        stopSfx(el) {
            if (el) {
                try {
                    el.pause();
                    el.currentTime = 0;
                } catch (e) {}
            }
        },

        // Hiển thị toast nhẹ nhàng mời chạm nếu mở trang độc lập mà chưa tương tác
        showSoundHintToast() {
            if (document.getElementById('soundHintToast')) return;
            const toast = document.createElement('div');
            toast.id = 'soundHintToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 77, 148, 0.92);
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35);
                z-index: 999999;
                pointer-events: none;
                transition: opacity 0.4s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: pulseHint 1.8s infinite ease-in-out;
            `;
            toast.innerHTML = `<span>🎵</span> <span>Chạm vào màn hình để bật nhạc nhé 💖</span>`;

            // Thêm keyframe pulse nếu chưa có
            if (!document.getElementById('soundHintStyle')) {
                const style = document.createElement('style');
                style.id = 'soundHintStyle';
                style.textContent = `
                    @keyframes pulseHint {
                        0%, 100% { transform: translateX(-50%) scale(1); }
                        50% { transform: translateX(-50%) scale(1.05); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(toast);
        }
    };

    // ==================== BỘ ĐIỀU HƯỚNG CHUYỂN TRANG MƯỢT MÀ (SPA) ====================
    async function navigateTo(targetUrl) {
        console.log("Điều hướng mượt mà đến:", targetUrl);
        // Tận dụng cử chỉ click/touch hiện tại để mở khóa âm thanh
        SoundMaster.unlock();

        // Kích hoạt ngay nhạc nền bánh sinh nhật đồng bộ trước khi fetch/chuyển cảnh
        if (targetUrl.includes('page3') || targetUrl.includes('page4') || targetUrl.includes('page5')) {
            SoundMaster.playBgMusic('assets/sound_cake.mp3');
        }

        try {
            // Tải nội dung trang mới qua fetch
            const resp = await fetch(targetUrl);
            if (!resp.ok) {
                throw new Error("HTTP Status " + resp.status);
            }
            const htmlText = await resp.text();

            const parser = new DOMParser();
            const newDoc = parser.parseFromString(htmlText, 'text/html');

            // Tạo lớp phủ chuyển cảnh mượt mà
            let overlay = document.getElementById('pageTransitionOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'pageTransitionOverlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle at 50% 35%, #fff0f7 0%, #ffd6eb 100%);
                    opacity: 0;
                    transition: opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    z-index: 99999;
                `;
                document.body.appendChild(overlay);
            }

            // Bật lớp phủ
            overlay.style.pointerEvents = 'auto';
            overlay.style.opacity = '1';
            await new Promise(r => setTimeout(r, 320));

            // Dọn dẹp hiệu ứng / timers của trang cũ
            if (typeof window._pageCleanup === 'function') {
                try { window._pageCleanup(); } catch (e) {}
                window._pageCleanup = null;
            }
            const rainContainer = document.getElementById('rainContainer');
            if (rainContainer) rainContainer.remove();

            // Cập nhật title
            if (newDoc.title) {
                document.title = newDoc.title;
            }

            // Thay đổi stylesheet của trang mới
            const oldStyles = document.querySelectorAll('link[data-page-style]');
            oldStyles.forEach(el => el.remove());

            const newLinks = newDoc.querySelectorAll('link[rel="stylesheet"]');
            newLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const l = document.createElement('link');
                    l.rel = 'stylesheet';
                    l.href = href;
                    l.setAttribute('data-page-style', 'true');
                    document.head.appendChild(l);
                }
            });

            // Bảo tồn phần tử audio nhạc nền xuyên suốt và overlay
            const bgAudio = SoundMaster.bgAudio;
            if (bgAudio && bgAudio.parentNode) {
                bgAudio.parentNode.removeChild(bgAudio);
            }
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }

            // Đồng bộ class và style của body mới
            document.body.className = newDoc.body.className;
            document.body.style.cssText = newDoc.body.style.cssText;

            // Thay thế nội dung HTML của trang mới
            document.body.innerHTML = newDoc.body.innerHTML;

            // Gắn lại audio nhạc nền và overlay vào DOM mới
            if (bgAudio) document.body.appendChild(bgAudio);
            if (overlay) document.body.appendChild(overlay);

            // Cập nhật URL trên thanh địa chỉ (History API)
            try {
                history.pushState({ pageUrl: targetUrl }, '', targetUrl);
            } catch (e) {}

            // Nạp và thực thi các file script của trang mới
            const scripts = Array.from(newDoc.querySelectorAll('script'));
            for (const s of scripts) {
                const src = s.getAttribute('src');
                if (src) {
                    if (src.includes('seamless.js')) continue;
                    if (src.includes('confetti') && typeof window.confetti === 'function') continue;

                    await new Promise((res) => {
                        const scriptEl = document.createElement('script');
                        scriptEl.src = src;
                        scriptEl.onload = res;
                        scriptEl.onerror = res;
                        document.body.appendChild(scriptEl);
                    });
                } else if (s.textContent.trim()) {
                    const inlineEl = document.createElement('script');
                    inlineEl.textContent = s.textContent;
                    document.body.appendChild(inlineEl);
                }
            }

            // Kích hoạt DOMContentLoaded cho các script vừa nạp
            document.dispatchEvent(new Event('DOMContentLoaded'));

            // Fade out lớp phủ chuyển cảnh
            await new Promise(r => setTimeout(r, 60));
            overlay.style.opacity = '0';
            await new Promise(r => setTimeout(r, 340));
            overlay.style.pointerEvents = 'none';

        } catch (err) {
            console.warn("Không thể tải trang bằng SPA, fallback về reload thông thường:", err);
            window.location.href = targetUrl;
        }
    }

    // Xử lý nút Back/Forward của trình duyệt
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.pageUrl) {
            navigateTo(e.state.pageUrl);
        } else {
            window.location.reload();
        }
    });

    // Xuất ra toàn cục
    window.SoundMaster = SoundMaster;
    window.navigateTo = navigateTo;

    // Tự động khởi tạo ngay khi tải
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SoundMaster.init());
    } else {
        SoundMaster.init();
    }
})();
