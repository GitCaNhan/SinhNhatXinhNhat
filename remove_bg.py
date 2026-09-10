from PIL import Image, ImageDraw
import os

def remove_bg(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
        
    img = Image.open(input_path).convert("RGBA")
    MAGIC_COLOR = (255, 0, 255, 255)
    
    width, height = img.size
    
    # Floodfill from corners
    corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    for corner in corners:
        try:
            ImageDraw.floodfill(img, corner, MAGIC_COLOR, thresh=40)
        except:
            pass
            
    # For checkerboard pattern
    if "box" in input_path:
        for x in range(0, min(30, width), 5):
            for y in range(0, min(30, height), 5):
                try:
                    ImageDraw.floodfill(img, (x, y), MAGIC_COLOR, thresh=40)
                except:
                    pass

    data = img.getdata()
    new_data = []
    for item in data:
        if item == MAGIC_COLOR:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed: {input_path}")

remove_bg("assets/gợi ý 1.jpg", "assets/gợi ý 1_nobg.png")
remove_bg("assets/gợi ý 2.jpg", "assets/gợi ý 2_nobg.png")
remove_bg("assets/ảnh doraemon ở chỗ ô tròn.jpg", "assets/doraemon_bottom_nobg.png")
remove_bg("assets/ảnh doraemon nằm trên box câu hỏi.jpg", "assets/doraemon_top_nobg.png")
