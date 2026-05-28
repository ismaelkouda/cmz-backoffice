import { Injectable, inject } from '@angular/core';
import { HomeDisableCommand } from '@pages/content-management/application/commands/home/home-disable.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeDisableHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(command: HomeDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
