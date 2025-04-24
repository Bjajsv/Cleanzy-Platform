export const imageUtils = {
    getOptimalImageSize: (containerWidth) => {
        // Return the optimal image size based on container
        const breakpoints = [320, 480, 768, 1024, 1920];
        return breakpoints.find(bp => bp >= containerWidth) || breakpoints[0];
    },

    generateImageUrl: (path, options = {}) => {
        const baseUrl = process.env.REACT_APP_CDN_URL;
        const { width, quality = 80, format = 'webp' } = options;
        return `${baseUrl}${path}?w=${width}&q=${quality}&fm=${format}`;
    },

    validateImage: (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid image format');
        }

        if (file.size > maxSize) {
            throw new Error('File size too large');
        }

        return true;
    }
}; 