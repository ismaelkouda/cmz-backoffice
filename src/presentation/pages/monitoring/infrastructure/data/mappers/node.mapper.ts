import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { NodeEntity } from '../../../domain/entities/node/node.entity';
import { NodeItemDto } from '../../api/dto/node/node-response.dto';

export class NodeMapper extends SimpleResponseMapper<NodeEntity, NodeItemDto> {
    protected override mapItemFromDto(dto: NodeItemDto): NodeEntity {
        return new NodeEntity(dto.nodeMonitoringLink);
    }
}
