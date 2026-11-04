#!/usr/bin/env python3
import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = os.path.expanduser("~/Desktop/AppStore_Screenshots")
IPHONE_DIR = os.path.join(OUTPUT_DIR, "iPhone_6.7inch_1290x2796")
IPAD_DIR = os.path.join(OUTPUT_DIR, "iPad_13inch_2048x2732")

os.makedirs(IPHONE_DIR, exist_ok=True)
os.makedirs(IPAD_DIR, exist_ok=True)

FONT_PATH = "/System/Library/Fonts/SFNS.ttf"
FONT_BOLD_PATH = "/System/Library/Fonts/SFNS.ttf"

def draw_wifi(draw, center_x, center_y, color, scale=1.0):
    # scale 1.0 means width ~30, height ~25
    r_dot = int(3 * scale)
    draw.ellipse([center_x - r_dot, center_y + int(7*scale) - r_dot, 
                  center_x + r_dot, center_y + int(7*scale) + r_dot], fill=color)
    
    # Inner arc
    r1 = int(12 * scale)
    draw.arc([center_x - r1, center_y + int(7*scale) - r1,
              center_x + r1, center_y + int(7*scale) + r1], 
             start=220, end=320, fill=color, width=max(2, int(3 * scale)))
    
    # Outer arc
    r2 = int(22 * scale)
    draw.arc([center_x - r2, center_y + int(7*scale) - r2,
              center_x + r2, center_y + int(7*scale) + r2], 
             start=220, end=320, fill=color, width=max(2, int(3 * scale)))

def draw_cellular(draw, start_x, base_y, color, scale=1.0):
    # 4 bars
    bar_w = int(6 * scale)
    spacing = int(4 * scale)
    for i in range(4):
        h = int((10 + i * 8) * scale)
        x = start_x + i * (bar_w + spacing)
        draw.rounded_rectangle([x, base_y - h, x + bar_w, base_y], radius=int(2*scale), fill=color)

def draw_battery(draw, start_x, base_y, color, scale=1.0):
    # Battery outline
    bw = int(68 * scale)
    bh = int(34 * scale)
    by = base_y - bh + int(2*scale)
    draw.rounded_rectangle([start_x, by, start_x + bw, by + bh], radius=int(8*scale), outline=color, width=max(2, int(3*scale)))
    # Battery tip
    tip_w = int(4 * scale)
    tip_h = int(14 * scale)
    tip_y = by + (bh - tip_h) // 2
    draw.rounded_rectangle([start_x + bw + int(2*scale), tip_y, start_x + bw + int(2*scale) + tip_w, tip_y + tip_h], radius=int(2*scale), fill=color)
    # Full fill
    inset = int(4 * scale)
    draw.rounded_rectangle([start_x + inset, by + inset, start_x + bw - inset, by + bh - inset], radius=int(4*scale), fill=color)

def clean_iphone_screenshot(raw_path, is_light=False, remove_ad=False):
    im = Image.open(raw_path).convert("RGBA")
    w, h = im.size # 1206 x 2622
    draw = ImageDraw.Draw(im)

    if is_light:
        bg_top = (206, 216, 252, 255)
        text_color = (0, 0, 0, 255)
    elif "screen_3" in raw_path:
        bg_top = (35, 53, 91, 255)
        text_color = (255, 255, 255, 255)
    else:
        bg_top = (30, 30, 30, 255)
        text_color = (255, 255, 255, 255)

    # 1. Clean top status bar (y: 0 to 155)
    draw.rectangle([0, 0, w, 155], fill=bg_top)

    # 2. Dynamic Island pill centered at x=603, y=35 to 145
    island_w, island_h = 370, 110
    ix1 = (w - island_w) // 2
    iy1 = 35
    draw.rounded_rectangle([ix1, iy1, ix1 + island_w, iy1 + island_h], radius=55, fill=(0, 0, 0, 255))

    # 3. Time '9:41'
    font_time = ImageFont.truetype(FONT_PATH, 50)
    draw.text((105, 68), "9:41", fill=text_color, font=font_time)

    # 4. Status icons on the right
    draw_cellular(draw, start_x=930, base_y=112, color=text_color, scale=1.0)
    draw_wifi(draw, center_x=1010, center_y=88, color=text_color, scale=1.0)
    draw_battery(draw, start_x=1055, base_y=112, color=text_color, scale=1.0)

    # 5. Remove ad banner if present
    if remove_ad:
        bg_bottom = (206, 216, 252, 255)
        draw.rectangle([0, 2365, w, h], fill=bg_bottom)
        # Home bar
        draw.rounded_rectangle([w//2 - 200, 2575, w//2 + 200, 2590], radius=8, fill=(0, 0, 0, 180))

    return im

def make_ipad_showcase(iphone_img, title, subtitle, bg_theme="dark"):
    # Target 2048 x 2732
    target_w, target_h = 2048, 2732
    if bg_theme == "dark":
        bg_color = (20, 25, 38) # Deep elegant midnight navy
        text_color = (255, 255, 255)
        sub_color = (160, 175, 210)
    elif bg_theme == "blue":
        bg_color = (22, 38, 70)
        text_color = (255, 255, 255)
        sub_color = (175, 200, 240)
    else: # light / purple
        bg_color = (32, 28, 48)
        text_color = (255, 255, 255)
        sub_color = (200, 190, 225)

    canvas = Image.new("RGBA", (target_w, target_h), bg_color)
    draw = ImageDraw.Draw(canvas)

    # Title & Subtitle at top
    font_title = ImageFont.truetype(FONT_PATH, 80)
    font_sub = ImageFont.truetype(FONT_PATH, 46)

    # Center text
    bbox_t = draw.textbbox((0, 0), title, font=font_title)
    tw = bbox_t[2] - bbox_t[0]
    draw.text(((target_w - tw) // 2, 140), title, fill=text_color, font=font_title)

    bbox_s = draw.textbbox((0, 0), subtitle, font=font_sub)
    sw = bbox_s[2] - bbox_s[0]
    draw.text(((target_w - sw) // 2, 245), subtitle, fill=sub_color, font=font_sub)

    # Scale iPhone image to fit gracefully in the remaining area
    # Max height ~ 2200, max width ~ 1400
    phone_target_h = 2220
    phone_target_w = int(iphone_img.width * (phone_target_h / iphone_img.height))
    resized_phone = iphone_img.resize((phone_target_w, phone_target_h), Image.Resampling.LANCZOS)

    # Create rounded corners for the phone mockup
    mask = Image.new("L", (phone_target_w, phone_target_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, phone_target_w, phone_target_h], radius=90, fill=255)

    # Subtle drop shadow behind phone
    shadow_pad = 40
    shadow = Image.new("RGBA", (phone_target_w + shadow_pad*2, phone_target_h + shadow_pad*2), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([shadow_pad, shadow_pad, phone_target_w + shadow_pad, phone_target_h + shadow_pad], radius=95, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=25))

    px = (target_w - phone_target_w) // 2
    py = 370

    canvas.paste(shadow, (px - shadow_pad, py - shadow_pad + 10), shadow)
    canvas.paste(resized_phone, (px, py), mask)

    return canvas.convert("RGB")

def main():
    screens = [
        {
            "raw": "/tmp/baby_names_1.png",
            "is_light": False,
            "remove_ad": False,
            "filename": "01_Discover_31000_Baby_Names.png",
            "title": "Discover Over 31,000 Baby Names",
            "subtitle": "Full US Social Security Administration Official Dataset",
            "theme": "dark"
        },
        {
            "raw": "/tmp/screen_3.png",
            "is_light": False,
            "remove_ad": False,
            "filename": "02_Filter_Boy_and_Girl_Names.png",
            "title": "Filter by Boy & Girl Names",
            "subtitle": "Quickly search, filter by letter, and randomize",
            "theme": "blue"
        },
        {
            "raw": "/tmp/screen_detail.png",
            "is_light": True,
            "remove_ad": True,
            "filename": "03_Meanings_Origins_and_Rankings.png",
            "title": "Meanings, Origins & Popularity",
            "subtitle": "Detailed historical usage, ratings, and pronunciation",
            "theme": "purple"
        }
    ]

    for item in screens:
        print(f"Processing {item['filename']}...")
        cleaned = clean_iphone_screenshot(item["raw"], is_light=item["is_light"], remove_ad=item["remove_ad"])
        
        # 1. iPhone 6.7" (1290 x 2796)
        iphone_final = cleaned.resize((1290, 2796), Image.Resampling.LANCZOS).convert("RGB")
        iphone_path = os.path.join(IPHONE_DIR, item["filename"])
        iphone_final.save(iphone_path, "PNG", optimize=True)
        print(f"  -> Saved iPhone screenshot: {iphone_path}")

        # 2. iPad 13" (2048 x 2732)
        ipad_final = make_ipad_showcase(cleaned, item["title"], item["subtitle"], bg_theme=item["theme"])
        ipad_path = os.path.join(IPAD_DIR, item["filename"])
        ipad_final.save(ipad_path, "PNG", optimize=True)
        print(f"  -> Saved iPad screenshot: {ipad_path}")

    print("\nAll App Store screenshots successfully generated!")
    print(f"Output folder: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
