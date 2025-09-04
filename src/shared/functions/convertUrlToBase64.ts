export function convertUrlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Important si l'image vient d'un serveur externe
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return reject('Impossible de créer le contexte du canvas');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png'); // Format PNG
            resolve(dataURL);
        };
        img.onerror = (err) => reject(err);
    });
}
