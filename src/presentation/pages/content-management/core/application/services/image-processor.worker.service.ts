import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CropRegion, ProcessingOptions, ProcessingResult } from '../../domain/types/image-processing.types';

@Injectable({ providedIn: 'root' })
export class ImageProcessorWorkerService {
    private worker: Worker | null = null;
    private readonly messageSubject = new Subject<any>();

    constructor(private ngZone: NgZone) { }

    processInWorker$(
        imageData: ImageData,
        cropRegion: CropRegion,
        options?: ProcessingOptions
    ): Observable<ProcessingResult> {
        return this.ensureWorker().pipe(
            switchMap(worker => {
                const id = this.generateId();

                return new Observable<ProcessingResult>(subscriber => {
                    const handler = (event: MessageEvent) => {
                        if (event.data.id === id) {
                            worker.removeEventListener('message', handler);

                            this.ngZone.run(() => {
                                if (event.data.success && event.data.data) {
                                    // Convertir ImageData en blob
                                    this.imageDataToBlob(event.data.data, options)
                                        .then(blob => {
                                            const result: ProcessingResult = {
                                                blob,
                                                metadata: {
                                                    original: { width: 0, height: 0, size: 0, type: '', lastModified: 0 },
                                                    processed: {
                                                        width: cropRegion.width,
                                                        height: cropRegion.height,
                                                        size: blob.size,
                                                        type: blob.type,
                                                        lastModified: Date.now()
                                                    },
                                                    processingTime: 0,
                                                    compressionRatio: 0
                                                }
                                            };
                                            subscriber.next(result);
                                            subscriber.complete();
                                        })
                                        .catch(error => subscriber.error(error));
                                } else {
                                    subscriber.error(event.data.error);
                                }
                            });
                        }
                    };

                    worker.addEventListener('message', handler);
                    worker.postMessage({
                        type: 'process',
                        id,
                        imageData,
                        options,
                        cropRegion
                    });
                });
            })
        );
    }

    private ensureWorker(): Observable<Worker> {
        if (this.worker) {
            return from([this.worker]);
        }

        return new Observable<Worker>(subscriber => {
            this.ngZone.runOutsideAngular(() => {
                try {
                    this.worker = new Worker(
                        new URL('../workers/image-processor.worker', import.meta.url),
                        { type: 'module' }
                    );
                    subscriber.next(this.worker);
                    subscriber.complete();
                } catch (error) {
                    subscriber.error(error);
                }
            });
        });
    }

    private async imageDataToBlob(
        imageData: ImageData,
        options?: ProcessingOptions
    ): Promise<Blob> {
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Canvas context not available');
        }

        ctx.putImageData(imageData, 0, 0);

        return await canvas.convertToBlob({
            type: options?.format || 'image/webp',
            quality: options?.quality || 0.85
        });
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    ngOnDestroy(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}