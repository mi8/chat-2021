import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private auth:AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.decrypt(this.localStorageService.retrieve('token'))}`,
      },
    });
    return next.handle(request).pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => {
        if (err.status == 0) {
          this.router.navigate(['DeadServer']);
        }
        if (err.status == 404) {
          this.router.navigate(['DeadServer']);
        }
        return throwError(err);
      })
    );
  }
}
