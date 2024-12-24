import { TestBed } from '@angular/core/testing';
import { ApiEndpointsService } from './api-endpoints.service';
import { environment } from '../../metadata/environment';

describe('ApiEndpointsService', () => {
    let service: ApiEndpointsService;

    const mockEnvironment = {
        apiBaseUrl: 'https://api.example.com/',
        socketUrl: 'wss://socket.example.com/',
        endpoints: {
            user: {
                base: '/user',
                profile: '/user/profile',
                delete: '/user/delete',
            },
            auth: {
                login: '/auth/login',
                signup: '/auth/signup',
                validateToken: '/auth/validateToken',
            },
            document: {
                base: '/document',
                delete: '/document/delete',
            },
            upload: {
                base: '/upload',
            },
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ApiEndpointsService],
        });
        environment.apiBaseUrl = mockEnvironment.apiBaseUrl;
        environment.socketUrl = mockEnvironment.socketUrl;
        environment.endpoints = mockEnvironment.endpoints;

        service = TestBed.inject(ApiEndpointsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the correct API endpoint', () => {
        const path = 'test-endpoint';
        const result = service.getEndpoint(path);
        expect(result).toBe('https://api.example.com/test-endpoint');
    });

    it('should return an empty string if API endpoint path is empty', () => {
        const result = service.getEndpoint('');
        expect(result).toBe('');
    });

    it('should return the correct WebSocket endpoint', () => {
        const path = 'test-socket';
        const result = service.getSocketEndpoint(path);
        expect(result).toBe('wss://socket.example.com/test-socket');
    });

    it('should return an empty string if WebSocket endpoint path is empty', () => {
        const result = service.getSocketEndpoint('');
        expect(result).toBe('');
    });

    it('should return the correct user endpoint', () => {
        expect(service.user).toBe(mockEnvironment.endpoints.user);
    });

    it('should return the correct auth endpoint', () => {
        expect(service.auth).toBe(mockEnvironment.endpoints.auth);
    });

    it('should return the correct document endpoint', () => {
        expect(service.document).toBe(mockEnvironment.endpoints.document);
    });

    it('should return the correct upload endpoint', () => {
        expect(service.upload).toBe(mockEnvironment.endpoints.upload);
    });

    it('should warn if API base URL is not defined', () => {
        spyOn(console, 'warn');
        environment.apiBaseUrl = '';
        new ApiEndpointsService();
        expect(console.warn).toHaveBeenCalledWith('API base URL is not defined in the environment configuration.');
    });

    it('should warn if Socket URL is not defined', () => {
        spyOn(console, 'warn');
        environment.socketUrl = '';
        new ApiEndpointsService();
        expect(console.warn).toHaveBeenCalledWith('Socket URL is not defined in the environment configuration.');
    });
});
