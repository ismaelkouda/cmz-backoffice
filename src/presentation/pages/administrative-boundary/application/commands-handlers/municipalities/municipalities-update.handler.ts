import { municipalitiesUpdateCommandMapper } from '@pages/administrative-boundary/application/commands-mappers/municipalities/municipalities-update.mapper';
import { inject, Injectable } from '@angular/core';
import { MunicipalitiesUpdateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesUseCase } from '@pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesUpdateHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(municipalitiesUpdateCommandMapper(command));
    }
}
