export async function loadImage(url: string): Promise<{
    file: File;
    blob: Blob;
    previewUrl: string;
}> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Image not accessible: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    if (!contentType?.startsWith('image/')) {
        throw new Error('URL is not an image');
    }

    const blob = await response.blob();

    const fileName = url.split('/').pop() || 'image.jpg';

    const file = new File([blob], fileName, {
        type: blob.type,
    });

    const previewUrl = URL.createObjectURL(blob);

    return { file, blob, previewUrl };
}
