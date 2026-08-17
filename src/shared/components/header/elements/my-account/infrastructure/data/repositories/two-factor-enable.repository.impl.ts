import { map, Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorEnableRepository } from '../../../domain/repositories/two-factor-enable.repository';
import { TwoFactorEnableEntity } from '../../../domain/entities/two-factor-enable.entity';
import { twoFactorEnableMapper } from '../mappers/two-factor-enable.mapper';
import { inject, Injectable } from '@angular/core';
import { MyAccountApi } from '../../api/my-account.api';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';

@Injectable({ providedIn: 'root' })
export class TwoFactorEnableRepositoryImpl implements TwoFactorEnableRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);

    execute(entity: TwoFactorEnableEntity): Observable<MessageEntity> {
        const dto = twoFactorEnableMapper(entity);
        return this.api
            .twoFactorEnable(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
}
