import { Injectable, inject } from '@angular/core';
import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideHandler {
    private readonly useCase = inject(SlideUseCase);

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
