import { homeEnableCommandMapper } from '@pages/content-management/application/commands-mappers/home/home-enable.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeEnableCommand } from '@pages/content-management/application/commands/home/home-enable.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeEnableHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(command: HomeEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable(homeEnableCommandMapper(command));
    }
}
