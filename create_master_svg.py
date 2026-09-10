import xml.etree.ElementTree as ET

stage_names = [
    ('stage1_head', 'Vẽ Doraemon'),
    ('stage2_face', 'Vẽ mắt, mũi, miệng, râu'),
    ('stage3_body', 'Vẽ thân và tay'),
    ('stage4_cake', 'Vẽ bánh'),
    ('stage5_frosting', 'Vẽ kem'),
    ('stage6_candles', 'Vẽ 5 cây nến'),
    ('stage7_happy_birthday', 'Viết happy birthday'),
    ('stage8_huong_giang', 'Viết Hương Giang')
]

svg_content = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" id="sketchSvg" class="sketch-svg">'
]

total_paths = 0

for i, (sid, label) in enumerate(stage_names, start=1):
    tree = ET.parse(f'assets/sketch_layers/layer_{i}.svg')
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    svg_content.append(f'  <g id="{sid}" class="draw-group" data-stage="{i}" data-label="{label}">')
    for p in paths:
        fill = p.get('fill', '').upper()
        if fill.startswith('#'):
            r, g, b = int(fill[1:3], 16), int(fill[3:5], 16), int(fill[5:7], 16)
            if r < 50 and g < 50 and b < 50:
                d = p.get('d', '')
                tr = p.get('transform', '')
                svg_content.append(f'    <path d="{d}" transform="{tr}" class="sketch-path" />')
                total_paths += 1
    svg_content.append('  </g>')

svg_content.append('</svg>')

full_svg = '\n'.join(svg_content)
with open('assets/sketch_master.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'sketch_master.svg written successfully! Total paths: {total_paths}, Length: {len(full_svg)}')
