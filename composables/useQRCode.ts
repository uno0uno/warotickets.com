import QRCode from 'qrcode'

/**
 * Composable for generating and downloading QR codes
 */
export function useQRCode() {
  /**
   * Generate QR code as data URL (PNG base64)
   */
  async function generateQRDataURL(text: string, options?: {
    width?: number
    margin?: number
    color?: { dark?: string; light?: string }
  }): Promise<string> {
    const opts = {
      width: options?.width || 400,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF'
      }
    }

    return await QRCode.toDataURL(text, opts)
  }

  /**
   * Download QR code as PNG file
   */
  async function downloadQR(text: string, filename: string, options?: {
    width?: number
    margin?: number
  }): Promise<void> {
    const dataURL = await generateQRDataURL(text, options)

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    generateQRDataURL,
    downloadQR
  }
}
