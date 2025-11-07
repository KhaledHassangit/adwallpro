"use client"

import { api } from "./api"

export interface UploadResult {
  url: string
  publicId: string
}

export interface UploadOptions {
  folder?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
  quality?: number
  width?: number
  height?: number
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: "adwell",
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  quality: 80,
}

export class UploadError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "UploadError"
  }
}

export async function uploadImage(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Validate file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    throw new UploadError(
      `File type ${file.type} is not allowed. Allowed types: ${opts.allowedTypes.join(", ")}`,
      "INVALID_FILE_TYPE",
    )
  }

  // Validate file size
  if (opts.maxSize && file.size > opts.maxSize) {
    throw new UploadError(
      `File size ${file.size} exceeds maximum allowed size of ${opts.maxSize} bytes`,
      "FILE_TOO_LARGE",
    )
  }

  try {
    // If we need to resize the image, do it client-side
    let processedFile = file
    if (opts.width || opts.height || opts.quality) {
      processedFile = await resizeImage(file, opts)
    }

    const result = await api.uploadImage(processedFile, opts.folder)
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new UploadError(`Upload failed: ${error.message}`, "UPLOAD_FAILED")
    }
    throw new UploadError("Upload failed with unknown error", "UNKNOWN_ERROR")
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await api.deleteImage(publicId)
  } catch (error) {
    if (error instanceof Error) {
      throw new UploadError(`Delete failed: ${error.message}`, "DELETE_FAILED")
    }
    throw new UploadError("Delete failed with unknown error", "UNKNOWN_ERROR")
  }
}

async function resizeImage(file: File, options: UploadOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      const { width: maxWidth, height: maxHeight } = options

      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          } else {
            reject(new Error("Failed to resize image"))
          }
        },
        file.type,
        (options.quality || 80) / 100,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Cloudinary-specific functions
export function getCloudinaryUrl(publicId: string, transformations?: Record<string, any>): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error("Cloudinary cloud name not configured")
  }

  let url = `https://res.cloudinary.com/${cloudName}/image/upload`

  if (transformations) {
    const params = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(",")
    url += `/${params}`
  }

  url += `/${publicId}`
  return url
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "auto" | "webp" | "jpg" | "png"
    crop?: "fill" | "fit" | "scale" | "crop"
  } = {},
): string {
  const transformations: Record<string, any> = {
    f: options.format || "auto",
    q: options.quality || "auto",
  }

  if (options.width) transformations.w = options.width
  if (options.height) transformations.h = options.height
  if (options.crop) transformations.c = options.crop

  return getCloudinaryUrl(publicId, transformations)
}
