// import { TeamsFreeParticipantsItemApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-free-participants-response-api.dto';

// export class TeamsFreeParticipantsEntity {
//     constructor(
//         public readonly uniqId: string,
//         public email: string,
//         public phone: string,
//         public firstName: string,
//         public lastName: string
//     ) {}

//     static fromDto(
//         dto: TeamsFreeParticipantsItemApiDto
//     ): TeamsFreeParticipantsEntity {
//         return new TeamsFreeParticipantsEntity(
//             dto.uniq_id,
//             dto.email,
//             dto.phone,
//             dto.first_name,
//             dto.last_name
//         );
//     }

//     public with(
//         dto: TeamsFreeParticipantsItemApiDto
//     ): TeamsFreeParticipantsEntity {
//         if (this.uniqId === dto.uniq_id) {
//             return this;
//         }
//         return TeamsFreeParticipantsEntity.fromDto(dto);
//     }
// }
