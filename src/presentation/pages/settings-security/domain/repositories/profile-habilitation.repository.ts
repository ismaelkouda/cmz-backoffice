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
import { ProfileHabilitationFilter } from '../value-objects/profile-habilitation-filter.vo';

export abstract class ProfileHabilitationRepository {
    abstract fetchProfileHabilitation(
        filter: ProfileHabilitationFilter,
        page: string
    ): Observable<Paginate<ProfileHabilitation>>;

    abstract storeProfileHabilitation(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitation>;

    abstract updateProfileHabilitation(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitation>;

    abstract deleteProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDeleteResponseDto>;

    abstract enableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationEnableResponseDto>;

    abstract disableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDisableResponseDto>;

    abstract getProfilesWithoutUser(
        profileId?: string
    ): Observable<ProfileWithoutUserDto[]>;

    abstract reassignUsers(payload: ReassignRequestDto): Observable<void>;

    abstract removeUsers(payload: RemoveRequestDto): Observable<void>;

    abstract assignUsers(payload: AffectedRequestDto): Observable<void>;

    abstract getUsersByProfile(
        profileId: string,
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>>;

    abstract getUsersWithoutProfile(
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>>;
}
