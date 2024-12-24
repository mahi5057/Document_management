import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class HttpReqInterceptor implements HttpInterceptor {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isPlatformBrowser(this.platformId)) {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const clonedRequest = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return next.handle(clonedRequest);
                }
                return next.handle(req);
            } catch (error) {
                console.log('Error accessing localStorage:', error);
                return next.handle(req);
            }
        } else {
            console.warn('Attempted to intercept an HTTP request on the server side.');
            return next.handle(req);
        }
    }
}
