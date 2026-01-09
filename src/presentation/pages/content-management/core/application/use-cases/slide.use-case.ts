import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { SlideEntity } from '../../domain/entities/slide.entity';
import { SlideRepository } from '../../domain/repositories/slide.repository';
import { SlideFilter } from '../../domain/value-objects/slide-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchSlideUseCase {
    private readonly slideRepository = inject(SlideRepository);

    execute(
        filter: SlideFilter | null,
        page: string
    ): Observable<Paginate<SlideEntity>> {
        return this.slideRepository.fetchSlide(filter, page);
    }
}
