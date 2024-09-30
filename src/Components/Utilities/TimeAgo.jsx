export const timeAgo = (timestamp) => {
    const now = new Date();
    const secondsPast = Math.floor((now - new Date(timestamp)) / 1000);
  
    if (secondsPast < 60) {
      return 'Just now';
    }
    if (secondsPast < 3600) {
      const minutes = Math.floor(secondsPast / 60);
      return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    }
    if (secondsPast < 86400) {
      const hours = Math.floor(secondsPast / 3600);
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    }
    const days = Math.floor(secondsPast / 86400);
    return days === 1 ? `${days} day ago` : `${days} days ago`;
};