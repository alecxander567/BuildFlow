"use client";

import { useState, useRef, useEffect } from "react";

interface CloudinaryUploadProps {
  onUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  buttonText?: string;
}

export default function CloudinaryUpload({
  onUpload,
  currentImageUrl = "",
  buttonText = "Choose Image",
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  // Extract public ID from Cloudinary URL
  const getPublicIdFromUrl = (url: string): string | null => {
    try {
      // Expected format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex === -1) return null;

      let path = url.substring(uploadIndex + 8); 

      // Remove version prefix if exists (v1234567890/)
      const versionMatch = path.match(/^v\d+\//);
      if (versionMatch) {
        path = path.substring(versionMatch[0].length);
      }

      // Remove file extension (everything after last dot)
      const lastDot = path.lastIndexOf(".");
      if (lastDot !== -1) {
        path = path.substring(0, lastDot);
      }

      return path;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  };

  // Delete image from Cloudinary using API route
  const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete from Cloudinary");
      }

      return true;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      onUpload(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset file input so same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (!imageUrl) return;

    setDeleting(true);
    setError(null);

    try {
      const publicId = getPublicIdFromUrl(imageUrl);

      if (publicId) {
        // Delete from Cloudinary using API route
        await deleteFromCloudinary(publicId);
      }

      // Remove from UI and parent component
      setImageUrl("");
      onUpload("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
      // Optional: Still remove from UI even if Cloudinary delete fails
      // Uncomment if you want to remove from UI anyway:
      // setImageUrl("");
      // onUpload("");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="image-upload"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 flex-1"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "var(--bg-card)";
            }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ?
              "Uploading..."
            : deleting ?
              "Deleting..."
            : buttonText}
          </label>

          {imageUrl && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "#DC2626",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#DC2626";
                e.currentTarget.style.backgroundColor = "#FEF2F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {deleting ? "Deleting..." : "Remove"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
