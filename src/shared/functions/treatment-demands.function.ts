import { TreatmentDemands } from '../interfaces/treatment-demands.interface';

export function createButtonStyle(
    className: string,
    icon: string,
    tooltip: string,
    typeTreatment: TreatmentDemands,
    extratypeTreatment: Partial<TreatmentDemands> = {}
): {
    class: string;
    icon: string;
    tooltip: string;
    typeTreatment: TreatmentDemands;
} {
    return {
        class: className,
        icon: icon,
        tooltip: tooltip,
        typeTreatment: { ...typeTreatment, ...extratypeTreatment },
    };
}
