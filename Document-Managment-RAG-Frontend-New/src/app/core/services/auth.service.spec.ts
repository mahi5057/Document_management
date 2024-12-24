import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { ApiEndpointsService } from './api-endpoints.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { TokenValidationResponse } from '../../interfaces/token-validation.interface';

describe('AuthService', () => {
    let service: AuthService;
    let httpServiceSpy: jasmine.SpyObj<HttpService>;
    let apiEndpointsSpy: jasmine.SpyObj<ApiEndpointsService>;

    const mockToken = 'valid-token';
    const mockInvalidToken = 'invalid-token';
    const tokenValidationResponse: TokenValidationResponse = { value: true };
    const tokenValidationErrorResponse: TokenValidationResponse = { value: false, error: 'Invalid token' };

    beforeEach(() => {
        const httpServiceMock = jasmine.createSpyObj('HttpService', ['post']);
        const apiEndpointsMock = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);
        const platformIdMock = 'browser';
    
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: HttpService, useValue: httpServiceMock },
                { provide: ApiEndpointsService, useValue: apiEndpointsMock },
                { provide: PLATFORM_ID, useValue: platformIdMock },
            ]
        });

        service = TestBed.inject(AuthService);
        httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
        apiEndpointsSpy = TestBed.inject(ApiEndpointsService) as jasmine.SpyObj<ApiEndpointsService>;

        apiEndpointsSpy.getEndpoint.and.returnValue('https://api.example.com/validate-token');
    });

    describe('validateToken', () => {
        it('should return a successful token validation response', () => {
            httpServiceSpy.post.and.returnValue(of(tokenValidationResponse));

            service.validateToken(mockToken).subscribe(response => {
                expect(response.value).toBe(true);
                expect(response.error).toBeUndefined();
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith('https://api.example.com/validate-token', { token: mockToken });
        });

        it('should return an error response if token validation fails', () => {
            httpServiceSpy.post.and.returnValue(of(tokenValidationErrorResponse));

            service.validateToken(mockInvalidToken).subscribe(response => {
                expect(response.value).toBe(false);
                expect(response.error).toBe('Invalid token');
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith('https://api.example.com/validate-token', { token: mockInvalidToken });
        });

        it('should handle errors during token validation', () => {
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Network error')));

            service.validateToken(mockToken).subscribe(response => {
                expect(response.value).toBe(false);
                expect(response.error).toBe('Token validation failed');
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith('https://api.example.com/validate-token', { token: mockToken });
        });
    });

    describe('isAuthenticated', () => {
        it('should return false if no token is found in localStorage', () => {
            spyOn(localStorage, 'getItem').and.returnValue(null);

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(false);
            });
        });

        it('should return true if the token is valid', () => {
            spyOn(localStorage, 'getItem').and.returnValue(mockToken);
            httpServiceSpy.post.and.returnValue(of(tokenValidationResponse));

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(true);
            });
        });

        it('should return false if the token is invalid', () => {
            spyOn(localStorage, 'getItem').and.returnValue(mockInvalidToken);
            httpServiceSpy.post.and.returnValue(of(tokenValidationErrorResponse));

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(false);
            });
        });

        it('should return false if there is an error during token validation', () => {
            spyOn(localStorage, 'getItem').and.returnValue(mockToken);
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Network error')));

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(false);
            });
        });

        it('should only access localStorage if on the browser platform', () => {
            const platformIdMock = 'browser'; 
            TestBed.overrideProvider(PLATFORM_ID, { useValue: platformIdMock });

            spyOn(localStorage, 'getItem').and.returnValue(mockToken);

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(true);
            });
        });

        it('should not access localStorage if not on the browser platform', () => {
            const platformIdMock = 'server';
            TestBed.overrideProvider(PLATFORM_ID, { useValue: platformIdMock });

            spyOn(localStorage, 'getItem');

            service.isAuthenticated().subscribe(isAuth => {
                expect(isAuth).toBe(false);
            });

            expect(localStorage.getItem).not.toHaveBeenCalled();
        });
    });
});
