import { homeUpdateCommandMapper } from '@pages/content-management/application/commands-mappers/home/home-update.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeUpdateCommand } from '@pages/content-management/application/commands/home/home-update.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeUpdateHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(command: HomeUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(homeUpdateCommandMapper(command));
    }
}
