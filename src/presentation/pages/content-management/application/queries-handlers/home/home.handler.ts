import { homeQueryMapper } from '@pages/content-management/application/queries-mappers/home/home.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeQuery } from '@pages/content-management/application/queries/home/home.query';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeHandler {
    private readonly useCase = inject(HomeUseCase);

    execute(
        command: HomeQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>> {
        return this.useCase.execute(homeQueryMapper(command), page, options);
    }
}
