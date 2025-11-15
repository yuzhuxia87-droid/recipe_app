import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

const BUCKET_NAME = 'recipe-images'

export const imageService = {
  /**
   * 画像圧縮
   */
  async compressImage(file: File, maxSizeMB = 1): Promise<Blob> {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('画像圧縮エラー:', error)
      throw error
    }
  },

  /**
   * サムネイル生成
   */
  async createThumbnail(file: File): Promise<Blob> {
    return await imageCompression(file, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 300,
      useWebWorker: true,
      fileType: 'image/webp',
    })
  },

  /**
   * Supabase Storageに画像アップロード
   * ファイル名は安全な形式で自動生成（日本語やスペースなどの特殊文字を含むファイル名でも対応）
   */
  async uploadImage(blob: Blob, originalFileName: string): Promise<string> {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)

    // 拡張子のみを元のファイル名から抽出（存在しない場合はwebpをデフォルト）
    const extension = originalFileName.split('.').pop()?.toLowerCase() || 'webp'

    // 安全なファイル名を生成（ASCII文字、数字、ハイフン、アンダースコア、ピリオドのみ）
    const safeFileName = `${timestamp}_${randomString}.${extension}`

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(safeFileName, blob, {
      contentType: 'image/webp',
      upsert: false,
    })

    if (error) {
      console.error('画像アップロードエラー:', error)
      throw error
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(safeFileName)

    return publicUrl
  },

  /**
   * 画像削除
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // URLからファイルパスを抽出
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts[pathParts.length - 1]

      if (!filePath) return

      const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('画像削除エラー:', error)
      // エラーでも続行（画像が既に削除されている場合など）
    }
  },

  /**
   * 画像とサムネイルを両方アップロード
   */
  async uploadImageWithThumbnail(file: File): Promise<{
    imageUrl: string
    thumbnailUrl: string
  }> {
    const [compressedImage, thumbnail] = await Promise.all([
      this.compressImage(file),
      this.createThumbnail(file),
    ])

    const [imageUrl, thumbnailUrl] = await Promise.all([
      this.uploadImage(compressedImage, `full_${file.name}`),
      this.uploadImage(thumbnail, `thumb_${file.name}`),
    ])

    return { imageUrl, thumbnailUrl }
  },
}
