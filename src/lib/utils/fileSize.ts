/** Human-readable file size, e.g. "240 KB" or "1.4 MB". */
export const formatBytes = (bytes?: number | null) => {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
