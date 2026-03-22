/**
 * Utility to convert an image File to WebP format using the browser's Canvas API.
 * This is a highly efficient way to optimize images on the client side before upload.
 */
export async function convertToWebP(file: File, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            image.src = e.target?.result as string;
        };

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(image, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Failed to convert image to WebP"));
                    }
                },
                "image/webp",
                quality
            );
        };

        image.onerror = () => reject(new Error("Failed to load image"));
        reader.onerror = () => reject(new Error("Failed to read file"));

        reader.readAsDataURL(file);
    });
}
