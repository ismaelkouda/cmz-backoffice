import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SlideEntity } from '../../domain/entities/slide.entity';
import { SlideRepository } from '../../domain/repositories/slide.repository';

@Injectable({
    providedIn: 'root',
})
export class UpdateSlideUseCase {
    constructor(private readonly slideRepository: SlideRepository) {}

    execute(params: { id: string; data: FormData }): Observable<SlideEntity> {
        return this.slideRepository.updateSlide(params.id, params.data);
    }
}
