import { Injectable } from '@angular/core';
import { Observable, defer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CropRegion,
    ImageErrors,
    ImageMetadata,
    ImageProcessingError,
    ProcessingOptions,
    ProcessingResult,
} from '../../domain/types/image-processing.types';

@Injectable({ providedIn: 'root' })
export class ImageProcessorCoreService {
    // Méthodes purement fonctionnelles

    /**
     * Charger une image depuis une URL ou un File
     */
    loadImage$(source: string | File): Observable<HTMLImageElement> {
        return new Observable<HTMLImageElement>((subscriber) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            const objectUrl =
                typeof source === 'string'
                    ? source
                    : URL.createObjectURL(source);

            img.onload = () => {
                subscriber.next(img);
                subscriber.complete();
                if (typeof source !== 'string') {
                    URL.revokeObjectURL(objectUrl);
                }
            };

            img.onerror = () => {
                subscriber.error(
                    new ImageProcessingError(
                        'Failed to load image',
                        ImageErrors.PROCESSING_FAILED
                    )
                );
                if (typeof source !== 'string') {
                    URL.revokeObjectURL(objectUrl);
                }
            };

            img.src = objectUrl;
        });
    }

    /**
     * Valider un fichier image (pure logique)
     */
    validateFile(
        file: File,
        maxSizeMB = 20
    ): { valid: boolean; error?: ImageProcessingError } {
        if (!file.type.startsWith('image/')) {
            return {
                valid: false,
                error: new ImageProcessingError(
                    'File is not an image',
                    ImageErrors.INVALID_FILE_TYPE
                ),
            };
        }

        const supportedFormats = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/avif',
        ];
        if (!supportedFormats.includes(file.type)) {
            return {
                valid: false,
                error: new ImageProcessingError(
                    'Unsupported image format',
                    ImageErrors.UNSUPPORTED_FORMAT
                ),
            };
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            return {
                valid: false,
                error: new ImageProcessingError(
                    `File too large (max ${maxSizeMB}MB)`,
                    ImageErrors.FILE_TOO_LARGE
                ),
            };
        }

        return { valid: true };
    }

    /**
     * Rogner une image avec Canvas
     */
    cropImage$(
        image: HTMLImageElement,
        cropRegion: CropRegion,
        options: ProcessingOptions = {}
    ): Observable<ProcessingResult> {
        return defer(() => {
            const startTime = performance.now();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', {
                alpha: options.format === 'image/png',
                willReadFrequently: false,
            });

            if (!ctx) {
                throw new ImageProcessingError(
                    'Canvas context not available',
                    ImageErrors.PROCESSING_FAILED
                );
            }

            // Calculer les dimensions de sortie
            const outputDimensions = this.calculateOutputDimensions(
                cropRegion,
                image.naturalWidth,
                image.naturalHeight,
                options
            );

            canvas.width = outputDimensions.width;
            canvas.height = outputDimensions.height;

            // Configuration qualité
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Dessiner la zone rognée
            ctx.drawImage(
                image,
                cropRegion.x,
                cropRegion.y,
                cropRegion.width,
                cropRegion.height,
                0,
                0,
                outputDimensions.width,
                outputDimensions.height
            );

            // Convertir en blob
            return this.canvasToBlob$(
                canvas,
                options.format,
                options.quality
            ).pipe(
                map((blob) =>
                    this.createProcessingResult(
                        blob,
                        image,
                        startTime,
                        outputDimensions
                    )
                )
            );
        });
    }

    /**
     * Optimiser une image avec compression progressive
     */
    optimizeImage$(
        image: HTMLImageElement,
        options: ProcessingOptions = {}
    ): Observable<ProcessingResult> {
        return defer(() => {
            const startTime = performance.now();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', {
                alpha: options.format === 'image/png',
                willReadFrequently: false,
            });

            if (!ctx) {
                throw new ImageProcessingError(
                    'Canvas context not available',
                    ImageErrors.PROCESSING_FAILED
                );
            }

            // Calculer les dimensions optimisées
            const dimensions = this.calculateOptimizedDimensions(
                image.naturalWidth,
                image.naturalHeight,
                options
            );

            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            // Configuration qualité
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Dessiner l'image redimensionnée
            ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

            // Convertir en blob avec qualité adaptative
            return this.canvasToOptimizedBlob$(canvas, options).pipe(
                map((blob) =>
                    this.createProcessingResult(
                        blob,
                        image,
                        startTime,
                        dimensions
                    )
                )
            );
        });
    }

    // Méthodes utilitaires privées
    private calculateOutputDimensions(
        cropRegion: CropRegion,
        originalWidth: number,
        originalHeight: number,
        options: ProcessingOptions
    ): { width: number; height: number } {
        let { width, height } = cropRegion;

        // Appliquer les contraintes de taille max
        if (options.maxWidth && width > options.maxWidth) {
            const ratio = options.maxWidth / width;
            width = options.maxWidth;
            height = height * ratio;
        }

        if (options.maxHeight && height > options.maxHeight) {
            const ratio = options.maxHeight / height;
            height = options.maxHeight;
            width = width * ratio;
        }

        // Arrondir aux dimensions paires
        width = Math.floor(width);
        height = Math.floor(height);

        return { width, height };
    }

    private calculateOptimizedDimensions(
        originalWidth: number,
        originalHeight: number,
        options: ProcessingOptions
    ): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        const {
            maxWidth = 1920,
            maxHeight = 1080,
            maintainAspectRatio = true,
        } = options;

        if (width > maxWidth || height > maxHeight) {
            if (maintainAspectRatio) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            } else {
                width = Math.min(width, maxWidth);
                height = Math.min(height, maxHeight);
            }
        }

        // Dimensions paires pour certains codecs
        width = width % 2 === 0 ? width : width - 1;
        height = height % 2 === 0 ? height : height - 1;

        return { width, height };
    }

    private canvasToBlob$(
        canvas: HTMLCanvasElement,
        format?: string,
        quality?: number
    ): Observable<Blob> {
        return new Observable<Blob>((subscriber) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        subscriber.next(blob);
                        subscriber.complete();
                    } else {
                        subscriber.error(
                            new ImageProcessingError(
                                'Canvas to blob conversion failed',
                                ImageErrors.PROCESSING_FAILED
                            )
                        );
                    }
                },
                format || 'image/webp',
                quality || 0.85
            );
        });
    }

    private canvasToOptimizedBlob$(
        canvas: HTMLCanvasElement,
        options: ProcessingOptions
    ): Observable<Blob> {
        return new Observable<Blob>((subscriber) => {
            const strategies = [
                { format: 'image/webp' as const, quality: 0.85 },
                { format: 'image/webp' as const, quality: 0.75 },
                { format: 'image/jpeg' as const, quality: 0.8 },
                { format: 'image/jpeg' as const, quality: 0.65 },
            ];

            const tryStrategy = (index: number): void => {
                if (index >= strategies.length) {
                    subscriber.error(
                        new ImageProcessingError(
                            'All optimization strategies failed',
                            ImageErrors.PROCESSING_FAILED
                        )
                    );
                    return;
                }

                const strategy = strategies[index];
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            subscriber.next(blob);
                            subscriber.complete();
                        } else {
                            tryStrategy(index + 1);
                        }
                    },
                    strategy.format,
                    strategy.quality
                );
            };

            tryStrategy(0);
        });
    }

    private createProcessingResult(
        blob: Blob,
        originalImage: HTMLImageElement,
        startTime: number,
        outputDimensions: { width: number; height: number }
    ): ProcessingResult {
        const originalMetadata: ImageMetadata = {
            width: originalImage.naturalWidth,
            height: originalImage.naturalHeight,
            size: 0, // Non disponible ici
            type: '',
            lastModified: Date.now(),
        };

        const processingTime = performance.now() - startTime;

        return {
            blob,
            metadata: {
                original: originalMetadata,
                processed: {
                    width: outputDimensions.width,
                    height: outputDimensions.height,
                    size: blob.size,
                    type: blob.type,
                    lastModified: Date.now(),
                },
                processingTime,
                compressionRatio: 0, // Calculé par l'appelant si original size disponible
            },
        };
    }
}
