// export const timeAgo = (timestamp) => {
//     const now = new Date();
//     const secondsPast = Math.floor((now - new Date(timestamp)) / 1000);
  
//     if (secondsPast < 60) {
//       return 'Just now';
//     }
//     if (secondsPast < 3600) {
//       const minutes = Math.floor(secondsPast / 60);
//       return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
//     }
//     if (secondsPast < 86400) {
//       const hours = Math.floor(secondsPast / 3600);
//       return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
//     }
//     const days = Math.floor(secondsPast / 86400);
//     return days === 1 ? `${days} day ago` : `${days} days ago`;
// };

export function timeAgo(date) {
  const now = new Date();
  const givenDate = new Date(date);
  
  const seconds = Math.floor((now - givenDate) / 1000);
  
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  if (years > 1) return `${years} years ago`;
  if (years === 1) return `1 year ago`;

  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  if (months > 1) return `${months} months ago`;
  if (months === 1) return `1 month ago`;

  const days = Math.floor(seconds / (24 * 60 * 60));
  if (days > 1) return `${days} days ago`;
  if (days === 1) return `1 day ago`;

  const hours = Math.floor(seconds / (60 * 60));
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return `1 hour ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) return `${minutes} minutes ago`;
  if (minutes === 1) return `1 minute ago`;

  return `${seconds} seconds ago`;
}
