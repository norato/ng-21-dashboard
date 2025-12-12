import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  showError(message: string, detail?: string) {
    this.messageService.add({
      severity: 'error',
      summary: message,
      detail: detail,
      life: 5000,
    });
  }

  showSuccess(message: string, detail?: string) {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail: detail,
      life: 3000,
    });
  }

  showWarning(message: string, detail?: string) {
    this.messageService.add({
      severity: 'warn',
      summary: message,
      detail: detail,
      life: 4000,
    });
  }

  showInfo(message: string, detail?: string) {
    this.messageService.add({
      severity: 'info',
      summary: message,
      detail: detail,
      life: 3000,
    });
  }
}
