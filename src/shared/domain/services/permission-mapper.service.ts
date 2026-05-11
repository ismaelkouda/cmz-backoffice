import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionMapperService {
    toApiPayload(nodes: any[]) {
        const result: any[] = [];

        const walk = (node: any) => {
            result.push({
                key: node.key,
                actions: { ...node.data.actions },
            });

            node.children?.forEach(walk);
        };

        nodes.forEach(walk);

        return result;
    }
}
