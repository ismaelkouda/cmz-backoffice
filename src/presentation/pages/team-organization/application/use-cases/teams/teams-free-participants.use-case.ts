// import { inject } from '@angular/core';
// import { Observable } from 'rxjs';

// import {
//     Paginate,
//     SimpleResponseDto,
// } from '@shared/data/dto/simple-response.dto';

// import { TeamsFreeParticipantsAssignDto } from '@presentation/pages/team-organization/application/dto/teams/teams-free-participants-assign.dto';
// import { TeamsFreeParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants-assign.entity';
// import { TeamsFreeParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants.entity';
// import { TeamsFreeParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-free-participants-repository';
// import { TeamsFreeParticipantsAssignVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-free-participants-assign.vo';

// export class TeamsFreeParticipantsUseCase {
//     private readonly repository = inject(TeamsFreeParticipantsRepository);

//     readAll(
//         filter: null,
//         page: string
//     ): Observable<Paginate<TeamsFreeParticipantsEntity>> {
//         return this.repository.readAll(page);
//     }

//     assign(
//         dto: TeamsFreeParticipantsAssignDto
//     ): Observable<SimpleResponseDto<void>> {
//         const vo = TeamsFreeParticipantsAssignVo.fromDto(dto);
//         const entity = TeamsFreeParticipantsAssignEntity.toEntity(vo);
//         return this.repository.assign(entity);
//     }
// }
