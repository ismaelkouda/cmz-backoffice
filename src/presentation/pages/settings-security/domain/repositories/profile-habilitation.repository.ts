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
import { ProfileHabilitationEntity } from '../entities/profile-habilitation/profile-habilitation.entity';
import { ProfileHabilitationFilter } from '../value-objects/profile-habilitation-filter.vo';

export abstract class ProfileHabilitationRepository {
    abstract fetchProfileHabilitation(
        filter: ProfileHabilitationFilter,
        page: string
    ): Observable<Paginate<ProfileHabilitationEntity>>;

    abstract storeProfileHabilitation(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitationEntity>;

    abstract updateProfileHabilitation(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitationEntity>;

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
    ): Observable<Paginate<ProfileHabilitationEntity>>;

    abstract getUsersWithoutProfile(
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<ProfileHabilitationEntity>>;
}