from PIL import Image

def remove_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # The background is white. We remove anything very close to pure white.
        if item[0] > 245 and item[1] > 245 and item[2] > 245:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    in_file = r"e:\Antigravity\The-Last-Minute-Life-Saver\frontend\src\assets\hustler_word_logo.png"
    out_file = r"e:\Antigravity\The-Last-Minute-Life-Saver\frontend\src\assets\hustler_word_logo_transparent.png"
    remove_background(in_file, out_file)
    print("Background removed successfully.")
