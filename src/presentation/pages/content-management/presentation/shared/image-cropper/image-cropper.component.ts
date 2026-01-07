import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    effect,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    signal,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Import CropperJS v2
import 'cropperjs';

// Stores et types
import { ImageProcessingStore } from '@presentation/pages/content-management/core/domain/stores/image-processing.store';
import {
    ProcessingOptions,
    ProcessingResult,
} from '@presentation/pages/content-management/core/domain/types/image-processing.types';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Types pour CropperJS v2
interface CropperCanvas extends HTMLElement {
    src?: string;
    background?: boolean;
    scaleStep?: number;
    disabled?: boolean;
    $toCanvas(options?: any): Promise<HTMLCanvasElement>;
    $resetTransform(): void;
}

interface CropperImage extends HTMLElement {
    src?: string;
    alt?: string;
    rotatable?: boolean;
    scalable?: boolean;
    skewable?: boolean;
    translatable?: boolean;
    $ready(
        callback?: (image: HTMLImageElement) => void
    ): Promise<HTMLImageElement>;
    $rotate(angle: number): void;
    $scale(x: number, y?: number): void;
    $zoom(scale: number): void;
    $resetTransform(): void;
    $center(size?: string): void;
}

interface CropperSelection extends HTMLElement {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    aspectRatio?: number;
    initialCoverage?: number;
    movable?: boolean;
    resizable?: boolean;
    $toCanvas(options?: any): Promise<HTMLCanvasElement>;
    $center(): void;
    $reset(): void;
}

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, ProgressSpinnerModule],
    providers: [ImageProcessingStore],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageCropperComponent implements OnInit, OnDestroy {
    private readonly store = inject(ImageProcessingStore);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('cropperCanvas') cropperCanvasRef!: ElementRef<CropperCanvas>;
    @ViewChild('cropperImage') cropperImageRef!: ElementRef<CropperImage>;
    @ViewChild('cropperSelection')
    cropperSelectionRef!: ElementRef<CropperSelection>;

    @Input() set imageSrc(value: string | null) {
        this._imageSrc.set(value);
    }
    get imageSrc(): string | null {
        return this._imageSrc();
    }

    @Input() set visible(value: boolean) {
        this._visible.set(value);
    }
    get visible(): boolean {
        return this._visible();
    }

    @Input() originalFile: File | null = null;
    @Input() processingOptions: ProcessingOptions = {};

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() cropComplete = new EventEmitter<ProcessingResult>();
    @Output() error = new EventEmitter<Error>();

    // Signals
    private readonly _imageSrc = signal<string | null>(null);
    private readonly _visible = signal<boolean>(false);
    private readonly _currentAspectRatio = signal<number | null>(16 / 9);
    private readonly _isReady = signal(false);
    private readonly _hasError = signal(false);
    private readonly _errorMessage = signal<string | null>(null);

    // Computed properties - SÉCURISÉES
    readonly isProcessing = computed(() => {
        try {
            return this.store.isProcessing();
        } catch {
            return false;
        }
    });

    readonly hasError = computed(() => this._hasError());

    readonly errorMessage = computed(() => {
        const msg = this._errorMessage();
        return msg !== null && msg !== undefined ? msg : '';
    });

    readonly isReady = computed(() => {
        return this._isReady() && !this.isProcessing() && !this.hasError();
    });

    readonly currentAspectRatio = computed(() => this._currentAspectRatio());

    readonly selectionRect = computed<{ width: number; height: number } | null>(
        () => null
    );

    // Getters simples pour éviter les computed problématiques - removed faulty getter
    // get currentAspectRatio(): number | null {
    //    return this._currentAspectRatio();
    // }

    get isLoading(): boolean {
        return !this._isReady() && !this._hasError();
    }

    _isImageLoaded(): boolean {
        return this._isReady();
    }

    getCroppedCanvas(): HTMLCanvasElement | null {
        // Feature preview temporairement désactivée pour stabilité
        return null;
    }

    constructor() {
        console.log('this.originalFile', this.imageSrc);
        // Écouter les résultats - avec gestion d'erreur
        effect(() => {
            try {
                const result = this.store.currentResult();
                if (result) {
                    this.cropComplete.emit(result);
                    this.close();
                }
            } catch (error) {
                console.error('Error in result effect:', error);
            }
        });

        // Écouter les erreurs du store
        effect(() => {
            try {
                const storeError = this.store.error();
                if (storeError) {
                    this.showError('Erreur de traitement', storeError.message);
                }
            } catch (error) {
                console.error('Error in error effect:', error);
            }
        });

        // Nettoyage à la destruction
        takeUntilDestroyed(this.destroyRef);
    }

    ngOnInit(): void {
        // Vérifier que CropperJS est chargé
        setTimeout(() => this.checkCropperLoaded(), 500);
    }

    ngOnDestroy(): void {
        // Cleanup automatique
    }

    /**
     * Vérifier si CropperJS est chargé
     */
    private checkCropperLoaded(): void {
        try {
            const hasCanvas = customElements.get('cropper-canvas');
            const hasImage = customElements.get('cropper-image');
            const hasSelection = customElements.get('cropper-selection');

            if (!hasCanvas || !hasImage || !hasSelection) {
                console.warn('CropperJS components not registered');
            }
        } catch (error) {
            console.error('Error checking CropperJS:', error);
        }
    }

    /**
     * Quand l'image est chargée
     */
    onImageReady(event: Event): void {
        console.log('Image chargée avec succès');
        this._isReady.set(true);
        this._hasError.set(false);
        this._errorMessage.set(null);
        this.cdr.markForCheck();
    }

    /**
     * Quand l'image a une erreur
     */
    onImageError(event: Event): void {
        console.error("Erreur de chargement de l'image");
        this._hasError.set(true);
        this._errorMessage.set("Impossible de charger l'image");
        this._isReady.set(false);
        this.cdr.markForCheck();
    }

    /**
     * Appliquer le rognage
     */
    async applyCrop(): Promise<void> {
        if (!this.cropperSelectionRef?.nativeElement || !this.originalFile) {
            this.showError(
                'Action impossible',
                'Cropper non prêt ou fichier manquant'
            );
            return;
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Traitement',
            detail: 'Rognage en cours...',
            life: 3000,
        });

        try {
            // 1. Obtenir le canvas rogné et transformé depuis le Web Component
            // Cela inclut le zoom, la rotation, etc.
            const canvas =
                await this.cropperSelectionRef.nativeElement.$toCanvas({
                    width: this.processingOptions.maxWidth,
                    height: this.processingOptions.maxHeight,
                });

            // 2. Convertir en Blob avec les options de format/qualité
            const format = this.processingOptions.format || 'image/webp';
            const quality = this.processingOptions.quality || 0.8;

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        this.showError(
                            'Erreur',
                            "Conversion de l'image échouée"
                        );
                        return;
                    }

                    // 3. Créer le résultat
                    // Obtenir les dimensions originales via $ready qui retourne l'élément img sous-jacent
                    this.cropperImageRef.nativeElement
                        .$ready()
                        .then((img) => {
                            const result: ProcessingResult = {
                                blob: blob,
                                metadata: {
                                    original: {
                                        width: img.naturalWidth || 0,
                                        height: img.naturalHeight || 0,
                                        size: this.originalFile!.size,
                                        type: this.originalFile!.type,
                                        lastModified:
                                            this.originalFile!.lastModified,
                                    },
                                    processed: {
                                        width: canvas.width,
                                        height: canvas.height,
                                        size: blob.size,
                                        type: blob.type,
                                        lastModified: Date.now(),
                                    },
                                    processingTime: 0,
                                    compressionRatio:
                                        this.originalFile!.size > 0
                                            ? blob.size /
                                              this.originalFile!.size
                                            : 1,
                                },
                            };

                            // 4. Mettre à jour le store directement
                            this.store.setResult(result);
                        })
                        .catch((err) => {
                            console.error(
                                'Erreur lors de la récupération des métadonnées image:',
                                err
                            );
                            // Fallback si $ready échoue (rare)
                            const result: ProcessingResult = {
                                blob: blob,
                                metadata: {
                                    original: {
                                        width: 0,
                                        height: 0,
                                        size: this.originalFile!.size,
                                        type: this.originalFile!.type,
                                        lastModified:
                                            this.originalFile!.lastModified,
                                    },
                                    processed: {
                                        width: canvas.width,
                                        height: canvas.height,
                                        size: blob.size,
                                        type: blob.type,
                                        lastModified: Date.now(),
                                    },
                                    processingTime: 0,
                                    compressionRatio:
                                        this.originalFile!.size > 0
                                            ? blob.size /
                                              this.originalFile!.size
                                            : 1,
                                },
                            };
                            this.store.setResult(result);
                        });
                },
                format,
                quality
            );
        } catch (error) {
            console.error('Erreur lors du rognage:', error);
            this.showError(
                'Erreur de rognage',
                "Impossible d'appliquer le rognage"
            );
        }
    }

    /**
     * Changer le ratio d'aspect
     */
    setAspectRatio(ratio: number | null): void {
        this._currentAspectRatio.set(ratio);
        // Note: Le binding [attr.aspect-ratio] dans le template gère la mise à jour

        this.messageService.add({
            severity: 'info',
            summary: 'Ratio changé',
            detail: this.getAspectRatioLabel(ratio),
            life: 2000,
        });
    }

    /**
     * Rotation
     */
    rotate(degrees: number): void {
        if (!this.cropperImageRef?.nativeElement) {
            this.showError('Erreur', 'Image non disponible');
            return;
        }

        try {
            // CropperJS v2 $rotate prend des radians
            const radians = degrees * (Math.PI / 180);
            this.cropperImageRef.nativeElement.$rotate(radians);
        } catch (error) {
            console.error('Erreur de rotation:', error);
        }
    }

    /**
     * Zoom
     */
    zoom(factor: number): void {
        if (!this.cropperImageRef?.nativeElement) {
            return;
        }

        try {
            // $zoom prend un facteur de scale relatif ou absolu selon implémentation
            // Pour v2, souvent $zoom(scale, x, y)
            this.cropperImageRef.nativeElement.$zoom(factor);
        } catch (error) {
            console.error('Erreur de zoom:', error);
        }
    }

    /**
     * Réinitialiser
     */
    reset(): void {
        try {
            if (this.cropperImageRef?.nativeElement) {
                this.cropperImageRef.nativeElement.$resetTransform();
                this.cropperImageRef.nativeElement.$center();
            }

            if (this.cropperSelectionRef?.nativeElement) {
                this.cropperSelectionRef.nativeElement.$reset();
                this.cropperSelectionRef.nativeElement.$center();
            }

            this.setAspectRatio(16 / 9);

            this.messageService.add({
                severity: 'info',
                summary: 'Réinitialisé',
                detail: 'Tous les réglages ont été réinitialisés',
                life: 2000,
            });
        } catch (error) {
            console.error('Erreur de réinitialisation:', error);
        }
    }

    /**
     * Fermer le dialog
     */
    close(): void {
        this._visible.set(false);
        this.visibleChange.emit(false);
        this.store.reset();
        this.cdr.detectChanges();
    }

    /**
     * Gérer le changement de visibilité
     */
    onVisibleChange(visible: boolean): void {
        this._visible.set(visible);
        if (!visible) {
            this.close();
        }
    }

    /**
     * Afficher une erreur
     */
    private showError(summary: string, detail: string): void {
        this._hasError.set(true);
        this._errorMessage.set(detail);

        this.messageService.add({
            severity: 'error',
            summary,
            detail,
            life: 5000,
        });

        this.error.emit(new Error(`${summary}: ${detail}`));
        this.cdr.markForCheck();
    }

    /**
     * Obtenir le label du ratio
     */
    getAspectRatioLabel(ratio: number | null): string {
        if (ratio === null) return 'Libre';
        if (Math.abs(ratio - 1) < 0.01) return 'Carré (1:1)';
        if (Math.abs(ratio - 16 / 9) < 0.01) return 'Paysage (16:9)';
        if (Math.abs(ratio - 9 / 16) < 0.01) return 'Portrait (9:16)';
        if (Math.abs(ratio - 4 / 3) < 0.01) return 'Standard (4:3)';
        return `Ratio: ${ratio.toFixed(2)}`;
    }

    /**
     * Réessayer le chargement
     */
    retryLoad(): void {
        this._hasError.set(false);
        this._errorMessage.set(null);
        this.cdr.markForCheck();
    }
}
