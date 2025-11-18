import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { ProfileHabilitation } from '../../domain/entities/profile-habilitation.entity';
import { ProfileHabilitationEndpoint } from '../constants/profile-habilitation-endpoints.constant';
import { ProfileHabilitationRequestDto } from '../dtos/profile-habilitation-request.dto';
import {
    AffectedRequestDto,
    ProfileHabilitationDeleteResponseDto,
    ProfileHabilitationDisableResponseDto,
    ProfileHabilitationEnableResponseDto,
    ProfileHabilitationResponseDto,
    ProfileHabilitationStoreRequestDto,
    ProfileHabilitationUpdateRequestDto,
    ProfileWithoutUserDto,
    ReassignRequestDto,
    RemoveRequestDto,
} from '../dtos/profile-habilitation-response.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable({
    providedIn: 'root',
})
export class ProfileHabilitationApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchProfileHabilitation(
        payload: ProfileHabilitationRequestDto,
        page: string
    ): Observable<ProfileHabilitationResponseDto> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.PROFILE_HABILITATION.replace('{page}', page)}`;

        const paramsObject = Object.entries(payload ?? {}).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;

        return this.http.get<ProfileHabilitationResponseDto>(url, { params });
    }

    storeProfileHabilitation(
        payload: ProfileHabilitationStoreRequestDto
    ): Observable<ProfileHabilitation> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.STORE}`;
        return this.http.post<ProfileHabilitation>(url, payload);
    }

    updateProfileHabilitation(
        payload: ProfileHabilitationUpdateRequestDto
    ): Observable<ProfileHabilitation> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.UPDATE}`;
        return this.http.put<ProfileHabilitation>(url, payload);
    }

    deleteProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDeleteResponseDto> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.DELETE}`;
        return this.http.delete<ProfileHabilitationDeleteResponseDto>(url, {
            params: { id },
        });
    }

    enableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationEnableResponseDto> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.ENABLE}`;
        return this.http.post<ProfileHabilitationEnableResponseDto>(url, {
            id,
        });
    }

    disableProfileHabilitation(
        id: string
    ): Observable<ProfileHabilitationDisableResponseDto> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.DISABLE}`;
        return this.http.post<ProfileHabilitationDisableResponseDto>(url, {
            id,
        });
    }

    getProfilesWithoutUser(
        profileId?: string
    ): Observable<ProfileWithoutUserDto[]> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.WITHOUT_USER}`;
        const params = profileId ? new HttpParams({ fromObject: { profileId } }) : undefined;
        return this.http.get<ProfileWithoutUserDto[]>(url, { params });
    }

    reassignUsers(payload: ReassignRequestDto): Observable<void> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.REASSIGNED}`;
        return this.http.post<void>(url, payload);
    }

    removeUsers(payload: RemoveRequestDto): Observable<void> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.RETIRE}`;
        return this.http.post<void>(url, payload);
    }

    assignUsers(payload: AffectedRequestDto): Observable<void> {
        const url = `${this.baseUrl}${ProfileHabilitationEndpoint.AFFECTED}`;
        return this.http.post<void>(url, payload);
    }

    getUsersByProfile(
        profileId: string,
        page: string,
        filter?: { matricule?: string }
    ): Observable<UserResponseDto> {
        const url = `${this.baseUrl}permission-profiles/${profileId}/users?page=${page}`;
        const paramsObject: Record<string, string> = {};
        if (filter?.matricule) {
            paramsObject['matricule'] = filter.matricule;
        }
        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;
        return this.http.get<UserResponseDto>(url, { params });
    }

    getUsersWithoutProfile(
        page: string,
        filter?: { matricule?: string }
    ): Observable<UserResponseDto> {
        const url = `${this.baseUrl}users/without-profil?page=${page}`;
        const paramsObject: Record<string, string> = {};
        if (filter?.matricule) {
            paramsObject['matricule'] = filter.matricule;
        }
        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;
        return this.http.get<UserResponseDto>(url, { params });
    }
}
