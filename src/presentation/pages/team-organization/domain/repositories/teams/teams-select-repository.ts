import { Injectable } from '@angular/core';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsSelectRepository {
    abstract readAll(): Observable<TeamsSelectEntity[]>;
}
