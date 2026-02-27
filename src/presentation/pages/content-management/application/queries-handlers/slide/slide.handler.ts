import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { SlideQuery } from '@presentation/pages/content-management/application/queries/slide/slide.query';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';
import { SlideEntity } from '@presentation/pages/content-management/domain/entities/slide/slide.entity';

@Injectable({ providedIn: 'root' })
export class SlideHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(
        command: SlideQuery,
        page: string
    ): Observable<Paginate<SlideEntity>> {
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
