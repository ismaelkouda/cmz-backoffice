import { inject, Injectable } from '@angular/core';
import { InfrastructureCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-create.dto';
import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';
import { InfrastructureFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-filter.dto';
import { InfrastructureUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-update.dto';
import { InfrastructureCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { InfrastructureFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-repository';
import { InfrastructureCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-create.vo';
import { InfrastructureDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-delete.vo';
import { InfrastructureFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-filter.vo';
import { InfrastructureUpdateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureUseCase {
    private readonly repository = inject(InfrastructureRepository);

    execute(
        dto: InfrastructureFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        const vo = InfrastructureFilterVo.fromDto(dto);
        const entity = InfrastructureFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(dto: InfrastructureCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureCreateVo.fromDto(dto);
        const entity = InfrastructureCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: InfrastructureUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureUpdateVo.fromDto(dto);
        const entity = InfrastructureUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(dto: InfrastructureDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureDeleteVo.fromDto(dto);
        const entity = InfrastructureDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
