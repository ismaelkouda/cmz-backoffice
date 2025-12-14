import {
    DestroyRef,
    Injectable,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, distinctUntilChanged } from 'rxjs';

export interface SelectionEvent<T> {
    selectedItems: T[];
    selectedIds: string[];
    selectionCount: number;
    selectionSource: 'checkbox' | 'input' | 'clear' | 'initial';
    previousSelection: string[];
}

@Injectable()
export class TableSelectionService<T extends { uniqId: string }> {
    private readonly destroyRef = inject(DestroyRef);

    // === SIGNALS ===
    private readonly _selectedIds = signal<ReadonlySet<string>>(new Set());
    private readonly _availableItems = signal<readonly T[]>([]);

    // Computed réactifs
    readonly selectedIds = computed(() => this._selectedIds());
    readonly selectedCount = computed(() => this.selectedIds().size);
    readonly hasSelection = computed(() => this.selectedCount() > 0);

    readonly isAllSelected = computed(() => {
        const items = this._availableItems();
        return items.length > 0 && this._selectedIds().size === items.length;
    });

    readonly isPartialSelected = computed(() => {
        const items = this._availableItems();
        const selectedIds = this._selectedIds();
        return selectedIds.size > 0 && selectedIds.size < items.length;
    });

    readonly selectedItems = computed(() => {
        const items = this._availableItems();
        const ids = this._selectedIds();
        return items.filter((item) => ids.has(item.uniqId));
    });

    isItemSelected(item: T): boolean {
        return this._selectedIds().has(item.uniqId);
    }

    // Événements réactifs
    private readonly _selectionChange = new Subject<SelectionEvent<T>>();
    readonly selectionChange$ = this._selectionChange.pipe(
        distinctUntilChanged(
            (prev, curr) =>
                prev.selectionCount === curr.selectionCount &&
                JSON.stringify(prev.selectedIds) ===
                JSON.stringify(curr.selectedIds)
        ),
        takeUntilDestroyed(this.destroyRef)
    );

    // === API PUBLIQUE ===

    setAvailableItems(items: T[]): void {
        this._availableItems.set([...items]);
    }

    toggleItemSelection(item: T, source: 'checkbox' = 'checkbox'): void {
        const newIds = new Set(this._selectedIds());
        if (newIds.has(item.uniqId)) {
            newIds.delete(item.uniqId);
        } else {
            newIds.add(item.uniqId);
        }
        this._updateSelection(newIds, source);
    }

    selectFirstNItems(count: number, source: 'input' = 'input'): void {
        const items = this._availableItems();
        if (count <= 0 || items.length === 0) {
            this.clearSelection(source);
            return;
        }

        const validCount = Math.min(Math.max(0, count), items.length);
        const newSelection = new Set<string>();
        for (let i = 0; i < validCount; i++) {
            newSelection.add(items[i].uniqId);
        }
        this._updateSelection(newSelection, source);
    }

    toggleSelectAll(source: 'checkbox' = 'checkbox'): void {
        const items = this._availableItems();
        const currentIds = this._selectedIds();
        const newSelection =
            currentIds.size === items.length
                ? new Set<string>()
                : new Set(items.map((item) => item.uniqId));
        this._updateSelection(newSelection, source);
    }

    clearSelection(source: 'input' | 'checkbox' | 'clear' = 'clear'): void {
        this._updateSelection(new Set(), source);
    }

    private _updateSelection(
        newIds: Set<string>,
        source: SelectionEvent<T>['selectionSource']
    ): void {
        const previousIds = Array.from(this._selectedIds());
        if (this._areSetsEqual(newIds, this._selectedIds())) return;

        this._selectedIds.set(newIds);
        this._emitSelectionChange(source, previousIds);
    }

    private _emitSelectionChange(
        source: SelectionEvent<T>['selectionSource'],
        previousIds: string[] = []
    ): void {
        this._selectionChange.next({
            selectedItems: this.selectedItems(),
            selectedIds: Array.from(this._selectedIds()),
            selectionCount: this.selectedCount(),
            selectionSource: source,
            previousSelection: previousIds,
        });
    }

    private _areSetsEqual(
        setA: Set<string>,
        setB: ReadonlySet<string>
    ): boolean {
        if (setA.size !== setB.size) return false;
        for (const item of setA) {
            if (!setB.has(item)) return false;
        }
        return true;
    }
}
