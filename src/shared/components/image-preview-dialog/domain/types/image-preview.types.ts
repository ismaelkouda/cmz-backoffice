export interface ImagePreviewData {
    url: string;
    fileName?: string | null;
    fileSize?: string | null;
    alt?: string;
    mimeType?: string;
}

export interface ImagePreviewConfig {
    showDownload?: boolean;
    showMetadata?: boolean;
    title?: string;
}
