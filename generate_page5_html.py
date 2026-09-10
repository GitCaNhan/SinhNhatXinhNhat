with open('assets/sketch_master.svg', 'r', encoding='utf-8') as f:
    svg_raw = f.read()

# Add the tiny 't' inside stage8_huong_giang right before the first path
target_str = '<g id="stage8_huong_giang" class="draw-group" data-stage="8" data-label="Viết Hương Giang">'
tiny_t_svg = target_str + '\n    <!-- Chữ "t" siêu nhỏ ẩn ý: zoom màn hình mới thấy (tHương Giang = thương Giang) -->\n    <text x="402" y="868" class="tiny-easter-t" id="tinyEasterT" title="thương">t</text>'

svg_embedded = svg_raw.replace(target_str, tiny_t_svg)

html_template = f'''<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>Doraemon Vẽ Bánh Sinh Nhật Tặng Hương Giang ✏️🎂</title>
    <link rel="stylesheet" href="page5.css">
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&family=Dancing+Script:wght@700&family=Mali:ital,wght@0,600;0,700;1,600&family=Patrick+Hand&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Nền không gian bàn vẽ nghệ thuật ấm áp -->
    <div class="sketch-desk">
        <!-- Hạt bụi ánh sáng nghệ thuật -->
        <div class="dust-particles"></div>
    </div>

    <div class="page-container">
        <!-- Thanh trạng thái các bước vẽ -->
        <header class="draw-header">
            <div class="badge-stage" id="badgeStage">
                <span class="pen-icon">✏️</span>
                <span class="stage-label" id="stageLabel">Đang chuẩn bị giấy vẽ...</span>
            </div>
            <!-- Thanh tiến trình vẽ 8 bước -->
            <div class="progress-bar-wrap">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="stage-steps-row" id="stageStepsRow">
                <span class="step-dot active" title="1. Đầu Doraemon">1</span>
                <span class="step-dot" title="2. Mắt mũi miệng">2</span>
                <span class="step-dot" title="3. Thân và tay">3</span>
                <span class="step-dot" title="4. Bánh sinh nhật">4</span>
                <span class="step-dot" title="5. Kem chảy">5</span>
                <span class="step-dot" title="6. 5 ngọn nến">6</span>
                <span class="step-dot" title="7. happy birthday">7</span>
                <span class="step-dot" title="8. Hương Giang">8</span>
            </div>
        </header>

        <!-- Khung giấy vẽ Sketchbook Canvas -->
        <main class="sketch-paper-card">
            <!-- Đầu bút vẽ ma thuật di chuyển theo nét vẽ -->
            <div class="magic-pencil" id="magicPencil">
                <span class="pencil-emoji">✏️</span>
                <span class="pencil-spark">✨</span>
            </div>

            <!-- SVG Line-Art chứa toàn bộ 8 nhóm nét vẽ -->
            <div class="svg-stage-wrapper">
                {svg_embedded}
            </div>

            <!-- Lớp phủ màu nước Pastel rực rỡ sau khi vẽ xong -->
            <div class="color-fill-overlay" id="colorOverlay">
                <!-- Màu Doraemon -->
                <div class="color-patch patch-doraemon-blue"></div>
                <div class="color-patch patch-doraemon-red"></div>
                <div class="color-patch patch-doraemon-bell"></div>
                <!-- Màu Bánh & Kem -->
                <div class="color-patch patch-cake-frosting"></div>
                <div class="color-patch patch-cake-body"></div>
                <!-- Màu 5 Ngọn nến -->
                <div class="color-patch patch-candle-flame"></div>
            </div>

            <!-- Lời nhắc ẩn ý zoom to -->
            <div class="secret-zoom-hint" id="zoomHint">
                🔍 <em>(Gợi ý bí mật: Thử zoom to vào chữ Hương Giang xem có điều kỳ diệu gì ẩn giấu nhé...)</em>
            </div>
        </main>

        <!-- Bảng điều khiển phía dưới -->
        <footer class="draw-controls">
            <button class="ctrl-btn" id="replayBtn">
                <span class="btn-icon">🔄</span> Vẽ lại từ đầu
            </button>
            <button class="ctrl-btn btn-magic" id="toggleColorBtn">
                <span class="btn-icon">🎨</span> Tô màu phép thuật
            </button>
            <button class="ctrl-btn btn-sound" id="toggleSoundBtn">
                <span class="btn-icon">🔊</span> Âm thanh bút vẽ: Bật
            </button>
        </footer>

        <!-- Modal bí mật khi chạm vào chữ 't' -->
        <div class="secret-modal hidden" id="secretModal">
            <div class="secret-modal-card">
                <div class="modal-heart">💖</div>
                <h3 class="modal-title">Em tìm ra bí mật rồi nè!</h3>
                <p class="modal-desc">
                    Chữ <strong>"t"</strong> nhỏ xíu ghép cùng <strong>"Hương Giang"</strong> chính là ẩn ý: 
                    <br><span class="highlight-secret">"thương Giang"</span> đó!
                </p>
                <p class="modal-sub">Chúc em tuổi mới luôn luôn xinh đẹp, ngọt ngào và hạnh phúc nhất trần đời! 🎂🌸✨</p>
                <button class="modal-close-btn" id="closeModalBtn">Dạ, em hiểu rùi 💖</button>
            </div>
        </div>
    </div>

    <!-- Nhạc nền tiếp tục phát từ các trang trước -->
    <audio id="bgMusic" src="assets/sound_cake.mp3" preload="auto" loop></audio>

    <script src="page5.js"></script>
</body>
</html>
'''

with open('page5.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print('page5.html generated successfully!')
