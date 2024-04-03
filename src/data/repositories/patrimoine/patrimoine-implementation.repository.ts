import { PatrimoineEntity } from './entities/patrimoine-entity';
import { PatrimoineImplementationRepositoryMapper } from './mappers/patrimoine-repository.mapper';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PatrimoineRepository } from '../../../domain/repositories/patrimoine.repository';
import { PatrimoineModel } from '../../../domain/models/patrimoine.model';
import { EnvService } from '../../../shared/services/env.service';

@Injectable({
    providedIn: 'root',
})
export class PatrimoineImplementationRepository extends PatrimoineRepository {

    patrimoineMapper = new PatrimoineImplementationRepositoryMapper();
    public baseUrl: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        super();
        this.baseUrl = this.envService.apiUrl;
    }

    GetAllPatrimoine(): Observable<PatrimoineModel> {
        return this.http.post<PatrimoineEntity>(`${this.baseUrl}organisation-patrimoine/poste-distributions/all`, {}).pipe(
            map(this.patrimoineMapper.mapFrom));
    }

    CreatePatrimoine(params: {}): Observable<PatrimoineModel> {
        return this.http
            .post<PatrimoineEntity>(`${this.baseUrl}patrimoines`, { params })
            .pipe(map(this.patrimoineMapper.mapFrom));
    }


}
