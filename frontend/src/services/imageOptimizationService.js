import imageCompression from 'browser-image-compression';

export const optimizeImage = async (imageFile) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        preserveExif: true
    };

    try {
        const compressedFile = await imageCompression(imageFile, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return imageFile;
    }
}; 