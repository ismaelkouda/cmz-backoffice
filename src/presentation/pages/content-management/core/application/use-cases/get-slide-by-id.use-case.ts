import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SlideEntity } from '../../domain/entities/slide.entity';
import { SlideRepository } from '../../domain/repositories/slide.repository';

@Injectable({
    providedIn: 'root',
})
export class GetSlideByIdUseCase {
    constructor(private readonly slideRepository: SlideRepository) { }

    execute(id: string): Observable<SlideEntity> {
        return this.slideRepository.getSlideById(id);
    }
}
