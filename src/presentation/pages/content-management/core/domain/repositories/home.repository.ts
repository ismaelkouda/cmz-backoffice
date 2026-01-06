import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { HomeFilter } from '@presentation/pages/content-management/core/domain/value-objects/home-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class HomeRepository {
    abstract fetchHome(
        filter: HomeFilter,
        page: string
    ): Observable<Paginate<HomeEntity>>;

    abstract getHomeById(id: string): Observable<HomeEntity>;
    abstract createHome(payload: FormData): Observable<HomeEntity>;
    abstract updateHome(id: string, payload: FormData): Observable<HomeEntity>;
    abstract deleteHome(id: string): Observable<SimpleResponseDto<void>>;
    abstract enableHome(id: string): Observable<SimpleResponseDto<void>>;
    abstract disableHome(id: string): Observable<SimpleResponseDto<void>>;
}
