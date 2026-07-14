import { inject, Injectable } from '@angular/core';
import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';
import { InfrastructureCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.contract';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { InfrastructureUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.contract';
import { InfrastructureDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { infrastructureFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { infrastructureCreateFactory } from '@presentation/pages/administrative-infrastructure/domain/factories/infrastructure/infrastructure-create.factory';
import { infrastructureUpdateFactory } from '@presentation/pages/administrative-infrastructure/domain/factories/infrastructure/infrastructure-update.factory';
import { InfrastructureRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-repository';
import { infrastructureCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-create.vo';
import { InfrastructureDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-delete.vo';
import { infrastructureFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-filter.vo';
import { infrastructureUpdateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-update.vo';
import {
    MessageResponseDto,
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
        contract: InfrastructureFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        const vo = infrastructureFilterVo(contract);
        const entity = infrastructureFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    create(dto: InfrastructureCreateContract): Observable<MessageResponseDto> {
        const vo = infrastructureCreateVo(dto);
        const entity = infrastructureCreateFactory(vo);
        return this.repository.create(entity);
    }

    update(dto: InfrastructureUpdateContract): Observable<MessageResponseDto> {
        const vo = infrastructureUpdateVo(dto);
        const entity = infrastructureUpdateFactory(vo);
        return this.repository.update(entity);
    }

    delete(dto: InfrastructureDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureDeleteVo.fromDto(dto);
        const entity = InfrastructureDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
