export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateImageUpload(files: FileList | File[], maxCount = 4): { valid: boolean; error?: string } {
  if (files.length > maxCount) {
    return { valid: false, error: `You can upload up to ${maxCount} photos only.` };
  }
  return { valid: true };
}
