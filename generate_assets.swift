import AppKit
import Foundation

let brainDir = "/Users/danielgoodwyn/.gemini/antigravity/brain/b4230f74-fec8-4bcc-8592-bfb13a5725fe"
let webDir = "/Users/danielgoodwyn/src/BabyNames"
let iosAssetsDir = "\(webDir)/iOS-Baby-Names/Baby Names/Images.xcassets"
let androidResDir = "\(webDir)/Android-Baby-Names/app/src/main/res"

func resizeImage(sourcePath: String, outPath: String, width: Int, height: Int) {
    guard let img = NSImage(contentsOfFile: sourcePath) else {
        print("Failed to load \(sourcePath)")
        return
    }
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                pixelsWide: width,
                                pixelsHigh: height,
                                bitsPerSample: 8,
                                samplesPerPixel: 4,
                                hasAlpha: true,
                                isPlanar: false,
                                colorSpaceName: .deviceRGB,
                                bytesPerRow: 0,
                                bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSGraphicsContext.current?.imageInterpolation = .high
    img.draw(in: NSRect(x: 0, y: 0, width: width, height: height),
             from: NSRect(origin: .zero, size: img.size),
             operation: .copy,
             fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()
    guard let pngData = rep.representation(using: .png, properties: [:]) else { return }
    try? FileManager.default.createDirectory(atPath: (outPath as NSString).deletingLastPathComponent, withIntermediateDirectories: true)
    try! pngData.write(to: URL(fileURLWithPath: outPath))
}

func renderSVGData(svgString: String, outPath: String, width: Int, height: Int) {
    guard let data = svgString.data(using: .utf8),
          let img = NSImage(data: data) else {
        print("Failed to parse SVG")
        return
    }
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                pixelsWide: width,
                                pixelsHigh: height,
                                bitsPerSample: 8,
                                samplesPerPixel: 4,
                                hasAlpha: true,
                                isPlanar: false,
                                colorSpaceName: .deviceRGB,
                                bytesPerRow: 0,
                                bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSGraphicsContext.current?.imageInterpolation = .high
    img.draw(in: NSRect(x: 0, y: 0, width: width, height: height),
             from: NSRect(origin: .zero, size: img.size),
             operation: .copy,
             fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()
    guard let pngData = rep.representation(using: .png, properties: [:]) else { return }
    try? FileManager.default.createDirectory(atPath: (outPath as NSString).deletingLastPathComponent, withIntermediateDirectories: true)
    try! pngData.write(to: URL(fileURLWithPath: outPath))
}

let appIconSource = "\(brainDir)/app_icon_v2.jpg"
let babyCutout = "\(brainDir)/baby_cutout.png"
let boyCutout = "\(brainDir)/boy_cutout.png"
let girlCutout = "\(brainDir)/girl_cutout.png"

print("1. Generating Web Assets...")
resizeImage(sourcePath: appIconSource, outPath: "\(webDir)/apple-touch-icon.png", width: 180, height: 180)
resizeImage(sourcePath: appIconSource, outPath: "\(webDir)/favicon-32x32.png", width: 32, height: 32)
resizeImage(sourcePath: appIconSource, outPath: "\(webDir)/favicon-16x16.png", width: 16, height: 16)
resizeImage(sourcePath: babyCutout, outPath: "\(webDir)/images/baby.png", width: 160, height: 160)
resizeImage(sourcePath: boyCutout, outPath: "\(webDir)/images/boy.png", width: 160, height: 160)
resizeImage(sourcePath: girlCutout, outPath: "\(webDir)/images/girl.png", width: 160, height: 160)

print("2. Generating iOS AppIcon set...")
let appIconSizes: [(name: String, size: Int)] = [
    ("29.png", 29),
    ("29-1.png", 29),
    ("40.png", 40),
    ("50.png", 50),
    ("57.png", 58),
    ("57-1.png", 57),
    ("57-2.png", 58),
    ("72.png", 72),
    ("76.png", 76),
    ("80.png", 80),
    ("80-1.png", 80),
    ("87.png", 87),
    ("100-1.png", 100),
    ("114.png", 114),
    ("120.png", 120),
    ("120-1.png", 120),
    ("144-1.png", 144),
    ("152-1.png", 152),
    ("180.png", 180),
    ("1024.png", 1024)
]
let appIconSetDir = "\(iosAssetsDir)/AppIcon.appiconset"
for entry in appIconSizes {
    resizeImage(sourcePath: appIconSource, outPath: "\(appIconSetDir)/\(entry.name)", width: entry.size, height: entry.size)
}

print("3. Generating Android Launcher Icons...")
let androidMipmaps: [(folder: String, size: Int)] = [
    ("drawable-mdpi", 48),
    ("drawable-hdpi", 72),
    ("drawable-xhdpi", 96),
    ("drawable-xxhdpi", 144),
    ("drawable-xxxhdpi", 192)
]
for entry in androidMipmaps {
    resizeImage(sourcePath: appIconSource, outPath: "\(androidResDir)/\(entry.folder)/ic_launcher.png", width: entry.size, height: entry.size)
}

print("4. Defining Tool SVGs...")
let svgs: [String: String] = [
    "tool_star": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 50 8 
           L 62.5 35.5 
           L 91.5 39.5 
           L 70.5 59.5 
           L 75.8 88.5 
           L 50 74.5 
           L 24.2 88.5 
           L 29.5 59.5 
           L 8.5 39.5 
           L 37.5 35.5 Z" 
        fill="#1C1C1E" stroke="#1C1C1E" stroke-width="2" stroke-linejoin="round" />
</svg>
""",
    "tool_save": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path fill-rule="evenodd" clip-rule="evenodd" d="
    M 16 12 
    C 13.8 12 12 13.8 12 16 
    L 12 84 
    C 12 86.2 13.8 88 16 88 
    L 84 88 
    C 86.2 88 88 86.2 88 84 
    L 88 28 
    L 72 12 
    L 16 12 Z 
    M 28 16 
    L 68 16 
    C 69.1 16 70 16.9 70 18 
    L 70 36 
    C 70 37.1 69.1 38 68 38 
    L 28 38 
    C 26.9 38 26 37.1 26 36 
    L 26 18 
    C 26 16.9 26.9 16 28 16 Z 
    M 56 22 
    L 62 22 
    L 62 32 
    L 56 32 Z 
    M 24 52 
    C 24 49.8 25.8 48 28 48 
    L 72 48 
    C 74.2 48 76 49.8 76 52 
    L 76 84 
    L 24 84 
    L 24 52 Z 
    M 32 58 
    L 68 58 
    L 68 64 
    L 32 64 Z 
    M 32 70 
    L 68 70 
    L 68 76 
    L 32 76 Z" 
    fill="#1C1C1E"/>
</svg>
""",
    "tool_delete": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 22 22 L 78 78 M 78 22 L 22 78" 
        stroke="#1C1C1E" stroke-width="16" stroke-linecap="round"/>
</svg>
""",
    "tool_shuffle": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 16 30 L 36 30 C 52 30 48 70 64 70 L 76 70" fill="none" stroke="#1C1C1E" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 16 70 L 36 70 C 42 70 45 61 48 53" fill="none" stroke="#1C1C1E" stroke-width="12" stroke-linecap="round"/>
  <path d="M 52 47 C 55 39 58 30 64 30 L 76 30" fill="none" stroke="#1C1C1E" stroke-width="12" stroke-linecap="round"/>
  <polygon points="72,16 90,30 72,44" fill="#1C1C1E"/>
  <polygon points="72,56 90,70 72,84" fill="#1C1C1E"/>
</svg>
""",
    "tool_next": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 30 18 C 27.5 16.5 24 18.2 24 21.5 L 24 78.5 C 24 81.8 27.5 83.5 30 82 L 78 53.5 C 80.5 52 80.5 48 78 46.5 Z" 
        fill="#1C1C1E"/>
</svg>
""",
    "tool_back": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 70 18 C 72.5 16.5 76 18.2 76 21.5 L 76 78.5 C 76 81.8 72.5 83.5 70 82 L 22 53.5 C 19.5 52 19.5 48 22 46.5 Z" 
        fill="#1C1C1E"/>
</svg>
""",
    "tool_account": """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="32" r="20" fill="#1C1C1E"/>
  <path d="M 16 84 C 16 65 30 57 50 57 C 70 57 84 65 84 84 C 84 86 82 88 80 88 L 20 88 C 18 88 16 86 16 84 Z" fill="#1C1C1E"/>
</svg>
"""
]

print("5. Generating iOS In-App Imagesets...")
func makeImageset(name: String, isTemplate: Bool, renderBlock: (Int, String) -> Void) {
    let imagesetDir = "\(iosAssetsDir)/\(name).imageset"
    try? FileManager.default.createDirectory(atPath: imagesetDir, withIntermediateDirectories: true)
    renderBlock(1, "\(imagesetDir)/\(name)_1x.png")
    renderBlock(2, "\(imagesetDir)/\(name)_2x.png")
    renderBlock(3, "\(imagesetDir)/\(name)_3x.png")
    
    let templateMode = isTemplate ? "template" : "original"
    let contentsJson = """
{
  "images" : [
    {
      "idiom" : "universal",
      "filename" : "\(name)_1x.png",
      "scale" : "1x"
    },
    {
      "idiom" : "universal",
      "filename" : "\(name)_2x.png",
      "scale" : "2x"
    },
    {
      "idiom" : "universal",
      "filename" : "\(name)_3x.png",
      "scale" : "3x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  },
  "properties" : {
    "template-rendering-intent" : "\(templateMode)"
  }
}
"""
    try! contentsJson.write(toFile: "\(imagesetDir)/Contents.json", atomically: true, encoding: .utf8)
}

// iOS Face imagesets (44pt base -> 44, 88, 132 px)
makeImageset(name: "face_baby", isTemplate: false) { scale, path in
    resizeImage(sourcePath: babyCutout, outPath: path, width: 44 * scale, height: 44 * scale)
}
makeImageset(name: "face_boy", isTemplate: false) { scale, path in
    resizeImage(sourcePath: boyCutout, outPath: path, width: 44 * scale, height: 44 * scale)
}
makeImageset(name: "face_girl", isTemplate: false) { scale, path in
    resizeImage(sourcePath: girlCutout, outPath: path, width: 44 * scale, height: 44 * scale)
}

// iOS Tool imagesets (32pt base -> 32, 64, 96 px)
for (key, svgString) in svgs {
    makeImageset(name: key, isTemplate: true) { scale, path in
        renderSVGData(svgString: svgString, outPath: path, width: 32 * scale, height: 32 * scale)
    }
}

print("6. Generating Android In-App Drawables...")
// Drawables across mdpi (24px/36px), hdpi (36px/54px), xhdpi (48px/72px), xxhdpi (72px/108px), xxxhdpi (96px/144px)
let androidScales: [(folder: String, toolSize: Int, faceSize: Int)] = [
    ("drawable-mdpi", 24, 40),
    ("drawable-hdpi", 36, 60),
    ("drawable-xhdpi", 48, 80),
    ("drawable-xxhdpi", 72, 120),
    ("drawable-xxxhdpi", 96, 160)
]

for entry in androidScales {
    let folderPath = "\(androidResDir)/\(entry.folder)"
    resizeImage(sourcePath: babyCutout, outPath: "\(folderPath)/ic_baby.png", width: entry.faceSize, height: entry.faceSize)
    resizeImage(sourcePath: boyCutout, outPath: "\(folderPath)/ic_boy.png", width: entry.faceSize, height: entry.faceSize)
    resizeImage(sourcePath: girlCutout, outPath: "\(folderPath)/ic_girl.png", width: entry.faceSize, height: entry.faceSize)
    
    for (key, svgString) in svgs {
        renderSVGData(svgString: svgString, outPath: "\(folderPath)/\(key).png", width: entry.toolSize, height: entry.toolSize)
    }
}

print("All production assets generated successfully!")
