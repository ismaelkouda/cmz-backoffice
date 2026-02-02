import { Injectable } from '@angular/core';

import { ProfilsHabilitationsTreeNodeEntity } from '../../entities/profils-habilitations/profils-habilitations-tree-node.entity';
import { ProfilsHabilitationsTreeNodeInterface } from '../../interfaces/profils-habilitations/profils-habilitations-tree-node.interface';

@Injectable({
    providedIn: 'root',
})
export class PermissionTreeService {
    transformPermissionsToTree(
        permissions: ProfilsHabilitationsTreeNodeEntity[]
    ): ProfilsHabilitationsTreeNodeInterface[] {
        return permissions.map((permission) =>
            this.mapEntityToTreeNode(permission)
        );
    }

    private mapEntityToTreeNode(
        entity: ProfilsHabilitationsTreeNodeEntity
    ): ProfilsHabilitationsTreeNodeInterface {
        const children = entity.children.map((child) =>
            this.mapEntityToTreeNode(child)
        );

        // Expand if any child is expanded (has checked descendants) or checked
        const hasCheckedDescendant = children.some(
            (c) => c.checked || c.expanded
        );

        return {
            key: entity.key,
            label: entity.label,
            icon: '', // Default icon if needed
            checked: entity.checked,
            selectable: true,
            expanded: hasCheckedDescendant,
            children: children,
            leaf: !children || children.length === 0,
        };
    }

    initializeSelectionKeys(
        treeNodes: ProfilsHabilitationsTreeNodeInterface[]
    ): Record<string, boolean> {
        const selectionKeys: Record<string, boolean> = {};
        this.collectSelectedKeys(treeNodes, selectionKeys);
        return selectionKeys;
    }

    private collectSelectedKeys(
        nodes: ProfilsHabilitationsTreeNodeInterface[],
        selectionKeys: Record<string, boolean>
    ): void {
        for (const node of nodes) {
            if (node.checked) {
                selectionKeys[node.key] = true;
            }

            if (node.children && node.children.length > 0) {
                this.collectSelectedKeys(node.children, selectionKeys);
            }
        }
    }

    private hasSelectedDescendant(
        node: ProfilsHabilitationsTreeNodeInterface,
        selectionKeys: Record<string, boolean>
    ): boolean {
        // Direct selection
        if (selectionKeys[node.key]) {
            return true;
        }

        // Check children
        if (node.children && node.children.length > 0) {
            return node.children.some((child) =>
                this.hasSelectedDescendant(child, selectionKeys)
            );
        }

        return false;
    }

    updateNodesExpanded(
        nodes: ProfilsHabilitationsTreeNodeInterface[],
        selectionKeys: Record<string, boolean>
    ): ProfilsHabilitationsTreeNodeInterface[] {
        return nodes.map((node) => {
            // const hasSelected = this.hasSelectedDescendant(node, selectionKeys);

            // Recursively update children first/simultaneously to ensure the tree state is consistent
            const updatedChildren = node.children
                ? this.updateNodesExpanded(node.children, selectionKeys)
                : [];

            // Expand if it has selected descendants (or is selected itself if that implies expansion, usually parent expands if child selected)
            // Logic: Expand if a descendant is selected (so we can see the selection).
            // If the node itself is selected and has no children, no need to expand.
            // If the node itself is selected and has children, maybe expand?
            // Common pattern: expand path to selection.
            const shouldExpand =
                node.children &&
                node.children.some((child) =>
                    this.hasSelectedDescendant(child, selectionKeys)
                );

            return {
                ...node,
                expanded: shouldExpand,
                children: updatedChildren,
            };
        });
    }

    expandAll(
        nodes: ProfilsHabilitationsTreeNodeInterface[]
    ): ProfilsHabilitationsTreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: true,
            children: node.children ? this.expandAll(node.children) : [],
        }));
    }

    collapseAll(
        nodes: ProfilsHabilitationsTreeNodeInterface[]
    ): ProfilsHabilitationsTreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: false,
            children: node.children ? this.collapseAll(node.children) : [],
        }));
    }

    convertSelectionKeysToArray(
        selectionKeys: Record<
            string,
            boolean | { checked: boolean; partialChecked: boolean }
        >
    ): string[] {
        return Object.entries(selectionKeys)
            .filter(([, value]) => {
                if (typeof value === 'boolean') {
                    return value;
                }
                return value && value.checked;
            })
            .map(([key]) => key);
    }

    collectLeafKeysFromSelection(
        tree: ProfilsHabilitationsTreeNodeInterface[],
        selectionKeys: ProfilsHabilitationsTreeNodeInterface
    ): string[] {
        const result = new Set<string>();

        const map = new Map<string, ProfilsHabilitationsTreeNodeInterface>();

        const indexTree = (nodes: ProfilsHabilitationsTreeNodeInterface[]) => {
            for (const n of nodes) {
                map.set(n.key, n);
                if (n.children?.length) {
                    indexTree(n.children);
                }
            }
        };

        const collectLeafs = (node: ProfilsHabilitationsTreeNodeInterface) => {
            if (!node.children || node.children.length === 0) {
                result.add(node.key);
                return;
            }
            node.children.forEach(collectLeafs);
        };

        indexTree(tree);

        Object.entries(selectionKeys).forEach(([key, state]) => {
            console.log(key, state);
            const node = map.get(state);
            if (!node) {
                return;
            }

            collectLeafs(node);
        });

        return Array.from(result);
    }
}
