"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { User, Loader2, Camera } from "lucide-react";
import { updateProfileImage } from "../actions";
import imageCompression from "browser-image-compression";

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string | null;
}

export function ProfileImageUpload({
  currentImage,
  userName,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    let file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Convert HEIC to JPEG if needed
      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });

        const blob = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob;

        if (blob) {
          file = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
            type: "image/jpeg",
          });
        }
      }

      // Compress image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const newBlob = await upload(compressedFile.name, compressedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      await updateProfileImage(newBlob.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="group relative">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-600 text-white shadow-lg">
        {isUploading && <Loader2 className="h-6 w-6 animate-spin" />}
        {!isUploading && currentImage && (
          <Image
            src={currentImage}
            alt={userName ?? "User"}
            fill
            className="object-cover"
          />
        )}
        {!isUploading && !currentImage && <User size={32} />}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
      >
        <Camera className="h-6 w-6 text-white" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
