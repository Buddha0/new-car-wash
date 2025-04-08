// components/ui/image-upload.tsx
"use client";

import { useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the uploadthing hook
  const { startUpload } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      console.log("Upload completed:", res);
      if (res && res.length > 0) {
        // Add the uploaded image URL to the form
        res.forEach((file) => {
          if (file.url) {
            onChange(file.url);
          }
        });
      }
      setIsUploading(false);
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      setError(err.message);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const files = Array.from(e.target.files);
      const result = await startUpload(files);

      // Double-check the result in case callback fails
      if (result && result.length > 0) {
        result.forEach((file) => {
          if (file.url) {
            onChange(file.url);
          }
        });
      } else {
        setError(
          "Upload completed but no files returned. Check console for details."
        );
        console.warn("Upload completed but no files returned:", result);
      }
    } catch (err) {
      console.error("Error starting upload:", err);
      setError(err instanceof Error ? err.message : "Failed to start upload");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Product image"
              src={url}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload an Image"}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          disabled={disabled || isUploading}
          className="hidden"
          onChange={handleFileChange}
          title="Upload an image"
        />

        {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}

        <p className="text-xs text-muted-foreground mt-2">
          Recommended size: 1000x1000px. Max size: 4MB
        </p>

        {/* Display manual guidance if values are empty but we just uploaded */}
        {value.length === 0 && isUploading && (
          <p className="text-xs text-amber-500 mt-2">
            If your image uploads but doesn't appear, you may need to manually
            copy the URL from the console and add it to your product.
          </p>
        )}
      </div>
    </div>
  );
}
