import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export interface OpticalFiberRouteCoordinateFormControl {
    longitude: FormControl<string | undefined>;
    latitude: FormControl<string | undefined>;
}

export interface OpticalFiberNetworkFormControl {
    name: FormControl<string | undefined>;
    operator: FormControl<Operator | undefined>;
    fiberConstructorId: FormControl<string | undefined>;
    routeCoordinates: FormArray<
        FormGroup<OpticalFiberRouteCoordinateFormControl>
    >;
    type: FormControl<FiberType | undefined>;
    geomFile: FormControl<File | null>;
}
