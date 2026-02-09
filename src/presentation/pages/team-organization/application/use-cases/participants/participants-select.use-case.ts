import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-select.entity';
import { ParticipantsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-select-repository';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsSelectUseCase {
    private readonly repository = inject(ParticipantsSelectRepository);

    readAll(filter: string | null): Observable<ParticipantsSelectEntity[]> {
        return this.repository.readAll(filter);
    }
}
