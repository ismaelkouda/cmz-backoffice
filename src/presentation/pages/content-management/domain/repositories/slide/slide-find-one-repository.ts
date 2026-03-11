import { Injectable } from '@angular/core';
import { SlideFindOneFilterEntity } from '@pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class SlideFindOneRepository {
    abstract execute(
        filter: SlideFindOneFilterEntity
    ): Observable<SlideFindOneEntity>;
}
