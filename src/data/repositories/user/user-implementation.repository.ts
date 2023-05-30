import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from './entities/user-entity';
import { UserImplementationRepositoryMapper } from './mappers/user-repository.mapper';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserModel } from 'src/domain/models/user.model';
// @ts-ignore
import appConfig from '../../../assets/config/app-config.json';

@Injectable({
    providedIn: 'root',
})
export class UserImplementationRepository extends UserRepository {
    userMapper = new UserImplementationRepositoryMapper();
    timeoutInterval: any;
    baseUrl: any = appConfig.serverUrl;

    constructor(private http: HttpClient) {
        super();
    }

    login(params: { email: string, password: string }): Observable<UserModel> {
        return this.http
            .post<UserEntity>(`${this.baseUrl}login`, params)
            .pipe(map(this.userMapper.mapFrom));
    }

}
