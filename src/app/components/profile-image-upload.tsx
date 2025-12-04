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
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500/30 bg-purple-900/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
        {isUploading && (
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        )}
        {!isUploading && currentImage && (
          <Image
            src={currentImage}
            alt={userName ?? "User"}
            fill
            className="object-cover"
          />
        )}
        {!isUploading && !currentImage && (
          <User size={40} className="text-purple-300" />
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 disabled:cursor-not-allowed"
      >
        <Camera className="h-8 w-8 text-white drop-shadow-md" />
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
