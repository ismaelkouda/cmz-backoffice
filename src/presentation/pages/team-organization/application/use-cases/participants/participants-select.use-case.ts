import { inject, Injectable } from '@angular/core';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { ParticipantsSelectRepository } from '@pages/team-organization/domain/repositories/participants/participants-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsSelectUseCase {
    private readonly repository = inject(ParticipantsSelectRepository);

    readAll(): Observable<ParticipantsSelectEntity[]> {
        return this.repository.readAll();
    }
}
