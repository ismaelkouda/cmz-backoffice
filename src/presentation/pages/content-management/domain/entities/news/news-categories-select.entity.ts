import { NewsCategoriesSelectProps } from '../../interfaces/news/news-categories-select.props.interface';
import { NewsSubCategoriesSelectProps } from '../../interfaces/news/news-sub-categories-select.props.interface';

export class NewsCategoriesSelectEntity {
    constructor(public readonly props: NewsCategoriesSelectProps) {}

    get uniqId(): number {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get value(): string {
        return this.props.value;
    }

    get subCategories(): readonly NewsSubCategoriesSelectProps[] {
        return this.props.subCategories;
    }

    with(props: NewsCategoriesSelectProps): NewsCategoriesSelectEntity {
        if (this.hasSameProps(props)) {
            return this;
        }

        return new NewsCategoriesSelectEntity(props);
    }

    private hasSameProps(props: NewsCategoriesSelectProps): boolean {
        if (
            this.uniqId !== props.uniqId ||
            this.name !== props.name ||
            this.value !== props.value
        ) {
            return false;
        }

        if (this.subCategories.length !== props.subCategories.length) {
            return false;
        }

        return this.subCategories.every((municipality, index) => {
            const otherMunicipality = props.subCategories[index];
            return (
                municipality.uniqId === otherMunicipality.uniqId &&
                municipality.value === otherMunicipality.value &&
                municipality.name === otherMunicipality.name
            );
        });
    }
}
