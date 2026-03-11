import { Platform } from '@shared/domain/enums/platform.enum';

export const PLATFORM_ASPECT_RATIOS: Record<Platform, number> = {
    [Platform.WEB]: 16 / 9,
    [Platform.MOBILE]: 9 / 16,
    [Platform.PWA]: 1 / 1,
};

export const PLATFORM_RATIO_LABELS: Record<Platform, string> = {
    [Platform.WEB]: '16:9 — Paysage (Desktop)',
    [Platform.MOBILE]: '9:16 — Portrait (Mobile)',
    [Platform.PWA]: '1:1 — Carré (PWA)',
};

export const PLATFORM_ICONS: Record<Platform, string> = {
    [Platform.WEB]: 'pi pi-desktop',
    [Platform.MOBILE]: 'pi pi-mobile',
    [Platform.PWA]: 'pi pi-th-large',
};

export interface ImageUploadConfig {
    acceptedTypes: string[];
    maxSizeBytes: number;
    enablePreview: boolean;
    targetPlatforms: Platform[];
    hint?: string;
}

export const DEFAULT_IMAGE_UPLOAD_CONFIG: ImageUploadConfig = {
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 10 * 1024 * 1024,
    enablePreview: false,
    targetPlatforms: [Platform.WEB],
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
