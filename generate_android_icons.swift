import AppKit
import Foundation

let brainDir = "/Users/danielgoodwyn/.gemini/antigravity/brain/b4230f74-fec8-4bcc-8592-bfb13a5725fe"
let androidResDir = "/Users/danielgoodwyn/src/BabyNames/Android-Baby-Names/app/src/main/res"
let babyCutoutPath = "\(brainDir)/baby_cutout.png"

guard let babyImg = NSImage(contentsOfFile: babyCutoutPath) else {
    fatalError("Failed to load baby cutout")
}

let gradientColors = [
    NSColor(calibratedRed: 0.99, green: 0.94, blue: 0.86, alpha: 1.0),
    NSColor(calibratedRed: 0.99, green: 0.83, blue: 0.76, alpha: 1.0),
    NSColor(calibratedRed: 0.84, green: 0.77, blue: 0.96, alpha: 1.0)
]
let gradient = NSGradient(colors: gradientColors)!

func saveRepAsPNG(rep: NSBitmapImageRep, outPath: String) {
    let png = rep.representation(using: .png, properties: [:])!
    try? FileManager.default.createDirectory(atPath: (outPath as NSString).deletingLastPathComponent, withIntermediateDirectories: true)
    try! png.write(to: URL(fileURLWithPath: outPath))
}

// 1. Generate Adaptive Icon layers
struct AdaptiveSpec {
    let folder: String
    let canvasSize: Int
    let faceSize: Int
}

let adaptiveSpecs: [AdaptiveSpec] = [
    AdaptiveSpec(folder: "mipmap-mdpi", canvasSize: 108, faceSize: 78),
    AdaptiveSpec(folder: "mipmap-hdpi", canvasSize: 162, faceSize: 116),
    AdaptiveSpec(folder: "mipmap-xhdpi", canvasSize: 216, faceSize: 155),
    AdaptiveSpec(folder: "mipmap-xxhdpi", canvasSize: 324, faceSize: 232),
    AdaptiveSpec(folder: "mipmap-xxxhdpi", canvasSize: 432, faceSize: 310)
]

for spec in adaptiveSpecs {
    // A. Background
    let bgRep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                 pixelsWide: spec.canvasSize,
                                 pixelsHigh: spec.canvasSize,
                                 bitsPerSample: 8,
                                 samplesPerPixel: 4,
                                 hasAlpha: true,
                                 isPlanar: false,
                                 colorSpaceName: .calibratedRGB,
                                 bytesPerRow: 0,
                                 bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bgRep)
    NSGraphicsContext.current?.imageInterpolation = .high
    gradient.draw(in: NSRect(x: 0, y: 0, width: spec.canvasSize, height: spec.canvasSize), angle: -45)
    NSGraphicsContext.restoreGraphicsState()
    saveRepAsPNG(rep: bgRep, outPath: "\(androidResDir)/\(spec.folder)/ic_launcher_background.png")
    
    // B. Foreground
    let fgRep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                 pixelsWide: spec.canvasSize,
                                 pixelsHigh: spec.canvasSize,
                                 bitsPerSample: 8,
                                 samplesPerPixel: 4,
                                 hasAlpha: true,
                                 isPlanar: false,
                                 colorSpaceName: .calibratedRGB,
                                 bytesPerRow: 0,
                                 bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: fgRep)
    NSGraphicsContext.current?.imageInterpolation = .high
    let offset = (spec.canvasSize - spec.faceSize) / 2
    babyImg.draw(in: NSRect(x: offset, y: offset, width: spec.faceSize, height: spec.faceSize),
                 from: NSRect(origin: .zero, size: babyImg.size),
                 operation: .sourceOver,
                 fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()
    saveRepAsPNG(rep: fgRep, outPath: "\(androidResDir)/\(spec.folder)/ic_launcher_foreground.png")
}

// 2. Generate Legacy Square and Round Icons
struct LegacySpec {
    let folder: String
    let size: Int
}

let legacySpecs: [LegacySpec] = [
    LegacySpec(folder: "mipmap-mdpi", size: 48),
    LegacySpec(folder: "mipmap-hdpi", size: 72),
    LegacySpec(folder: "mipmap-xhdpi", size: 96),
    LegacySpec(folder: "mipmap-xxhdpi", size: 144),
    LegacySpec(folder: "mipmap-xxxhdpi", size: 192)
]

for spec in legacySpecs {
    // Square Legacy
    let sqRep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                 pixelsWide: spec.size,
                                 pixelsHigh: spec.size,
                                 bitsPerSample: 8,
                                 samplesPerPixel: 4,
                                 hasAlpha: true,
                                 isPlanar: false,
                                 colorSpaceName: .calibratedRGB,
                                 bytesPerRow: 0,
                                 bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: sqRep)
    NSGraphicsContext.current?.imageInterpolation = .high
    gradient.draw(in: NSRect(x: 0, y: 0, width: spec.size, height: spec.size), angle: -45)
    let faceSize = Int(Double(spec.size) * 0.72)
    let offset = (spec.size - faceSize) / 2
    babyImg.draw(in: NSRect(x: offset, y: offset, width: faceSize, height: faceSize),
                 from: NSRect(origin: .zero, size: babyImg.size),
                 operation: .sourceOver,
                 fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()
    saveRepAsPNG(rep: sqRep, outPath: "\(androidResDir)/\(spec.folder)/ic_launcher.png")
    
    // Round Legacy
    let roundRep = NSBitmapImageRep(bitmapDataPlanes: nil,
                                    pixelsWide: spec.size,
                                    pixelsHigh: spec.size,
                                    bitsPerSample: 8,
                                    samplesPerPixel: 4,
                                    hasAlpha: true,
                                    isPlanar: false,
                                    colorSpaceName: .calibratedRGB,
                                    bytesPerRow: 0,
                                    bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: roundRep)
    NSGraphicsContext.current?.imageInterpolation = .high
    let circlePath = NSBezierPath(ovalIn: NSRect(x: 0, y: 0, width: spec.size, height: spec.size))
    circlePath.addClip()
    gradient.draw(in: NSRect(x: 0, y: 0, width: spec.size, height: spec.size), angle: -45)
    babyImg.draw(in: NSRect(x: offset, y: offset, width: faceSize, height: faceSize),
                 from: NSRect(origin: .zero, size: babyImg.size),
                 operation: .sourceOver,
                 fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()
    saveRepAsPNG(rep: roundRep, outPath: "\(androidResDir)/\(spec.folder)/ic_launcher_round.png")
}

print("Android mipmap assets generated successfully!")
