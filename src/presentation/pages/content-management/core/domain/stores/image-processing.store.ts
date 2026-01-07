import { Injectable, computed, inject } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { ImageProcessorCoreService } from '../../application/services/image-processor.core.service';
import { ImageProcessorWorkerService } from '../../application/services/image-processor.worker.service';
import {
    CropRegion,
    ImageProcessingError,
    ProcessingOptions,
    ProcessingResult,
    ProcessingStage,
} from '../types/image-processing.types';

interface ImageProcessingState {
    stage: ProcessingStage;
    progress: number;
    currentResult: ProcessingResult | null;
    error: ImageProcessingError | null;
    lastProcessedId: string | null;
}

const initialState: ImageProcessingState = {
    stage: 'idle',
    progress: 0,
    currentResult: null,
    error: null,
    lastProcessedId: null,
};

@Injectable({
    providedIn: 'root',
})
export class ImageProcessingStore extends signalStore(
    withState(initialState),
    withComputed(({ stage, progress, currentResult, error }) => ({
        isProcessing: computed(() => stage() === 'processing'),
        isCompleted: computed(() => stage() === 'completed'),
        hasError: computed(() => error() !== null),
        compressionRatio: computed(
            () => currentResult()?.metadata.compressionRatio || 0
        ),
        processedSize: computed(
            () => currentResult()?.metadata.processed.size || 0
        ),
    })),
    withMethods(
        (
            store,
            coreService = inject(ImageProcessorCoreService),
            workerService = inject(ImageProcessorWorkerService)
        ) => {
            // defined helpers to avoid 'this' context issues in rxMethod
            const setResult = (result: ProcessingResult): void => {
                patchState(store, {
                    currentResult: result,
                    stage: 'completed',
                    error: null,
                    progress: 100,
                });
            };

            const setError = (error: ImageProcessingError): void => {
                patchState(store, {
                    error,
                    stage: 'error',
                    progress: 0,
                });
            };

            return {
                // Actions
                setStage(stage: ProcessingStage): void {
                    patchState(store, { stage });
                },

                setProgress(progress: number): void {
                    patchState(store, { progress });
                },

                setResult,
                setError,

                reset(): void {
                    patchState(store, initialState);
                },

                // Effects
                processImage: rxMethod<{
                    image: HTMLImageElement;
                    cropRegion: CropRegion;
                    options?: ProcessingOptions;
                    useWorker?: boolean;
                }>(
                    pipe(
                        tap(() => {
                            patchState(store, {
                                stage: 'processing',
                                progress: 0,
                                error: null,
                            });
                        }),
                        switchMap(
                            ({
                                image,
                                cropRegion,
                                options,
                                useWorker = true,
                            }) => {
                                if (
                                    useWorker &&
                                    typeof Worker !== 'undefined'
                                ) {
                                    const canvas =
                                        document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');

                                    if (!ctx) {
                                        throw new Error(
                                            'Canvas context not available'
                                        );
                                    }

                                    canvas.width = image.naturalWidth;
                                    canvas.height = image.naturalHeight;
                                    ctx.drawImage(image, 0, 0);

                                    const imageData = ctx.getImageData(
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    );

                                    return workerService
                                        .processInWorker$(
                                            imageData,
                                            cropRegion,
                                            options
                                        )
                                        .pipe(
                                            tap((result) => setResult(result)),
                                            catchError((error) => {
                                                return coreService
                                                    .cropImage$(
                                                        image,
                                                        cropRegion,
                                                        options
                                                    )
                                                    .pipe(
                                                        tap((result) =>
                                                            setResult(result)
                                                        ),
                                                        catchError(
                                                            (workerError) => {
                                                                setError(
                                                                    workerError as ImageProcessingError
                                                                );
                                                                return of(null);
                                                            }
                                                        )
                                                    );
                                            })
                                        );
                                } else {
                                    return coreService
                                        .cropImage$(image, cropRegion, options)
                                        .pipe(
                                            tap((result) => setResult(result)),
                                            catchError((error) => {
                                                setError(
                                                    error as ImageProcessingError
                                                );
                                                return of(null);
                                            })
                                        );
                                }
                            }
                        )
                    )
                ),

                validateAndProcess: rxMethod<{
                    file: File;
                    cropRegion: CropRegion;
                    options?: ProcessingOptions;
                }>(
                    pipe(
                        tap(() => {
                            patchState(store, { stage: 'loading' });
                        }),
                        switchMap(({ file, cropRegion, options }) => {
                            const validation = coreService.validateFile(file);

                            if (!validation.valid && validation.error) {
                                setError(validation.error);
                                return of(null);
                            }

                            return coreService.loadImage$(file).pipe(
                                switchMap((image) => {
                                    // Calls processImage method defined in this block
                                    // Note: we can't call 'this.processImage' easily here due to the return structure refactor
                                    // But since we are returning the object, we can refer to the effect if we defined it outside,
                                    // or we can duplicate logic, OR we can just rely on the fact that store methods are available on the instance.
                                    // However, inside withMethods, we don't have the fully constructed store with these methods yet if we want to call them cross-method within the same block without 'this'.
                                    // For simplicity and safety, I will duplicate the logic or restructure to use a shared subjective approach?
                                    // Actually, simpler: just call the core/worker service chain directly here or make processImage logic reusable.
                                    // Let's simplify: validateAndProcess can just do the load and then run the logic.
                                    const safeOptions = {
                                        ...options,
                                        format: options?.format || 'image/webp',
                                    } as ProcessingOptions;

                                    // Re-using logic by calling the internal logic directly would be best, but lacking that, I will just invoke the services.
                                    // Or, I can define processImage as a standalone function inside withMethods

                                    // For now, I will inline the image processing triggering logic to be safe.
                                    if (typeof Worker !== 'undefined') {
                                        const canvas =
                                            document.createElement('canvas');
                                        const ctx = canvas.getContext('2d');
                                        if (!ctx)
                                            throw new Error(
                                                'Canvas context not available'
                                            );
                                        canvas.width = image.naturalWidth;
                                        canvas.height = image.naturalHeight;
                                        ctx.drawImage(image, 0, 0);
                                        const imageData = ctx.getImageData(
                                            0,
                                            0,
                                            canvas.width,
                                            canvas.height
                                        );

                                        return workerService
                                            .processInWorker$(
                                                imageData,
                                                cropRegion,
                                                safeOptions
                                            )
                                            .pipe(
                                                tap((result) =>
                                                    setResult(result)
                                                ),
                                                catchError((error) => {
                                                    return coreService
                                                        .cropImage$(
                                                            image,
                                                            cropRegion,
                                                            safeOptions
                                                        )
                                                        .pipe(
                                                            tap((result) =>
                                                                setResult(
                                                                    result
                                                                )
                                                            ),
                                                            catchError(
                                                                (
                                                                    workerError
                                                                ) => {
                                                                    setError(
                                                                        workerError as ImageProcessingError
                                                                    );
                                                                    return of(
                                                                        null
                                                                    );
                                                                }
                                                            )
                                                        );
                                                })
                                            );
                                    } else {
                                        return coreService
                                            .cropImage$(
                                                image,
                                                cropRegion,
                                                safeOptions
                                            )
                                            .pipe(
                                                tap((result) =>
                                                    setResult(result)
                                                ),
                                                catchError((error) => {
                                                    setError(
                                                        error as ImageProcessingError
                                                    );
                                                    return of(null);
                                                })
                                            );
                                    }
                                }),
                                catchError((error) => {
                                    setError(error as ImageProcessingError);
                                    return of(null);
                                })
                            );
                        })
                    )
                ),
            };
        }
    )
) {}
