import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, map } from 'rxjs';
import { ProfileHabilitation } from '../../domain/entities/profile-habilitation.entity';
import { User } from '../../domain/entities/user.entity';
import { ProfileHabilitationRepository } from '../../domain/repositories/profile-habilitation.repository';
import { ProfileHabilitationFilter } from '../../domain/value-objects/profile-habilitation-filter.vo';
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
} from '../dtos/profile-habilitation-response.dto';
import { ProfileHabilitationMapper } from '../mappers/profile-habilitation.mapper';
import { UserMapper } from '../mappers/user.mapper';
import { ProfileHabilitationApi } from '../sources/profile-habilitation.api';

@Injectable({
    providedIn: 'root',
})
export class ProfileHabilitationRepositoryImpl extends ProfileHabilitationRepository {
    constructor(
        private readonly profileHabilitationApi: ProfileHabilitationApi,
        private readonly profileHabilitationMapper: ProfileHabilitationMapper,
        private readonly userMapper: UserMapper
    ) {
        super();
    }

    fetchProfileHabilitation(
        filter: ProfileHabilitationFilter,
        page: string
    ): Observable<Paginate<ProfileHabilitation>> {
        return this.profileHabilitationApi
            .fetchProfileHabilitation(filter.toDto(), page)
            .pipe(
                map((response) =>
                    this.profileHabilitationMapper.mapFromDto(response)
                )
            );
    }

    storeProfileHabilitation(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitation> {
        return this.profileHabilitationApi.storeProfileHabilitation(payload);
    }

    updateProfileHabilitation(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitation> {
        return this.profileHabilitationApi.updateProfileHabilitation(payload);
    }

    deleteProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDeleteResponseDto> {
        return this.profileHabilitationApi.deleteProfileHabilitation(id);
    }

    enableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationEnableResponseDto> {
        return this.profileHabilitationApi.enableProfileHabilitation(id);
    }

    disableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDisableResponseDto> {
        return this.profileHabilitationApi.disableProfileHabilitation(id);
    }

    getProfilesWithoutUser(profileId?: string): Observable<ProfileWithoutUserDto[]> {
        return this.profileHabilitationApi.getProfilesWithoutUser(profileId);
    }

    reassignUsers(payload: ReassignRequestDto): Observable<void> {
        return this.profileHabilitationApi.reassignUsers(payload);
    }

    removeUsers(payload: RemoveRequestDto): Observable<void> {
        return this.profileHabilitationApi.removeUsers(payload);
    }

    assignUsers(payload: AffectedRequestDto): Observable<void> {
        return this.profileHabilitationApi.assignUsers(payload);
    }

    getUsersByProfile(
        profileId: string,
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.profileHabilitationApi
            .getUsersByProfile(profileId, page, filter)
            .pipe(map((response) => this.userMapper.mapFromDto(response)));
    }

    getUsersWithoutProfile(
        page: string,
        filter?: { matricule?: string }
    ): Observable<Paginate<User>> {
        return this.profileHabilitationApi
            .getUsersWithoutProfile(page, filter)
            .pipe(map((response) => this.userMapper.mapFromDto(response)));
    }
}
