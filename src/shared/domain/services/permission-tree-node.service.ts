import { Injectable } from '@angular/core';
import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';

@Injectable({
    providedIn: 'root',
})
export class PermissionTreeService {
    public mapNodes(permissions: TreeNodeEntity[]): TreeNodeInterface[] {
        return permissions.map((permission) => this.mapNode(permission));
    }

    private mapNode(
        entity: TreeNodeEntity,
        parent?: TreeNodeInterface
    ): TreeNodeInterface {
        const node: TreeNodeInterface = {
            icon: entity.icon,
            key: entity.key?.toString() ?? '',
            value: entity.value?.toString() ?? '',
            label: entity.label ?? '',
            checked: entity.checked ?? false,
            selectable: true,
            expanded: false,
            leaf: false,
            children: [],
            parent,
        };

        const children = (entity.children ?? []).map((child) =>
            this.mapNode(child, node)
        );

        node.children = children;
        node.leaf = children.length === 0;

        return node;
    }

    public expandAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: true,
            children: node.children?.length
                ? this.expandAll(node.children)
                : [],
        }));
    }

    public collapseAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: false,
            children: node.children?.length
                ? this.collapseAll(node.children)
                : [],
        }));
    }

    public collectCheckedNodes(
        nodes: TreeNodeInterface[]
    ): TreeNodeInterface[] {
        const result: TreeNodeInterface[] = [];

        const walk = (node: TreeNodeInterface): void => {
            if (node.checked) {
                result.push(node);
            }

            node.children?.forEach(walk);
        };

        nodes.forEach(walk);

        return result;
    }

    public collectLeafKeysFromNodes(nodes: TreeNodeInterface[]): string[] {
        const result = new Set<string>();

        const walk = (node: TreeNodeInterface): void => {
            if (!node.children?.length) {
                result.add(node.value);
                return;
            }

            node.children.forEach(walk);
        };

        nodes.forEach(walk);

        return [...result];
    }
}
