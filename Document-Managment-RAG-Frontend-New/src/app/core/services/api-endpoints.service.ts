import { Injectable } from '@angular/core';
import { environment } from '../../metadata/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiEndpointsService {
    private readonly baseUrl: string = environment.apiBaseUrl || '';
    private readonly socketUrl: string = environment.socketUrl || '';
    private readonly endpoints = environment.endpoints;

    constructor() {
        if (!this.baseUrl) {
            console.warn('API base URL is not defined in the environment configuration.');
        }
        if (!this.socketUrl) {
            console.warn('Socket URL is not defined in the environment configuration.');
        }
    }

    /**
     * Constructs the full API endpoint for a given path.
     * @param path - Relative API path.
     * @returns Full API URL.
     */
    getEndpoint(path: string): string {
        if (!path) {
            console.error('Attempted to generate an API endpoint with an empty path.');
            return '';
        }
        return `${this.baseUrl}${path}`;
    }

    /**
     * Constructs the full WebSocket endpoint for a given path.
     * @param path - Relative WebSocket path.
     * @returns Full WebSocket URL.
     */
    getSocketEndpoint(path: string): string {
        if (!path) {
            console.error('Attempted to generate a socket endpoint with an empty path.');
            return '';
        }
        return `${this.socketUrl}${path}`;
    }

    get user(): any {
        return this.endpoints?.user || '';
    }

    get auth(): any {
        return this.endpoints?.auth || '';
    }

    get document(): any {
        return this.endpoints?.document || '';
    }

    get upload(): any {
        return this.endpoints?.upload || '';
    }
}
