import { LocationMethod } from '@shared/domain/enums/location-method.enum';

export class LocationMethodVO {
    private constructor(private readonly value: LocationMethod) {}

    static auto = new LocationMethodVO(LocationMethod.AUTO);
    static manual = new LocationMethodVO(LocationMethod.MANUAL);
    static unknown = new LocationMethodVO(LocationMethod.UNKNOWN);

    static fromEnum(method: LocationMethod): LocationMethodVO {
        switch (method) {
            case LocationMethod.AUTO:
                return LocationMethodVO.auto;
            case LocationMethod.MANUAL:
                return LocationMethodVO.manual;
            default:
                return LocationMethodVO.unknown;
        }
    }

    static fromDto(dtoValue: string): LocationMethodVO {
        const normalized = dtoValue.toLowerCase().trim();
        const method =
            Object.values(LocationMethod).find((m) => m === normalized) ||
            LocationMethod.UNKNOWN;
        return LocationMethodVO.fromEnum(method);
    }

    isAuto(): boolean {
        return this.value === LocationMethod.AUTO;
    }
    isManual(): boolean {
        return this.value === LocationMethod.MANUAL;
    }
    isValid(): boolean {
        return this.value !== LocationMethod.UNKNOWN;
    }

    getIcon(): string {
        const icons = {
            [LocationMethod.AUTO]: 'gps_fixed',
            [LocationMethod.MANUAL]: 'edit_location',
            [LocationMethod.UNKNOWN]: 'help_outline',
        };
        return icons[this.value];
    }

    toEnum(): LocationMethod {
        return this.value;
    }
    toString(): string {
        return this.value;
    }

    equals(other: LocationMethodVO): boolean {
        return this.value === other.value;
    }
}
