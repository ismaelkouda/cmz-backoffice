import { Injectable } from '@angular/core';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';

@Injectable({ providedIn: 'root' })
export class PermissionTreeService {
    transformPermissionsToTree(permissions: any[]): TreeNodeInterface[] {
        return permissions.map((p) => this.mapEntityToTreeNode(p));
    }

    private mapEntityToTreeNode(entity: any): TreeNodeInterface {
        const children: TreeNodeInterface[] = (entity.children ?? []).map(
            (c: any) => this.mapEntityToTreeNode(c)
        );

        const hasCheckedDescendant = children.some(
            (c) => c.checked || c.expanded
        );

        return {
            key: entity.key.toString(),
            value: entity.value.toString(),
            label: entity.label,
            icon: entity.icon ?? '',
            checked: entity.checked ?? false,
            selectable: true,
            expanded: hasCheckedDescendant,
            children,
            leaf: children.length === 0,
        };
    }

    collectLeafKeysFromNodes(nodes: TreeNodeInterface[]): string[] {
        console.log('nodes: ', nodes);
        const result = new Set<string>();

        const collect = (node: TreeNodeInterface) => {
            if (node.value) {
                result.add(node.value);
            }
            if (!node.children || node.children.length === 0) {
                result.add(node.value);
                return;
            }
            node.children.forEach(collect);
        };

        nodes.forEach(collect);
        return [...result];
    }

    countLeafNodes(nodes: TreeNodeInterface[]): Set<string> {
        const leafKeys = new Set<string>();

        const collect = (node: TreeNodeInterface) => {
            if (!node.children || node.children.length === 0) {
                leafKeys.add(node.key);
                return;
            }
            node.children.forEach(collect);
        };

        nodes.forEach(collect);

        return leafKeys;
    }

    updateNodesExpanded(
        nodes: TreeNodeInterface[],
        selectedNodes: TreeNodeInterface[]
    ): TreeNodeInterface[] {
        const selectedKeys = new Set(selectedNodes.map((n) => n.key));

        const hasSelectedDescendant = (node: TreeNodeInterface): boolean => {
            if (selectedKeys.has(node.key)) {
                return true;
            }
            return node.children?.some(hasSelectedDescendant) ?? false;
        };

        return nodes.map((node) => {
            const updatedChildren = node.children
                ? this.updateNodesExpanded(node.children, selectedNodes)
                : [];
            return {
                ...node,
                expanded: hasSelectedDescendant(node),
                children: updatedChildren,
            };
        });
    }

    expandAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: true,
            children: node.children ? this.expandAll(node.children) : [],
        }));
    }

    collapseAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: false,
            children: node.children ? this.collapseAll(node.children) : [],
        }));
    }

    collectCheckedNodes(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        const result: TreeNodeInterface[] = [];

        const walk = (items: TreeNodeInterface[]) => {
            for (const node of items) {
                if (node.checked) {
                    result.push(node);
                }

                if (node.children?.length) {
                    walk(node.children);
                }
            }
        };

        walk(nodes);

        return result;
    }
}
