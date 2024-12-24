import { Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    let clonedRequest = req;

    try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            clonedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error('Error accessing localStorage or setting token:', error);
    }

    return next(clonedRequest);
};
