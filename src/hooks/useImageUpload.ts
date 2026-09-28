import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface UploadedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  storageUrl?: string;    // populated after upload to Supabase Storage
  uploading?: boolean;
}

export function useImageUpload(maxCount = 4, bucket = 'uploads') {
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
        uploading: false,
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

  /**
   * Upload all local images to Supabase Storage.
   * Returns array of public URLs in the same order as `images`.
   * Already-uploaded images (have storageUrl) are skipped.
   */
  const uploadAllToStorage = useCallback(async (): Promise<string[]> => {
    const results: string[] = [];

    for (const item of images) {
      if (item.storageUrl) {
        results.push(item.storageUrl);
        continue;
      }

      // Mark as uploading
      setImages((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, uploading: true } : i)
      );

      try {
        const path = `${bucket}/${Date.now()}-${item.file.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, item.file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        const url = data.publicUrl;

        setImages((prev) =>
          prev.map((i) => i.id === item.id ? { ...i, uploading: false, storageUrl: url } : i)
        );
        results.push(url);
      } catch (err) {
        setImages((prev) =>
          prev.map((i) => i.id === item.id ? { ...i, uploading: false } : i)
        );
        setError((err as Error).message);
        throw err;
      }
    }

    return results;
  }, [images, bucket]);

  return {
    images,
    error,
    addFiles,
    removeImage,
    clearImages,
    uploadAllToStorage,
    isMaxReached: images.length >= maxCount,
    remainingSlots: Math.max(0, maxCount - images.length),
    isUploading: images.some((i) => i.uploading),
  };
}
