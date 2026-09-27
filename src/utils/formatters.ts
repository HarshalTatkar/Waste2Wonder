export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDifficultyColor(difficulty: string): { bg: string; text: string; border: string } {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return { bg: 'bg-[#8A9A5B]', text: 'text-white', border: 'border-[#3A3A3A]' };
    case 'medium':
      return { bg: 'bg-[#C97C5D]', text: 'text-white', border: 'border-[#3A3A3A]' };
    case 'hard':
      return { bg: 'bg-[#3A3A3A]', text: 'text-white', border: 'border-[#3A3A3A]' };
    default:
      return { bg: 'bg-[#F5F1E8]', text: 'text-[#3A3A3A]', border: 'border-[#3A3A3A]' };
  }
}
