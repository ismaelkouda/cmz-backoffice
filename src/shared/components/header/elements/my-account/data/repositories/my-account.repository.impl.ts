import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { LogoutEntity } from '../../domain/entities/logout.entity';
import { MyAccountRepository } from '../../domain/repositories/my-account.repository';
import { MyAccountMapper } from '../mappers/my-account.mapper';
import { MyAccountApi } from '../sources/my-account.api';

@Injectable({ providedIn: 'root' })
export class MyAccountRepositoryImpl extends MyAccountRepository {
    constructor(
        private readonly api: MyAccountApi,
        private readonly myAccountMapper: MyAccountMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchLogout(): Observable<LogoutEntity> {
        return this.api
            .fetchLogout()
            .pipe(map((response) => this.myAccountMapper.mapFromDto(response)));
    }
}
