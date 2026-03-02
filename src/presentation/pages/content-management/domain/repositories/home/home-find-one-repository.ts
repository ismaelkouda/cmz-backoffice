import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HomeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class HomeFindOneRepository {
    abstract execute(
        filter: HomeFindOneFilterEntity
    ): Observable<HomeFindOneEntity>;
}
