import { inject, Injectable } from '@angular/core';
import {
    AffectedRequestDto,
    ProfileHabilitationDeleteResponseDto,
    ProfileHabilitationDisableResponseDto,
    ProfileHabilitationEnableResponseDto,
    ProfileHabilitationStoreRequestDto,
    ProfileHabilitationUpdateRequestDto,
    ProfileWithoutUserDto,
    ReassignRequestDto,
    RemoveRequestDto,
} from '@presentation/pages/settings-security/data/dtos/profile-habilitation-response.dto';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { ProfileHabilitation } from '../entities/profile-habilitation.entity';
import { User } from '../entities/user.entity';
import { ProfileHabilitationRepository } from '../repositories/profile-habilitation.repository';
import { ProfileHabilitationFilter } from '../value-objects/profile-habilitation-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        filter: ProfileHabilitationFilter,
        page: string
    ): Observable<Paginate<ProfileHabilitation>> {
        return this.profileHabilitationRepository.fetchProfileHabilitation(
            filter,
            page
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitation> {
        return this.profileHabilitationRepository.storeProfileHabilitation(
            payload
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitation> {
        return this.profileHabilitationRepository.updateProfileHabilitation(
            payload
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        id: string
    ): Observable<ProfileHabilitationDeleteResponseDto> {
        return this.profileHabilitationRepository.deleteProfileHabilitation(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        id: string
    ): Observable<ProfileHabilitationEnableResponseDto> {
        return this.profileHabilitationRepository.enableProfileHabilitation(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableProfileHabilitationUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        id: string
    ): Observable<ProfileHabilitationDisableResponseDto> {
        return this.profileHabilitationRepository.disableProfileHabilitation(
            id
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetProfilesWithoutUserUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(profileId?: string): Observable<ProfileWithoutUserDto[]> {
        return this.profileHabilitationRepository.getProfilesWithoutUser(
            profileId
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class ReassignUsersUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(payload: ReassignRequestDto): Observable<void> {
        return this.profileHabilitationRepository.reassignUsers(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class RemoveUsersUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(payload: RemoveRequestDto): Observable<void> {
        return this.profileHabilitationRepository.removeUsers(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AffectedUsersUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(payload: AffectedRequestDto): Observable<void> {
        return this.profileHabilitationRepository.assignUsers(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetUsersByProfileUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        profileId: string,
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.profileHabilitationRepository.getUsersByProfile(
            profileId,
            page,
            filter
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetUsersWithoutProfileUseCase {
    private readonly profileHabilitationRepository = inject(
        ProfileHabilitationRepository
    );

    execute(
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.profileHabilitationRepository.getUsersWithoutProfile(
            page,
            filter
        );
    }
}
