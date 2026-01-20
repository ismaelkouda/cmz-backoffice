import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RegionsSelectEntity } from '../../../domain/entities/regions/regions-select.entity';
import { RegionsSelectRepository } from '../../../domain/repositories/regions/regions-select-repository';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectUseCase {
    private readonly repository = inject(RegionsSelectRepository);

    readAll(): Observable<Array<RegionsSelectEntity>> {
        return this.repository.readAll();
    }
}
