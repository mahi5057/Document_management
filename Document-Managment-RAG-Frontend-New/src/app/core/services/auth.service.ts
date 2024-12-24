import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { TokenValidationResponse } from '../../interfaces/token-validation.interface';
import { ApiEndpointsService } from './api-endpoints.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private httpService: HttpService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private apiEndpoints: ApiEndpointsService
    ) { }

    /**
   
     * @param token 
     * @returns 
     */
    validateToken(token: string): Observable<TokenValidationResponse> {
        const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.auth.validateToken);
        return this.httpService.post<TokenValidationResponse>(url, { token }).pipe(
            catchError(error => {
                console.error('Token validation failed', error);
                return of({ value: false, error: 'Token validation failed' });
            })
        );
    }

    /**
     * Checks if the user is authenticated by validating the access token.
     * @returns
     */
    isAuthenticated(): Observable<boolean> {
        let token: string | null = null;
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('accessToken');
        }

        if (!token) {
            return of(false);
        }
        return this.validateToken(token).pipe(
            map((response: TokenValidationResponse) => {
                if (response.value) {
                    return true;
                }
                console.error('Invalid token:', response.error);
                return false;
            }),
            catchError(error => {
                console.error('Error during token validation', error);
                return of(false);
            })
        );
    }
}
