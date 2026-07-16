import { inject, Injectable } from '@angular/core';
import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';
import { InfrastructureCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.contract';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { InfrastructureUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.contract';
import { infrastructureFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure.repository';
import { infrastructureCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-create.vo';
import { infrastructureDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-delete.vo';
import { infrastructureFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-filter.vo';
import { infrastructureUpdateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-update.vo';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

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
        return defer(() => {
            const vo = infrastructureFilterVo(contract);
            const entity = infrastructureFilterEntity(vo);
            return this.repository.execute(entity, page, options);
        });
    }

    create(dto: InfrastructureCreateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.create(infrastructureCreateVo(dto)));
    }

    update(dto: InfrastructureUpdateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.update(infrastructureUpdateVo(dto)));
    }

    delete(dto: InfrastructureDeleteDto): Observable<MessageResponseDto> {
        return defer(() => this.repository.delete(infrastructureDeleteVo(dto)));
    }
}
