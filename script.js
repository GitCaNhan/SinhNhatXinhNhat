document.addEventListener('DOMContentLoaded', () => {
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const hint1Container = document.getElementById('hint1Container');
    const hint2Container = document.getElementById('hint2Container');
    const mainContainer = document.getElementById('mainContainer');
    const successScreen = document.getElementById('successScreen');
    
    // Hiệu ứng mưa 2 loại bánh rán Doraemon lơ lửng ngọt ngào
    if (typeof initRainEffect === 'function') {
        initRainEffect('assets/mua_1_nobg.png', 'assets/mua_2_nobg.png');
    }

    // Mật khẩu duy nhất chấp nhận các định dạng ngày 28 tháng 2
    const VALID_PASSWORDS = [
        '28/2', '28-2', '28_2',
        '28/02', '28-02', '28_02',
        '28 2', '28 02'
    ];
    let failCount = 0;

    function checkAnswer() {
        // Tự động thu bàn phím ảo trên điện thoại để không che màn hình và gợi ý 2
        if (answerInput) {
            answerInput.blur();
        }
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        // Chuẩn hóa câu trả lời: bỏ khoảng trắng thừa, chuyển về chữ thường
        const raw = answerInput.value.trim().toLowerCase();
        const answer = raw.replace(/\s+/g, ' ');
        
        if (answer === '') return;

        if (VALID_PASSWORDS.includes(answer)) {
            handleSuccess();
        } else {
            handleFailure();
        }
    }

    function handleFailure() {
        failCount++;
        
        // Hiển thị thông báo lỗi
        errorMessage.classList.remove('hidden');
        
        // Hiển thị gợi ý dựa trên số lần sai
        if (failCount === 1) {
            hint1Container.classList.remove('hidden');
        } else if (failCount >= 2) {
            hint2Container.classList.remove('hidden');
        }
        
        // Lắc input box để tạo hiệu ứng sai
        answerInput.style.transform = 'translateX(-10px)';
        setTimeout(() => { answerInput.style.transform = 'translateX(10px)'; }, 50);
        setTimeout(() => { answerInput.style.transform = 'translateX(-10px)'; }, 100);
        setTimeout(() => { answerInput.style.transform = 'translateX(10px)'; }, 150);
        setTimeout(() => { answerInput.style.transform = 'translateX(0)'; }, 200);

        answerInput.value = '';
        // Đảm bảo bàn phím ảo rút xuống để người dùng thấy gợi ý 2 rõ ràng
        answerInput.blur();
    }

    function handleSuccess() {
        mainContainer.classList.add('hidden');
        successScreen.classList.remove('hidden');
        
        // Bắn pháo hoa
        fireConfetti();
    }

    function fireConfetti() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    submitBtn.addEventListener('click', checkAnswer);

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Nút chuyển sang trang tiếp theo sau khi giải mã đúng
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            console.log("Chuyển sang trang tiếp theo...");
            if (typeof window.navigateTo === 'function') {
                window.navigateTo('page2.html');
            } else {
                window.location.href = 'page2.html';
            }
        });
    }
});
