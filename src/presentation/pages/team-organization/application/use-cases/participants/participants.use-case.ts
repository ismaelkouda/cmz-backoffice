import { inject, Injectable } from '@angular/core';
import { ParticipantsCreateDto } from '@pages/team-organization/application/dto/participants/participants-create.dto';
import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { ParticipantsUpdateDto } from '@pages/team-organization/application/dto/participants/participants-update.dto';
import { ParticipantsCreateEntity } from '@pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsDeleteEntity } from '@pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDisableEntity } from '@pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsEnableEntity } from '@pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsCreateVo } from '@pages/team-organization/domain/value-objects/participants/participants-create.vo';
import { ParticipantsDeleteVo } from '@pages/team-organization/domain/value-objects/participants/participants-delete.vo';
import { ParticipantsDisableVo } from '@pages/team-organization/domain/value-objects/participants/participants-disable.vo';
import { ParticipantsEnableVo } from '@pages/team-organization/domain/value-objects/participants/participants-enable.vo';
import { ParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import { ParticipantsUpdateVo } from '@pages/team-organization/domain/value-objects/participants/participants-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

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
        const vo = ParticipantsFilterVo.fromDto(dto);
        const entity = ParticipantsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(dto: ParticipantsCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsCreateVo.fromDto(dto);
        const entity = ParticipantsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: ParticipantsUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsUpdateVo.fromDto(dto);
        const entity = ParticipantsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(dto: ParticipantsEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsEnableVo.fromDto(dto);
        const entity = ParticipantsEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: ParticipantsDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsDisableVo.fromDto(dto);
        const entity = ParticipantsDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: ParticipantsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsDeleteVo.fromDto(dto);
        const entity = ParticipantsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
