import { Injectable } from '@angular/core';
import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsCreateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-create.validate-contract';
import { ParticipantsUpdateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.validate-contract';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsRepository {
    abstract readAll(
        filter: ParticipantsFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ParticipantsEntity>>;
    abstract create(
        props: ParticipantsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: ParticipantsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: ParticipantsDeleteDto
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        dto: ParticipantsEnableDto
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        dto: ParticipantsDisableDto
    ): Observable<SimpleResponseDto<void>>;
}
