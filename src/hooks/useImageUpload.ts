import { useState, useCallback } from 'react';

export interface UploadedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export function useImageUpload(maxCount = 4) {
  const [images, setImages] = useState<UploadedFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const incoming = Array.from(files);
      const remainingSlots = maxCount - images.length;

      if (remainingSlots <= 0) {
        setError(`Maximum of ${maxCount} photos reached.`);
        return;
      }

      const filesToAdd = incoming.slice(0, remainingSlots);
      if (incoming.length > remainingSlots) {
        setError(`Only ${remainingSlots} more photo(s) could be added (max ${maxCount}).`);
      }

      const newItems: UploadedFileItem[] = filesToAdd.map((file) => ({
        id: `img-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      }));

      setImages((prev) => [...prev, ...newItems]);
    },
    [images.length, maxCount]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
    setError(null);
  }, []);

  const clearImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
  }, [images]);

  return {
    images,
    error,
    addFiles,
    removeImage,
    clearImages,
    isMaxReached: images.length >= maxCount,
    remainingSlots: Math.max(0, maxCount - images.length),
  };
}
