import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { SlideEntity } from '../entities/slide.entity';
import { SlideFilter } from '../value-objects/slide-filter.vo';

export abstract class SlideRepository {
    abstract fetchSlide(
        filter: SlideFilter | null,
        page: string
    ): Observable<Paginate<SlideEntity>>;

    abstract getSlideById(id: string): Observable<SlideEntity>;
    abstract createSlide(payload: FormData): Observable<SlideEntity>;
    abstract updateSlide(
        id: string,
        payload: FormData
    ): Observable<SlideEntity>;
    abstract deleteSlide(id: string): Observable<SimpleResponseDto<void>>;
    abstract enableSlide(id: string): Observable<SimpleResponseDto<void>>;
    abstract disableSlide(id: string): Observable<SimpleResponseDto<void>>;
}
