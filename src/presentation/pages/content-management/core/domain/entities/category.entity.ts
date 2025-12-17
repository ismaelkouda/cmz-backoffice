import { SubCategoryEntity } from "./sub-category.entity";

export class CategoryEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly icon: string,
        public readonly color: string,
        public readonly backgroundColor: string,
        public readonly description: string,
        public readonly subCategories: SubCategoryEntity[]
    ) { }

    public clone(updates: Partial<CategoryEntity>): CategoryEntity {
        return new CategoryEntity(
            updates.id ?? this.id,
            updates.name ?? this.name,
            updates.icon ?? this.icon,
            updates.color ?? this.color,
            updates.backgroundColor ?? this.backgroundColor,
            updates.description ?? this.description,
            updates.subCategories ?? this.subCategories
        );
    }

    getSubCategoriesForSelect(): Array<{ label: string; value: number }> {
        return this.subCategories.map(subCategory => ({
            label: subCategory.name,
            value: subCategory.id
        }));
    }

    findSubCategoryById(subCategoryId: number): SubCategoryEntity | undefined {
        return this.subCategories.find(sub => sub.id === subCategoryId);
    }
}
