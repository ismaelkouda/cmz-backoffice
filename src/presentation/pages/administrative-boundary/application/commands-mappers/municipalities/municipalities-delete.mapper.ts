import { MunicipalitiesDeleteCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-delete.command';

export function municipalitiesDeleteCommandMapper(
    command: MunicipalitiesDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
