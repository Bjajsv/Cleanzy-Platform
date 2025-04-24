import imageCompression from 'browser-image-compression';

const IMAGE_CONFIG = {
    maxSizeMB: 1,
    sizes: {
        thumbnail: { width: 150, height: 150 },
        small: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        large: { width: 1200, height: 1200 }
    },
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    quality: 0.8
};

class ImageHandlingService {
    async validateImage(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!IMAGE_CONFIG.acceptedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Accepted types: JPG, PNG, WebP');
        }

        if (file.size > IMAGE_CONFIG.maxFileSize) {
            throw new Error('File size exceeds 5MB limit');
        }

        return true;
    }

    async optimizeImage(file, options = {}) {
        const defaultOptions = {
            maxSizeMB: IMAGE_CONFIG.maxSizeMB,
            maxWidthOrHeight: IMAGE_CONFIG.sizes.large.width,
            useWebWorker: true,
            preserveExif: true,
            quality: IMAGE_CONFIG.quality
        };

        const compressionOptions = { ...defaultOptions, ...options };

        try {
            const compressedFile = await imageCompression(file, compressionOptions);
            return compressedFile;
        } catch (error) {
            console.error('Image compression failed:', error);
            throw new Error('Failed to optimize image');
        }
    }

    async generateThumbnail(file) {
        return this.optimizeImage(file, {
            maxWidthOrHeight: IMAGE_CONFIG.sizes.thumbnail.width,
            quality: 0.7
        });
    }

    getImageUrl(path, size = 'medium', format = 'webp') {
        const baseUrl = process.env.REACT_APP_CDN_URL || '';
        const dimensions = IMAGE_CONFIG.sizes[size];
        return `${baseUrl}${path}?w=${dimensions.width}&h=${dimensions.height}&fm=${format}&q=${IMAGE_CONFIG.quality * 100}`;
    }

    async uploadImage(file, productId) {
        try {
            await this.validateImage(file);
            const optimizedImage = await this.optimizeImage(file);
            const thumbnail = await this.generateThumbnail(file);

            const formData = new FormData();
            formData.append('image', optimizedImage);
            formData.append('thumbnail', thumbnail);
            formData.append('productId', productId);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    }
}

export const imageHandlingService = new ImageHandlingService(); 