import { inject, Injectable } from '@angular/core';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { HomeEntity } from '../../domain/entities/home.entity';
import { HomeRepository } from '../../domain/repositories/home.repository';
import { HomeFilter } from '../../domain/value-objects/home-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(
        filter: HomeFilter | null,
        page: string
    ): Observable<Paginate<HomeEntity>> {
        return this.homeRepository.fetchHome(filter, page);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetHomeByIdUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(id: string): Observable<HomeEntity> {
        return this.homeRepository.getHomeById(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class CreateHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(payload: FormData): Observable<HomeEntity> {
        return this.homeRepository.createHome(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(id: string, payload: FormData): Observable<HomeEntity> {
        return this.homeRepository.updateHome(id, payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.homeRepository.deleteHome(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.homeRepository.enableHome(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableHomeUseCase {
    private readonly homeRepository = inject(HomeRepository);

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.homeRepository.disableHome(id);
    }
}
