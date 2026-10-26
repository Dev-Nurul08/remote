export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const calculateReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200) || 1;
  return `${mins} min read`;
};
