// Tọa độ 23 khối để vẽ BÁNH SINH NHẬT KHỔNG LỒ (gồm 92 icon bánh sinh nhật)
// Cấu trúc chuẩn theo mã nguồn gốc: mỗi khối gồm 4 icon bánh nhỏ
const offset_pitn = {
    block1: [-2, -4],
    block2: [-3, -4],
    block3: [2, -4],
    block4: [-4, -3],
    block5: [0, -3],
    block6: [4, -3],
    block7: [-4, -2],
    block8: [0, -2],
    block9: [4, -2],
    block10: [-5, -1],
    block11: [-1, -1],
    block12: [3, -1],
    block13: [-5, 0],
    block14: [-1, 0],
    block15: [3, 0],
    block16: [-4, 1],
    block17: [0, 1],
    block18: [4, 1],
    block19: [-1, 2],
    block20: [3, 2],
    block21: [0, 3],
    block22: [-3, 4],
    block23: [1, 4]
};

const blk_pitn = {
    block1: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block2: [[0, 0], [4, 1], [3, 1], [2, 1]],
    block3: [[0, 0], [-1, 0], [-4, 1], [-5, 1]],
    block4: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block5: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block6: [[0, 0], [-1, 0], [10, 1], [9, 1]],
    block7: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block8: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block9: [[0, 0], [-1, 0], [-2, 0], [10, 1]],
    block10: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block11: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block12: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block13: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block14: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block15: [[0, 0], [-1, 0], [-2, 0], [8, 1]],
    block16: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block17: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block18: [[0, 0], [-1, 0], [7, 1], [6, 1]],
    block19: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block20: [[0, 0], [6, 1], [5, 1], [4, 1]],
    block21: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    block22: [[0, 0], [0, 1], [-2, 0], [-2, 1]],
    block23: [[0, 0], [0, 1], [-2, 0], [-2, 1]]
};

let blocks = document.getElementsByClassName("block"),
    block = blocks[0],
    love = document.getElementsByClassName("love")[0],
    timer = null,
    index = 0,
    clone_block;

// Tính kích thước mỗi icon bánh để vừa khít mọi màn hình (mobile / tablet / desktop)
function getUnitSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
        return Math.floor((screenWidth * 0.92) / 16);
    } else if (screenWidth <= 768) {
        return 30;
    } else {
        return 36;
    }
}

let UNIT_SIZE = getUnitSize();
document.documentElement.style.setProperty('--unit-size', UNIT_SIZE + 'px');

block.style.top = "50%";
block.style.left = "50%";
block.style.margin = `${-UNIT_SIZE / 2}px 0 0 ${-UNIT_SIZE / 2}px`;

const block_left = parseFloat(window.getComputedStyle(block, null).left.slice(0, -2)),
    block_top = parseFloat(window.getComputedStyle(block, null).top.slice(0, -2));

const doraemonImg = document.getElementById("doraemonImg");
const muzzleFlash = document.getElementById("muzzleFlash");
const wishBanner = document.getElementById("wishBanner");
const audios = document.getElementById("audios");

// Hiệu ứng Doraemon bắn ra bánh sinh nhật
function triggerDoraemonShoot() {
    if (doraemonImg) {
        doraemonImg.classList.remove("recoil");
        void doraemonImg.offsetWidth;
        doraemonImg.classList.add("recoil");
    }
    if (muzzleFlash) {
        muzzleFlash.classList.add("active");
        setTimeout(() => {
            muzzleFlash.classList.remove("active");
        }, 180);
    }
}

// Bắn và ghép khối bánh tiếp theo (Next)
function Next() {
    if (++index >= 24) {
        clearInterval(timer);
        Rise();
        return;
    }

    triggerDoraemonShoot();

    block.style.visibility = "visible";

    // Định vị khối theo hệ tọa độ chuẩn của source code
    block.style.left = block_left + UNIT_SIZE * offset_pitn["block" + index][0] + "px";
    block.style.top = block_top - UNIT_SIZE * offset_pitn["block" + index][1] + "px";

    for (let i = 0; i < block.children.length; i++) {
        block.children[i].style.left = blk_pitn["block" + index][i][0] * -UNIT_SIZE + "px";
        block.children[i].style.top = blk_pitn["block" + index][i][1] * -UNIT_SIZE + "px";
    }

    clone_block = block.cloneNode(true);
    love.appendChild(clone_block);

    if (love.children.length >= 24) {
        block.style.display = "none";
    }
}

// Bánh sinh nhật khổng lồ bay lên và hiển thị thông điệp bí mật
function Rise() {
    console.log("Bánh sinh nhật hoàn thành, bắt đầu bay lên...");
    let timer2 = null,
        distance = 0;
    const target = window.innerWidth <= 600 ? 65 : 100,
        speed = 1.2;

    let love_top = parseFloat(window.getComputedStyle(love, null).top.slice(0, -2));

    timer2 = setInterval(() => {
        distance += speed;
        if (distance >= target) {
            clearInterval(timer2);
            console.log("Bay lên hoàn tất, hiện thông điệp!");
            showSecretWish();
        }
        love.style.top = (love_top - distance) + "px";
    }, 20);
}

// Hiển thị lời chúc với chữ 't' bé tí ẩn ý
function showSecretWish() {
    if (wishBanner) {
        wishBanner.classList.add("visible");
    }

    // Tạo hiệu ứng sao lấp lánh xung quanh bánh khổng lồ
    createSparkles();
}

function createSparkles() {
    const emojis = ['✨', '🎂', '💖', '⭐', '🌸'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            sparkle.style.left = (30 + Math.random() * 40) + '%';
            sparkle.style.top = (25 + Math.random() * 40) + '%';
            sparkle.style.setProperty('--tx', (Math.random() * 80 - 40) + 'px');
            sparkle.style.setProperty('--ty', (-30 - Math.random() * 80) + 'px');
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 2000);
        }, i * 180);
    }
}

// Khởi chạy nhạc nền liên tục từ các trang trước
function initContinuousMusic() {
    if (!audios) return;
    audios.loop = true;

    const savedTimeStr = sessionStorage.getItem('bgMusicTime');
    const savedTime = savedTimeStr ? parseFloat(savedTimeStr) : 0;

    const applyPlay = () => {
        if (!isNaN(savedTime) && savedTime > 0) {
            try {
                audios.currentTime = savedTime;
            } catch (e) {}
        }
        const p = audios.play();
        if (p) p.catch(() => {});
    };

    if (audios.readyState >= 1) {
        applyPlay();
    } else {
        audios.addEventListener('loadedmetadata', applyPlay, { once: true });
        applyPlay();
    }

    audios.addEventListener('timeupdate', () => {
        sessionStorage.setItem('bgMusicTime', audios.currentTime.toString());
    });
}

window.onload = function () {
    initContinuousMusic();

    // Hỗ trợ autoplay nếu trình duyệt cần cử chỉ người dùng
    const enableAudio = () => {
        if (audios && audios.paused) {
            audios.play().catch(() => {});
        }
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('touchstart', enableAudio);
    };
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });

    // Doraemon bắt đầu bắn bánh sinh nhật sau 1.2s
    setTimeout(() => {
        timer = setInterval(() => {
            Next();
        }, 280);
    }, 1200);
};

// Bí mật khi cô ấy bấm vào chữ 't' hoặc thanh lời chúc
document.addEventListener("DOMContentLoaded", () => {
    const tinyT = document.getElementById("tinyT");
    if (tinyT) {
        tinyT.addEventListener("click", () => {
            alert("✨ Em tìm thấy rồi nè! 't' + 'Hương Zang' = 'thương Giang' đó! Chúc em luôn luôn được yêu thương và hạnh phúc ngập tràn nhé! 🎂💖🌸");
        });
    }
});
