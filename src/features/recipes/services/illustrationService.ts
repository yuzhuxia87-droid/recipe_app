/**
 * Canvas APIを使用して画像をイラスト風に変換するサービス
 * 水彩画風・手帳風のエフェクトを適用
 */
class IllustrationService {
  /**
   * 画像をイラスト風に変換
   * @param file 元画像ファイル
   * @param intensity 変換強度（1: 軽め, 2: 中程度（推奨）, 3: 強め）
   * @returns イラスト風変換後の画像File
   */
  async convertToIllustration(file: File, intensity: 1 | 2 | 3 = 2): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = e => {
        if (!e.target?.result) {
          reject(new Error('Failed to read image file'))
          return
        }

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
              reject(new Error('Failed to get canvas context'))
              return
            }

            // 最大サイズを設定（大きすぎる画像は縮小）
            const MAX_WIDTH = 1200
            const MAX_HEIGHT = 1200

            let width = img.width
            let height = img.height

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
              width = Math.floor(width * ratio)
              height = Math.floor(height * ratio)
            }

            canvas.width = width
            canvas.height = height

            // 画像を描画
            ctx.drawImage(img, 0, 0, width, height)

            // イラスト風エフェクトを適用
            this.applyIllustrationEffect(ctx, width, height, intensity)

            // Canvasから Blob を生成
            canvas.toBlob(
              blob => {
                if (!blob) {
                  reject(new Error('Failed to convert canvas to blob'))
                  return
                }

                // Fileオブジェクトに変換
                const filename = file.name.replace(/\.[^/.]+$/, '_illustrated.webp')
                const illustratedFile = new File([blob], filename, {
                  type: 'image/webp',
                })

                resolve(illustratedFile)
              },
              'image/webp',
              0.85 // 品質
            )
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }

        img.src = e.target.result as string
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * Canvas上の画像データにイラスト風エフェクトを適用
   */
  private applyIllustrationEffect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: 1 | 2 | 3
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // 強度に応じたパラメータ
    const params = this.getIntensityParams(intensity)

    // ピクセル単位で処理
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      if (r === undefined || g === undefined || b === undefined) continue

      // 彩度を上げる（鮮やかに）
      const hsl = this.rgbToHsl(r, g, b)
      hsl.s = Math.min(1, hsl.s * params.saturation)
      hsl.l = Math.max(0, Math.min(1, hsl.l * params.brightness))

      const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l)

      // 色を適用
      data[i] = Math.min(255, rgb.r * params.contrast)
      data[i + 1] = Math.min(255, rgb.g * params.contrast)
      data[i + 2] = Math.min(255, rgb.b * params.contrast)
    }

    // エッジ強調（輪郭を目立たせる）
    if (intensity >= 2) {
      this.emphasizeEdges(data, width, height, params.edgeStrength)
    }

    // 水彩画風のぼかし効果（強度3のみ）
    if (intensity === 3) {
      this.applyWatercolorEffect(data, width, height)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  /**
   * 強度別パラメータを取得
   */
  private getIntensityParams(intensity: 1 | 2 | 3) {
    switch (intensity) {
      case 1: // 軽め
        return { saturation: 1.15, brightness: 1.05, contrast: 1.1, edgeStrength: 0 }
      case 2: // 中程度（推奨）
        return { saturation: 1.3, brightness: 1.08, contrast: 1.15, edgeStrength: 0.3 }
      case 3: // 強め
        return { saturation: 1.5, brightness: 1.1, contrast: 1.2, edgeStrength: 0.5 }
    }
  }

  /**
   * エッジを強調（輪郭検出）
   */
  private emphasizeEdges(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    strength: number
  ): void {
    if (strength === 0) return

    const original = new Uint8ClampedArray(data)

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4

        // Sobelフィルタでエッジ検出（簡易版）
        const gx =
          -1 * (original[(idx - width * 4 - 4) || 0] || 0) +
          1 * (original[(idx - width * 4 + 4) || 0] || 0) +
          -2 * (original[(idx - 4) || 0] || 0) +
          2 * (original[(idx + 4) || 0] || 0) +
          -1 * (original[(idx + width * 4 - 4) || 0] || 0) +
          1 * (original[(idx + width * 4 + 4) || 0] || 0)

        const edge = Math.abs(gx)

        // エッジ部分を暗くして輪郭を強調
        if (edge > 50) {
          data[idx] = Math.max(0, (data[idx] || 0) - edge * strength)
          data[idx + 1] = Math.max(0, (data[idx + 1] || 0) - edge * strength)
          data[idx + 2] = Math.max(0, (data[idx + 2] || 0) - edge * strength)
        }
      }
    }
  }

  /**
   * 水彩画風効果（色のにじみ）
   */
  private applyWatercolorEffect(data: Uint8ClampedArray, width: number, height: number): void {
    const original = new Uint8ClampedArray(data)

    // 簡易的なガウシアンぼかし
    for (let y = 2; y < height - 2; y += 2) {
      for (let x = 2; x < width - 2; x += 2) {
        const idx = (y * width + x) * 4

        let r = 0,
          g = 0,
          b = 0
        let count = 0

        // 周辺ピクセルの平均を取る
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4
            r += original[i] || 0
            g += original[i + 1] || 0
            b += original[i + 2] || 0
            count++
          }
        }

        data[idx] = r / count
        data[idx + 1] = g / count
        data[idx + 2] = b / count
      }
    }
  }

  /**
   * RGB to HSL 変換
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h, s, l }
  }

  /**
   * HSL to RGB 変換
   */
  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }
}

export const illustrationService = new IllustrationService()
