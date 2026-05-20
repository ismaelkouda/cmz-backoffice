import { Injectable } from '@angular/core';
import { ActorEntity } from '@shared/domain/entities/actor.entity';

@Injectable({ providedIn: 'root' })
export class HistoryUserMapper {
    getUserFullName(user: ActorEntity | null): string {
        if (!user) {
            return 'N/A';
        }
        if (user.lastName && user.firstName) {
            return `${user.lastName} ${user.firstName} [${user.phone}]`;
        }
        if (user.lastName) {
            return user.lastName;
        }
        if (user.phone) {
            return user.phone;
        }
        return 'Utilisateur inconnu';
    }

    getUserInitials(user: ActorEntity | null): string {
        if (!user) {
            return '?';
        }
        if (user.lastName && user.firstName) {
            return `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`.toUpperCase();
        }
        if (user.lastName) {
            return user.lastName.charAt(0).toUpperCase();
        }
        if (user.phone) {
            return user.phone.charAt(0).toUpperCase();
        }
        return '?';
    }
}
