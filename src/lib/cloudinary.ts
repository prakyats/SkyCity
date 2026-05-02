/**
 * Cloudinary image transformation utility
 * cloud: drzbbbncs
 * 
 * Rules:
 * - f_auto: automatic format (WebP/AVIF)
 * - q_auto:eco: high compression while maintaining quality
 * - w_{w}: dynamic width based on usage
 */
export const cld = (path: string | null | undefined, w: number = 1200): string => {
  if (!path) return '';
  // If it's a full URL, we extract the path part after /upload/
  let cleanPath = path;
  if (path.includes('cloudinary.com')) {
    const uploadIdx = path.indexOf('/upload/');
    if (uploadIdx !== -1) {
      // Find the next slash after /upload/ (skipping existing transformations if any)
      const parts = path.split('/upload/');
      const pathPart = parts[1];
      
      if (pathPart && (pathPart.includes(',') || !pathPart.startsWith('v'))) {
        const pathSegments = pathPart.split('/');
        const firstActualSegmentIdx = pathSegments.findIndex(seg => seg.startsWith('v') && /^\d+$/.test(seg.slice(1)));
        if (firstActualSegmentIdx !== -1) {
            cleanPath = pathSegments.slice(firstActualSegmentIdx).join('/');
        } else {
            cleanPath = pathSegments.slice(pathPart.includes(',') ? 1 : 0).join('/');
        }
      } else if (pathPart) {
        cleanPath = pathPart;
      }
    }
  }
  
  return `https://res.cloudinary.com/drzbbbncs/image/upload/f_auto,q_auto:eco,w_${w}/${cleanPath}`;
};
