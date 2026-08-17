import { homeDeleteCommandMapper } from '@pages/content-management/application/commands-mappers/home/home-delete.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeDeleteCommand } from '@pages/content-management/application/commands/home/home-delete.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeDeleteHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(command: HomeDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete(homeDeleteCommandMapper(command));
    }
}
