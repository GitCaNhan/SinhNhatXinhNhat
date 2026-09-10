import xml.etree.ElementTree as ET
import re

with open('assets/sketch_master.svg', 'r', encoding='utf-8') as f:
    svg_raw = f.read()

# Nét vẽ chữ 't' bé xíu viết tay đặt ngay trước chữ Hương Giang
tiny_t_path = '''  <g id="stage8_huong_giang" class="draw-group" data-stage="8">
    <!-- Nét chữ 't' bé xíu ở trước chữ Hương Giang (tHương Giang = thương Giang, zoom mới thấy) -->
    <path d="M 349 893 L 349 903 Q 349 906 353 906 M 346 897 L 353 897" class="sketch-path tiny-t-sketch" />'''

target_s8 = '<g id="stage8_huong_giang" class="draw-group" data-stage="8" data-label="Viết Hương Giang">'
svg_clean = svg_raw.replace(target_s8, tiny_t_path)
svg_clean = re.sub(r' data-label="[^"]*"', '', svg_clean)

html_content = f'''<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>Happy Birthday Hương Giang 🎂✨</title>
    <link rel="stylesheet" href="page5.css">
    <link rel="stylesheet" href="rain.css">
    <!-- Font chữ nghệ thuật tiếng Anh & tiếng Việt -->
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Dancing+Script:wght@700&family=Comic+Neue:wght@700&family=Mali:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <script src="rain.js"></script>
</head>
<body>
    <!-- Nền màu hồng ngọt ngào giống Page 3 -->
    <div class="sketch-desk">
        <div class="dust-particles"></div>
    </div>

    <div class="page-container">
        <!-- Khung tranh nghệ thuật bao quanh bức vẽ -->
        <div class="art-frame">
            <div class="frame-matboard">
                <main class="sketch-paper-canvas">
                    <!-- Đầu bút chì ma thuật di chuyển theo nét vẽ -->
                    <div class="magic-pencil" id="magicPencil">
                        <span class="pencil-emoji">✏️</span>
                    </div>

                    <!-- SVG nét vẽ Doraemon + Bánh sinh nhật + Chữ happy birthday tHương Giang -->
                    <div class="svg-stage-wrapper">
                        {svg_clean}
                    </div>
                </main>
            </div>
        </div>

        <!-- Đoạn kết 'The End' (ở dưới và ngoài khung vẽ) -->
        <div class="the-end-container" id="theEndContainer">
            <div class="the-end-pill">
                <span class="the-end-symbol">🌸</span>
                <span class="the-end-text">The End</span>
                <span class="the-end-symbol">💖</span>
            </div>
        </div>
    </div>

    <!-- Nhạc nền tiếp tục phát liên tục từ các trang trước -->
    <audio id="bgMusic" src="assets/sound_cake.mp3" preload="auto" loop></audio>

    <script src="page5.js"></script>
</body>
</html>
'''

with open('page5.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Updated page5.html with rain.css & rain.js generated successfully!')
