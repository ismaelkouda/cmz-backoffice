import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { HomeQuery } from '@presentation/pages/content-management/application/queries/home/home.query';
import { HomeUseCase } from '@presentation/pages/content-management/application/use-cases/home/home.use-case';
import { HomeEntity } from '@presentation/pages/content-management/domain/entities/home/home.entity';

@Injectable({ providedIn: 'root' })
export class HomeHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(
        command: HomeQuery,
        page: string
    ): Observable<Paginate<HomeEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                platforms: command.platforms,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
