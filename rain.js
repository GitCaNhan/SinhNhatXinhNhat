/**
 * rain.js - Hiệu ứng mưa bánh rán và Doraemon cho các trang sinh nhật
 * Tự động tạo và điều phối 2 hiệu ứng mưa lơ lửng rơi nhẹ nhàng
 */
function initRainEffect(item1Src, item2Src, options = {}) {
    // Đảm bảo DOM đã sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initRainEffect(item1Src, item2Src, options));
        return;
    }

    // Tạo container nếu chưa có
    let container = document.getElementById('rainContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'rain-container';
        container.id = 'rainContainer';
        document.body.appendChild(container);
    }

    const count1 = options.count1 || 8; // Số lượng vật phẩm 1
    const count2 = options.count2 || 6; // Số lượng vật phẩm 2

    const isCharacter = (src) => {
        return src.includes('mua_3') || src.includes('mua_4') || src.includes('mua_5') || src.includes('doraemon');
    };

    function spawnRainDrop(src, isChar, index) {
        const item = document.createElement('img');
        item.src = src;
        item.className = 'rain-item';
        item.setAttribute('aria-hidden', 'true');

        // Phân bổ ngẫu nhiên vị trí ngang từ 3% đến 94%
        const left = (Math.random() * 91 + 3).toFixed(1);
        
        // Kích thước đa dạng tạo chiều sâu (gần - xa)
        let minSize = isChar ? 46 : 28;
        let maxSize = isChar ? 70 : 45;
        if (window.innerWidth < 600) {
            minSize = isChar ? 36 : 24;
            maxSize = isChar ? 56 : 36;
        }
        const size = Math.round(minSize + Math.random() * (maxSize - minSize));

        // Tốc độ rơi từ tốn, mượt mà (6.5s đến 12s)
        const duration = (6.5 + Math.random() * 5.5).toFixed(1);

        // Giãn cách thời gian bắt đầu rơi để rải đều liên tục
        const delay = (Math.random() * 8).toFixed(1);

        // Hiệu ứng rơi phù hợp
        let animName;
        if (isChar) {
            animName = index % 2 === 0 ? 'doraemonFloat1' : 'doraemonFloat2';
        } else {
            animName = index % 2 === 0 ? 'dorayakiFall1' : 'dorayakiFall2';
        }

        item.style.left = `${left}%`;
        item.style.width = `${size}px`;
        item.style.height = 'auto';
        item.style.animation = `${animName} ${duration}s linear infinite`;
        item.style.animationDelay = `${delay}s`;

        container.appendChild(item);
    }

    // Tạo các hạt rơi cho hiệu ứng 1
    const char1 = isCharacter(item1Src);
    for (let i = 0; i < count1; i++) {
        spawnRainDrop(item1Src, char1, i);
    }

    // Tạo các hạt rơi cho hiệu ứng 2
    const char2 = isCharacter(item2Src);
    for (let i = 0; i < count2; i++) {
        spawnRainDrop(item2Src, char2, i);
    }
}
