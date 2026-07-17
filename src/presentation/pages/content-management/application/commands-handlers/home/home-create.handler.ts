import { homeCreateCommandMapper } from '@pages/content-management/application/commands-mappers/home/home-create.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeCreateCommand } from '@pages/content-management/application/commands/home/home-create.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeCreateHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(command: HomeCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(homeCreateCommandMapper(command));
    }
}
