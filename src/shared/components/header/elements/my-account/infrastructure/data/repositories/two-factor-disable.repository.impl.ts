import { map, Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { TwoFactorDisableRepository } from '../../../domain/repositories/two-factor-disable.repository';
import { TwoFactorDisableEntity } from '../../../domain/entities/two-factor-disable.entity';
import { twoFactorDisableMapper } from '../mappers/two-factor-disable.mapper';
import { inject, Injectable } from '@angular/core';
import { MyAccountApi } from '../../api/my-account.api';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';

@Injectable({ providedIn: 'root' })
export class TwoFactorDisableRepositoryImpl implements TwoFactorDisableRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);

    execute(entity: TwoFactorDisableEntity): Observable<MessageEntity> {
        const dto = twoFactorDisableMapper(entity);
        return this.api
            .twoFactorDisable(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
}
