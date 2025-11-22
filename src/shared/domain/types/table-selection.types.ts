export interface TableSelectionConfig {
    maxSelections?: number;
    allowSelectAll?: boolean;
    selectionMode: 'single' | 'multiple' | 'range';
}

export interface SelectionState<T> {
    selectedIds: Set<string>;
    lastSelectedIndex: number | null;
    isAllSelected: boolean;
    isPartialSelected: boolean;
}

export interface SelectionEvent<T> {
    selectedItems: T[];
    selectedIds: string[];
    selectionCount: number;
    isAllSelected: boolean;
}
