import Foundation
import Vision
import CoreImage
import AppKit

func removeBackground(inputPath: String, outputPath: String) {
    guard let inputURL = URL(string: "file://" + inputPath),
          let ciImage = CIImage(contentsOf: inputURL) else {
        print("Failed to load \(inputPath)")
        return
    }
    
    let request = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
    
    do {
        try handler.perform([request])
        guard let result = request.results?.first else {
            print("No mask generated for \(inputPath)")
            return
        }
        
        let mask = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
        let maskCI = CIImage(cvPixelBuffer: mask)
        
        // Blend input with transparent background using mask
        guard let filter = CIFilter(name: "CIBlendWithMask") else { return }
        filter.setValue(ciImage, forKey: kCIInputImageKey)
        filter.setValue(CIImage.empty(), forKey: kCIInputBackgroundImageKey)
        filter.setValue(maskCI, forKey: kCIInputMaskImageKey)
        
        guard let outputCI = filter.outputImage else { return }
        let rep = NSCIImageRep(ciImage: outputCI)
        let nsImage = NSImage(size: rep.size)
        nsImage.addRepresentation(rep)
        
        guard let tiffData = nsImage.tiffRepresentation,
              let bitmapRep = NSBitmapImageRep(data: tiffData),
              let pngData = bitmapRep.representation(using: .png, properties: [:]) else {
            print("Failed to encode PNG")
            return
        }
        
        try pngData.write(to: URL(fileURLWithPath: outputPath))
        print("Successfully created \(outputPath)")
    } catch {
        print("Error: \(error)")
    }
}

let brainDir = "/Users/danielgoodwyn/.gemini/antigravity/brain/b4230f74-fec8-4bcc-8592-bfb13a5725fe"
removeBackground(inputPath: "\(brainDir)/app_icon_v2.jpg", outputPath: "\(brainDir)/baby_cutout.png")
removeBackground(inputPath: "\(brainDir)/boy_face_v2.jpg", outputPath: "\(brainDir)/boy_cutout.png")
removeBackground(inputPath: "\(brainDir)/girl_face_v2.jpg", outputPath: "\(brainDir)/girl_cutout.png")
