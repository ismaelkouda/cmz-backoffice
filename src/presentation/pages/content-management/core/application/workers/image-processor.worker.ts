/// <reference lib="webworker" />

import {
    CropRegion,
    ImageProcessingError,
    ProcessingOptions
} from '../../domain/types/image-processing.types';

interface WorkerMessage {
    type: 'process' | 'optimize';
    id: string;
    imageData: ImageData;
    options?: ProcessingOptions;
    cropRegion?: CropRegion;
}

interface WorkerResult {
    id: string;
    success: boolean;
    data?: ImageData;
    error?: ImageProcessingError;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
    const { type, id, imageData, options, cropRegion } = event.data;

    try {
        let result: ImageData;

        if (type === 'process' && cropRegion) {
            result = await processInWorker(imageData, cropRegion, options);
        } else {
            result = await optimizeInWorker(imageData, options);
        }

        self.postMessage({
            id,
            success: true,
            data: result
        });
    } catch (error) {
        self.postMessage({
            id,
            success: false,
            error: error instanceof ImageProcessingError
                ? error
                : new ImageProcessingError(
                    'Worker processing failed',
                    'PROCESSING_FAILED',
                    error
                )
        });
    }
};

async function processInWorker(
    imageData: ImageData,
    cropRegion: CropRegion,
    options?: ProcessingOptions
): Promise<ImageData> {
    // Implémentation optimisée pour le Worker
    // Utiliser OffscreenCanvas si disponible
    return new Promise((resolve, reject) => {
        try {
            const canvas = new OffscreenCanvas(cropRegion.width, cropRegion.height);
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new ImageProcessingError('Canvas context not available', 'PROCESSING_FAILED'));
                return;
            }

            // Créer un ImageBitmap depuis les données
            createImageBitmap(
                new ImageData(
                    new Uint8ClampedArray(imageData.data),
                    imageData.width,
                    imageData.height
                ),
                cropRegion.x,
                cropRegion.y,
                cropRegion.width,
                cropRegion.height
            ).then(bitmap => {
                ctx.drawImage(bitmap, 0, 0);
                const croppedData = ctx.getImageData(0, 0, cropRegion.width, cropRegion.height);
                resolve(croppedData);
            }).catch(reject);
        } catch (error) {
            reject(new ImageProcessingError('Processing failed', 'PROCESSING_FAILED', error));
        }
    });
}

async function optimizeInWorker(
    imageData: ImageData,
    options?: ProcessingOptions
): Promise<ImageData> {
    // Logique d'optimisation dans le Worker
    return imageData; // Simplifié pour l'exemple
}