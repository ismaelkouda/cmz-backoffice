import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from './entities/user-entity';
import { UserImplementationRepositoryMapper } from './mappers/user-repository.mapper';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserModel } from 'src/domain/models/user.model';
import { EnvService } from '../../../shared/services/env.service';
@Injectable({
    providedIn: 'root',
})
export class UserImplementationRepository extends UserRepository {
    userMapper = new UserImplementationRepositoryMapper();
    baseUrl: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        super();
        this.baseUrl = this.envService.apiUrl;
    }

    login(params: { username: string, password: string }): Observable<UserModel> {
        return this.http
            .post<UserEntity>(`${this.baseUrl}login`, params)
            .pipe(map(this.userMapper.mapFrom));
    }

}
