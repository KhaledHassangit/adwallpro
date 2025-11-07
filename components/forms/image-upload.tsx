"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  onImageChange: (dataUrl: string | null) => void;
  defaultImage?: string | null;
}

export function ImageUpload({ onImageChange, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الملف كبير جداً. الحد الأقصى 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-[16/9] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          dragOver
            ? "border-primary-400 bg-primary-50"
            : "border-gray-300 hover:border-primary-300 hover:bg-primary-50/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover rounded-2xl"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Upload className="h-12 w-12" />
            <div className="text-center">
              <p className="font-medium">اسحب الصورة هنا أو انقر للاختيار</p>
              <p className="text-sm">PNG, JPG حتى 5MB</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
