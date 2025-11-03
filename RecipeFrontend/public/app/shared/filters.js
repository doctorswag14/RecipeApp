
app.filter('timeAgoOrDate', function() {
  return function(input) {
    if (!input) return '';

    const now = new Date();
    const created = new Date(input);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    const isSameDay = now.toDateString() === created.toDateString();

    if (isSameDay) {
      if (diffHr > 0) {
        return diffHr + 'h ago';
      } else if (diffMin > 0) {
        return diffMin + 'm ago';
      } else {
        return 'just now';
      }
    } else {
      return created.toLocaleDateString();
    }
  };
});