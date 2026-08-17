export const PLATFORM_ASPECT_RATIOS: Record<string, number> = {
    web: 16 / 9,
    mobile: 9 / 16,
    pwa: 1 / 1,
};

export const PLATFORM_RATIO_LABELS: Record<string, string> = {
    web: '16:9 — Paysage (Desktop)',
    mobile: '9:16 — Portrait (Mobile)',
    pwa: '1:1 — Carré (PWA)',
};

export const PLATFORM_ICONS: Record<string, string> = {
    web: 'pi pi-desktop',
    mobile: 'pi pi-mobile',
    pwa: 'pi pi-th-large',
};

export interface ImageUploadConfig {
    acceptedTypes: string[];
    maxSizeBytes: number;
    enablePreview: boolean;
    targetPlatforms: string[];
    hint?: string;
}

export const DEFAULT_IMAGE_UPLOAD_CONFIG: ImageUploadConfig = {
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 10 * 1024 * 1024,
    enablePreview: false,
    targetPlatforms: ['web'],
    hint: undefined,
};

export type ImageUploadError =
    | { type: 'INVALID_TYPE'; file: File; acceptedTypes: string[] }
    | {
          type: 'FILE_TOO_LARGE';
          file: File;
          maxSizeBytes: number;
          actualSizeBytes: number;
      }
    | { type: 'NO_FILE' }
    | {
          type: 'MULTIPLE_FILES';
          fileCount: number;
      };

export type ImageUploadStatus = 'idle' | 'selected' | 'error';

export interface ImageSelectedResult {
    file: File;
    event: Event;
}
