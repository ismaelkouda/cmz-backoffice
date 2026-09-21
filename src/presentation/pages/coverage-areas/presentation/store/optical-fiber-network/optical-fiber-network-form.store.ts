import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { OpticalFiberNetworkFindOneFacade } from '@pages/coverage-areas/application/services/optical-fiber-network/optical-fiber-network-find-one.facade';
import {
    OpticalFiberNetworkFormControl,
    OpticalFiberRouteCoordinateFormControl,
} from '@pages/coverage-areas/presentation/store/optical-fiber-network/optical-fiber-network-form.control';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';
import { startWith } from 'rxjs';

type FormMode = 'create' | 'edit' | 'details';
type GeometryMode = 'coordinates' | 'file';

export interface OpticalFiberRouteCoordinate {
    longitude?: string;
    latitude?: string;
}

@Injectable()
export class OpticalFiberNetworkFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly findOneFacade = inject(OpticalFiberNetworkFindOneFacade);

    readonly form = this.createForm();
    readonly mode = signal<FormMode>('create');
    readonly geometryMode = signal<GeometryMode>('coordinates');
    readonly isCreateMode = computed(() => this.mode() === 'create');
    readonly isEditMode = computed(() => this.mode() === 'edit');
    readonly isDetailsMode = computed(() => this.mode() === 'details');
    readonly isCoordinatesMode = computed(
        () => this.geometryMode() === 'coordinates'
    );
    readonly isFileMode = computed(() => this.geometryMode() === 'file');
    readonly loading = computed(() => this.findOneFacade.loading());
    readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    readonly isValid = computed(() => this.status() === 'VALID');
    private readonly item = this.findOneFacade.items;
    readonly existingGeom = signal<object | string | null>(null);

    constructor() {
        this.initializeDetailsModeEffect();
    }

    private createForm(): FormGroup<OpticalFiberNetworkFormControl> {
        return this.fb.nonNullable.group<OpticalFiberNetworkFormControl>({
            name: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            operator: new FormControl<Operator | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            fiberConstructorId: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            routeCoordinates: this.fb.array<
                FormGroup<OpticalFiberRouteCoordinateFormControl>
            >(
                [
                    this.createRouteCoordinateGroup(),
                    this.createRouteCoordinateGroup(),
                ],
                {
                    validators: [this.routeCoordinatesValidator()],
                }
            ),
            type: new FormControl<FiberType | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            geomFile: new FormControl<File | null>(null, {
                nonNullable: true,
            }),
        });
    }

    private initializeDetailsModeEffect(): void {
        effect(() => {
            const item = this.item();
            if (this.isCreateMode() || !item) {
                return;
            }

            const { name, operator, fiberConstructorId, type, geom, geomUrl } =
                item;
            const routeCoordinates = this.extractRouteCoordinates(item);
            const details = this.isDetailsMode();
            const hasGeomFile = !!(geom || geomUrl);
            const hasLegacyCoords = !!(
                item.longitudePointA || item.latitudePointA
            );
            const mode: GeometryMode =
                hasGeomFile && !hasLegacyCoords ? 'file' : 'coordinates';

            untracked(() => {
                queueMicrotask(() => {
                    this.geometryMode.set(mode);
                    if (mode === 'file') {
                        this.form.controls.routeCoordinates.clearValidators();
                        this.form.controls.routeCoordinates.updateValueAndValidity(
                            { emitEvent: false }
                        );
                        this.form.controls.geomFile.clearValidators();
                        this.form.controls.geomFile.updateValueAndValidity({
                            emitEvent: false,
                        });
                        this.setRouteCoordinates([{}, {}]);
                    } else {
                        this.setRouteCoordinates(routeCoordinates);
                        this.form.controls.routeCoordinates.setValidators([
                            this.routeCoordinatesValidator(),
                        ]);
                        this.form.controls.routeCoordinates.updateValueAndValidity(
                            { emitEvent: false }
                        );
                        this.form.controls.geomFile.clearValidators();
                        this.form.controls.geomFile.updateValueAndValidity({
                            emitEvent: false,
                        });
                    }
                    this.form.patchValue({
                        name,
                        operator,
                        fiberConstructorId,
                        type,
                        geomFile: null,
                    });
                    this.existingGeom.set(geom ?? geomUrl ?? null);
                    if (details) {
                        this.form.disable({ emitEvent: false });
                    }
                });
            });
        });
    }

    private load(uniqId: string): void {
        this.findOneFacade.read({ uniqId }, { forceRefresh: true });
    }

    setMode(uniqId: string | null, mode: FormMode): void {
        this.mode.set(mode);
        const handlers: Record<FormMode, () => void> = {
            create: () => {
                this.reset();
                this.findOneFacade.reset();
            },
            edit: () => uniqId && this.load(uniqId),
            details: () => uniqId && this.load(uniqId),
        };
        handlers[mode]();
    }

    setGeometryMode(mode: GeometryMode): void {
        if (this.isDetailsMode() || this.loading()) {
            return;
        }
        this.geometryMode.set(mode);
        if (mode === 'file') {
            this.setRouteCoordinates([{}, {}]);
            this.form.controls.routeCoordinates.clearValidators();
            this.form.controls.routeCoordinates.updateValueAndValidity({
                emitEvent: false,
            });
            this.form.controls.geomFile.setValidators([Validators.required]);
            this.form.controls.geomFile.updateValueAndValidity({
                emitEvent: false,
            });
        } else {
            this.form.controls.geomFile.clearValidators();
            this.form.controls.geomFile.setValue(null, { emitEvent: false });
            this.form.controls.geomFile.updateValueAndValidity({
                emitEvent: false,
            });
            this.form.controls.routeCoordinates.setValidators([
                this.routeCoordinatesValidator(),
            ]);
            this.form.controls.routeCoordinates.updateValueAndValidity({
                emitEvent: false,
            });
        }
    }

    reset(): void {
        this.form.enable({ emitEvent: false });
        this.geometryMode.set('coordinates');
        this.form.controls.geomFile.clearValidators();
        this.form.controls.geomFile.updateValueAndValidity({
            emitEvent: false,
        });
        this.form.controls.routeCoordinates.setValidators([
            this.routeCoordinatesValidator(),
        ]);
        this.form.controls.routeCoordinates.updateValueAndValidity({
            emitEvent: false,
        });
        this.setRouteCoordinates([{}, {}]);
        this.form.reset(
            {
                name: undefined,
                operator: undefined,
                fiberConstructorId: undefined,
                type: undefined,
                geomFile: null,
            },
            { emitEvent: true }
        );
        this.existingGeom.set(null);
        this.mode.set('create');
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    createRouteCoordinateGroup(
        value: OpticalFiberRouteCoordinate = {}
    ): FormGroup<OpticalFiberRouteCoordinateFormControl> {
        return this.fb.nonNullable.group<OpticalFiberRouteCoordinateFormControl>(
            {
                longitude: new FormControl<string | undefined>(
                    value.longitude,
                    {
                        nonNullable: true,
                        validators: [Validators.required],
                    }
                ),
                latitude: new FormControl<string | undefined>(value.latitude, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
            }
        );
    }

    addRouteCoordinate(value: OpticalFiberRouteCoordinate = {}): void {
        this.form.controls.routeCoordinates.push(
            this.createRouteCoordinateGroup(value)
        );
        this.form.controls.routeCoordinates.updateValueAndValidity();
    }

    removeRouteCoordinate(index: number): void {
        const routeCoordinates = this.form.controls.routeCoordinates;
        if (routeCoordinates.length <= 2) {
            return;
        }
        routeCoordinates.removeAt(index);
        routeCoordinates.updateValueAndValidity();
    }

    private setRouteCoordinates(
        coordinates: OpticalFiberRouteCoordinate[]
    ): void {
        const routeCoordinates = this.form.controls.routeCoordinates;
        routeCoordinates.clear({ emitEvent: false });
        const normalized = coordinates.length >= 2 ? coordinates : [{}, {}];
        for (const coordinate of normalized) {
            routeCoordinates.push(this.createRouteCoordinateGroup(coordinate), {
                emitEvent: false,
            });
        }
        routeCoordinates.updateValueAndValidity({ emitEvent: true });
    }

    private routeCoordinatesValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const coordinates = control.value as OpticalFiberRouteCoordinate[];
            const validCoordinates = coordinates.filter(
                (coordinate) =>
                    coordinate.longitude !== undefined &&
                    coordinate.longitude !== null &&
                    String(coordinate.longitude).trim() !== '' &&
                    coordinate.latitude !== undefined &&
                    coordinate.latitude !== null &&
                    String(coordinate.latitude).trim() !== ''
            );
            return validCoordinates.length >= 2
                ? null
                : { minRouteCoordinates: true };
        };
    }

    private extractRouteCoordinates(item: any): OpticalFiberRouteCoordinate[] {
        const geomCoordinates = this.extractCoordinatesFromGeom(item.geom);
        if (geomCoordinates.length >= 2) {
            return geomCoordinates;
        }
        const legacyCoordinates = [
            {
                longitude: item.longitudePointA,
                latitude: item.latitudePointA,
            },
            {
                longitude: item.longitudePointB,
                latitude: item.latitudePointB,
            },
        ].filter((coordinate) => coordinate.longitude || coordinate.latitude);
        return legacyCoordinates.length >= 2 ? legacyCoordinates : [{}, {}];
    }

    private extractCoordinatesFromGeom(
        geom: unknown
    ): OpticalFiberRouteCoordinate[] {
        if (!geom) {
            return [];
        }
        let parsed: unknown;
        try {
            parsed = typeof geom === 'string' ? JSON.parse(geom) : geom;
        } catch {
            return [];
        }
        const geometry =
            (parsed as any).type === 'Feature'
                ? (parsed as any).geometry
                : (parsed as any).type === 'FeatureCollection'
                  ? (parsed as any).features?.[0]?.geometry
                  : parsed;
        if (
            geometry?.type !== 'LineString' ||
            !Array.isArray(geometry.coordinates)
        ) {
            return [];
        }
        return geometry.coordinates.map((coordinate: [number, number]) => ({
            longitude: String(coordinate[0]),
            latitude: String(coordinate[1]),
        }));
    }
}
