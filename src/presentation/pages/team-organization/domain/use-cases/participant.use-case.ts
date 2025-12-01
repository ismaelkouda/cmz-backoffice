import { inject, Injectable } from '@angular/core';
import {
    ParticipantDeleteResponseDto,
    ParticipantDisableResponseDto,
    ParticipantEnableResponseDto,
    ParticipantStoreRequestDto,
    ParticipantUpdateRequestDto,
    RoleDto,
} from '@presentation/pages/team-organization/data/dtos/participant-response.dto';
import { Observable } from 'rxjs';
import { Participant } from '../entities/participant.entity';
import { ParticipantRepository } from '../repositories/participant.repository';
import { ParticipantFilter } from '../value-objects/participant-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchParticipantsUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(filter: ParticipantFilter): Observable<Participant[]> {
        return this.participantRepository.fetchParticipants(filter);
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreParticipantUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(payload: ParticipantStoreRequestDto): Observable<Participant> {
        return this.participantRepository.storeParticipant(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateParticipantUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(payload: ParticipantUpdateRequestDto): Observable<Participant> {
        return this.participantRepository.updateParticipant(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteParticipantUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(id: string): Observable<ParticipantDeleteResponseDto> {
        return this.participantRepository.deleteParticipant(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableParticipantUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(id: string): Observable<ParticipantEnableResponseDto> {
        return this.participantRepository.enableParticipant(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableParticipantUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(id: string): Observable<ParticipantDisableResponseDto> {
        return this.participantRepository.disableParticipant(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetRolesUseCase {
    private readonly participantRepository = inject(ParticipantRepository);

    execute(): Observable<RoleDto[]> {
        return this.participantRepository.getRoles();
    }
}
