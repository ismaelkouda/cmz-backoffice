export async function urlToFile(url: string, fileName?: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();

    const name =
        fileName ??
        url.substring(url.lastIndexOf('/') + 1).split('?')[0] ??
        'image';

    return new File([blob], name, { type: blob.type });
}
