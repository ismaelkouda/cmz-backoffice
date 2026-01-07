export type ImageFormat =
    | 'image/jpeg'
    | 'image/png'
    | 'image/webp'
    | 'image/avif';
export type ProcessingStage =
    | 'idle'
    | 'loading'
    | 'processing'
    | 'completed'
    | 'error';

export interface ImageMetadata {
    width: number;
    height: number;
    size: number;
    type: string;
    lastModified: number;
}

export interface ProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: ImageFormat;
    maintainAspectRatio?: boolean;
    compressionLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface ProcessingResult {
    blob: Blob;
    metadata: {
        original: ImageMetadata;
        processed: ImageMetadata;
        processingTime: number;
        compressionRatio: number;
    };
}

export interface CropRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Erreurs métier
export class ImageProcessingError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = 'ImageProcessingError';
    }
}

export const ImageErrors = {
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    PROCESSING_FAILED: 'PROCESSING_FAILED',
    DIMENSIONS_TOO_SMALL: 'DIMENSIONS_TOO_SMALL',
    DIMENSIONS_TOO_LARGE: 'DIMENSIONS_TOO_LARGE',
} as const;
