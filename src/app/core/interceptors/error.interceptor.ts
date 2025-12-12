import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GLOBAL_ERROR_CODES, ToastService } from '$core';

const ERROR_MESSAGES: Record<number, string> = {
  404: 'Resource not found',
  500: 'Server error',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (GLOBAL_ERROR_CODES.includes(error.status as any)) {
        const message = ERROR_MESSAGES[error.status] || 'An error occurred';
        toastService.showError(message);
      }
      return throwError(() => error);
    })
  );
};
