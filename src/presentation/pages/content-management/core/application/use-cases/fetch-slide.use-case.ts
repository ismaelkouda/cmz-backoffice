import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { SlideEntity } from '../../domain/entities/slide.entity';
import { SlideRepository } from '../../domain/repositories/slide.repository';
import { SlideFilter } from '../../domain/value-objects/slide-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchSlideUseCase {
    constructor(private readonly slideRepository: SlideRepository) {}

    execute(params: {
        filter: SlideFilter;
        page: string;
    }): Observable<Paginate<SlideEntity>> {
        return this.slideRepository.fetchSlide(params.filter, params.page);
    }
}
