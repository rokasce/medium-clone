/* eslint-disable no-case-declarations */
export const useDateFormat = () => {
  const formatDate = (
    dateString: string,
    formatType: 'short' | 'long' | 'relative' = 'short'
  ) => {
    const date = new Date(dateString);

    switch (formatType) {
      case 'long':
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);

      case 'relative':
        const seconds = Math.floor(
          (new Date().getTime() - date.getTime()) / 1000
        );
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();

      case 'short':
      default:
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(date);
    }
  };

  return { formatDate };
};
