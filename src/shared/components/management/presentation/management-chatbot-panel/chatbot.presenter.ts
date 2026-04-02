import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';

import { ChatMessageVM } from './chatbot.types';

@Injectable({ providedIn: 'root' })
export class ChatbotPresenter {
    private readonly translate = inject(TranslateService);

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    constructor() {
        this.translate.onLangChange.subscribe((event) => {
            this.currentLang.set(event.lang);
        });
    }

    public mapToVM(messages: ChatbotEntity[]): ChatMessageVM[] {
        this.currentLang();
        const mapped = messages.map((msg) => this.mapSingleToVM(msg));

        return this.addDateSeparators(mapped);
    }

    private addDateSeparators(messages: ChatMessageVM[]): ChatMessageVM[] {
        if (messages.length === 0) {
            return messages;
        }

        const result: ChatMessageVM[] = [];
        let lastDateLabel = '';

        for (const msg of messages) {
            const currentDateLabel = this.getDateLabel(new Date(msg.createdAt));

            if (currentDateLabel !== lastDateLabel) {
                result.push({
                    id: `separator-${currentDateLabel}`,
                    content: '',
                    isAgent: false,
                    position: 'left',
                    timestampFormatted: '',
                    isRead: false,
                    createdAt: msg.createdAt,
                    readAt: null,
                    showDateSeparator: true,
                    dateLabel: currentDateLabel,
                });
                lastDateLabel = currentDateLabel;
            }

            result.push(msg);
        }

        return result;
    }

    private getDateLabel(date: Date): string {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (this.isSameDay(date, today)) {
            return this.translate.instant('COMMON.DATE.TODAY');
        }
        if (this.isSameDay(date, yesterday)) {
            return this.translate.instant('COMMON.DATE.YESTERDAY');
        }

        return new Intl.DateTimeFormat(this.currentLang(), {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    }

    private isSameDay(d1: Date, d2: Date): boolean {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    public mapSingleToVM(entity: ChatbotEntity): ChatMessageVM {
        const isAgent = this.isAgentMessage(entity);
        const position = isAgent ? 'right' : 'left';
        const isRead = this.isMessageRead(entity);

        return {
            id: entity.uniqId || '',
            content: this.cleanContent(entity.content),
            isAgent,
            position,
            timestampFormatted: this.formatTimestamp(entity.createdAt),
            isRead,
            createdAt: entity.createdAt,
            readAt: entity.readAt || null,
            channel: entity.channels?.[0] || 'chat',
        };
    }

    private isAgentMessage(entity: ChatbotEntity): boolean {
        return entity.sender?.toLowerCase() === 'agent';
    }

    private isMessageRead(entity: ChatbotEntity): boolean {
        return !!entity.readAt;
    }

    private cleanContent(content: string | undefined | null): string {
        if (!content) {
            return '';
        }
        return content.trim();
    }

    private formatTimestamp(
        dateValue: Date | string | undefined | null
    ): string {
        if (!dateValue) {
            return '--:--';
        }

        const date =
            typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

        if (Number.isNaN(date.getTime())) {
            return '--:--';
        }

        const isToday = this.isToday(date);
        const options: Intl.DateTimeFormatOptions = isToday
            ? { hour: '2-digit', minute: '2-digit' }
            : {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
              };

        return new Intl.DateTimeFormat(this.currentLang(), options).format(
            date
        );
    }

    private isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    public mapNewMessage(entity: ChatbotEntity): ChatMessageVM {
        return this.mapSingleToVM(entity);
    }
}
