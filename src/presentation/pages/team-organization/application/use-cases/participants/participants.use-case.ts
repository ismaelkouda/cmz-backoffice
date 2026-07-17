import { inject, Injectable } from '@angular/core';
import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { ParticipantsCreateContract } from '@pages/team-organization/domain/contracts/participants/participants-create.contract';
import { ParticipantsUpdateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.contract';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { participantsCreateVo } from '@pages/team-organization/domain/value-objects/participants/participants-create.vo';
import { participantsDeleteVo } from '@pages/team-organization/domain/value-objects/participants/participants-delete.vo';
import { participantsDisableVo } from '@pages/team-organization/domain/value-objects/participants/participants-disable.vo';
import { participantsEnableVo } from '@pages/team-organization/domain/value-objects/participants/participants-enable.vo';
import { participantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import { participantsUpdateVo } from '@pages/team-organization/domain/value-objects/participants/participants-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsUseCase {
    private readonly repository = inject(ParticipantsRepository);

    execute(
        dto: ParticipantsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.repository.readAll(
            participantsFilterVo(dto),
            page,
            options
        );
    }

    create(
        dto: ParticipantsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(participantsCreateVo(dto)));
    }

    update(
        dto: ParticipantsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(participantsUpdateVo(dto)));
    }

    enable(dto: ParticipantsEnableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(participantsEnableVo(dto));
    }

    disable(dto: ParticipantsDisableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(participantsDisableVo(dto));
    }

    delete(dto: ParticipantsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(participantsDeleteVo(dto));
    }
}
