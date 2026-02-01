/**
 * Composable for image compression and WebP conversion
 */
export function useImageCompression() {
  /**
   * Compress and convert image to WebP format using Canvas API
   * @param file - Original image file
   * @param quality - WebP quality (0.0 to 1.0), default 0.82
   * @returns Compressed File in WebP format
   */
  async function compressToWebP(file: File, quality: number = 0.82): Promise<File> {
    return new Promise((resolve, reject) => {
      // Skip if already WebP and small (<100KB)
      const skipThreshold = 100 * 1024
      if (file.type === 'image/webp' && file.size < skipThreshold) {
        resolve(file)
        return
      }

      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'))
              return
            }

            const originalName = file.name.replace(/\.[^.]+$/, '')
            const newFileName = `${originalName}.webp`

            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            })

            console.log(
              `[useImageCompression] ${file.name} (${(file.size / 1024).toFixed(1)}KB) → ${newFileName} (${(compressedFile.size / 1024).toFixed(1)}KB)`
            )

            URL.revokeObjectURL(img.src)
            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        reject(new Error('Could not load image'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Safely compress with fallback to original on error
   */
  async function compressToWebPSafe(file: File, quality: number = 0.82): Promise<File> {
    try {
      return await compressToWebP(file, quality)
    } catch (error) {
      console.warn('[useImageCompression] Compression failed, using original:', error)
      return file
    }
  }

  return {
    compressToWebP,
    compressToWebPSafe
  }
}
