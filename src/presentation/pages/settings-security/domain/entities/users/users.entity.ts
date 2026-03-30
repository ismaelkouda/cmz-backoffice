import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/users/users-status.enum';
import { UsersProps } from '@pages/settings-security/domain/interfaces/users/users-props.interface';
import { Profiles, ProfilesStyle } from '@shared/domain/enums/profiles.enum';
import {
    Responsibilities,
    ResponsibilitiesStyle,
} from '@shared/domain/enums/responsibilities.enum';

export class UsersEntity {
    constructor(private readonly props: UsersProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.lastName + '-' + this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get email(): string {
        return this.props.email;
    }

    get phone(): string {
        return this.props.phone;
    }

    get responsibility(): Responsibilities {
        return this.props.responsibility;
    }
    responsibilityStyle(
        responsibility: Responsibilities
    ): ResponsibilitiesStyle {
        const methodMap: Record<Responsibilities, ResponsibilitiesStyle> = {
            [Responsibilities.SUPERVISOR]: ResponsibilitiesStyle.SUPERVISOR,
            [Responsibilities.LEADER]: ResponsibilitiesStyle.LEADER,
            [Responsibilities.AGENT]: ResponsibilitiesStyle.AGENT,
        };
        return methodMap[responsibility];
    }

    get profile(): Profiles {
        return this.props.profile;
    }
    profileStyle(profile: Profiles): ProfilesStyle {
        const methodMap: Record<Profiles, ProfilesStyle> = {
            [Profiles.SUPERVISOR]: ProfilesStyle.SUPERVISOR,
            [Profiles.LEADER]: ProfilesStyle.LEADER,
            [Profiles.AGENT]: ProfilesStyle.AGENT,
        };
        return methodMap[profile];
    }

    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
            [Status.BLOCKED]: StatusStyle.BLOCKED,
            [Status.PENDING]: StatusStyle.PENDING,
        };
        return methodMap[status];
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: UsersProps): UsersEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new UsersEntity(props);
    }
}
