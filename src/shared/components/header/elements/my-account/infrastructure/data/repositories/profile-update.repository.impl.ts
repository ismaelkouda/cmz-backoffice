import { map, Observable } from 'rxjs';

import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ProfileUpdateRepository } from '../../../domain/repositories/profile-update.repository';
import { profileUpdateMapper } from '../mappers/profile-update.mapper';
import { MyAccountApi } from '../../api/my-account.api';
import { inject, Injectable } from '@angular/core';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';
import { ProfileUpdateEntity } from '../../../domain/entities/profile-update.entity';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateRepositoryImpl implements ProfileUpdateRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);

    execute(entity: ProfileUpdateEntity): Observable<MessageEntity> {
        const dto = profileUpdateMapper(entity);
        return this.api
            .profileUpdate(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
}
