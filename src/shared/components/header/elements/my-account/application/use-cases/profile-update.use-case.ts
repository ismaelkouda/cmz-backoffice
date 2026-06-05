import { inject, Injectable } from '@angular/core';
import { ProfileUpdateDto } from '../dto/profile-update.dto';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ProfileUpdateVo } from '../../domain/value-objects/profile-update.vo';
import { ProfileUpdateEntity } from '../../domain/entities/profile-update.entity';
import { ProfileUpdateRepository } from '../../domain/repositories/profile-update.repository';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateUseCase {
    private readonly repository = inject(ProfileUpdateRepository);

    execute(dto: ProfileUpdateDto): Observable<MessageEntity> {
        const vo = ProfileUpdateVo.fromDto(dto);
        const entity = ProfileUpdateEntity.fromVo(vo);
        return this.repository.execute(entity);
    }
}
