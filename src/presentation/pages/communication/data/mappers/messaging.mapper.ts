/* import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { MessagingEntity } from '../../domain/entities/messaging.entity';
import { MessagingResponseDto } from '../dtos/messaging-response.dto';

export class MessagingMapper {
    static toEntity(dto: MessagingResponseDto): Paginate<MessagingEntity> {
        return {
            data: dto.data.data.map((item: any) => ({
                id: item.id,
                reference: item.reference,
                subject: item.sujet,
                object: item.objet,
                status: item.statut,
                createdAt: item.created_at,
                sender: {
                    name: item.signature_nom,
                    function: item.signature_fonction,
                    contact: item.signature_contact,
                },
                requester: {
                    name: item.demandeur_nom,
                },
                hasAttachment: !!item.piece_jointe,
                fileUrl: item.file_url
            })),
        };
    }
}
 */
