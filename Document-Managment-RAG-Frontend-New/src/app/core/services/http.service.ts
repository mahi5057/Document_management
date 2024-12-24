import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) { }

    private getDefaultHeaders(headers?: HttpHeaders): HttpHeaders {
        const defaultHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        });

        return headers ? defaultHeaders.set('Custom-Header', headers.get('Custom-Header') || '') : defaultHeaders;
    }

    get<T>(url: string, params?: HttpParams): Observable<T> {
        const headers = this.getDefaultHeaders();
        return this.http.get<T>(url, { headers, params });
    }

    post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
        const defaultHeaders = this.getDefaultHeaders(headers);
        return this.http.post<T>(url, body, { headers: defaultHeaders });
    }

    put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
        const defaultHeaders = this.getDefaultHeaders(headers);
        return this.http.put<T>(url, body, { headers: defaultHeaders });
    }

    delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
        const defaultHeaders = this.getDefaultHeaders(headers);
        return this.http.delete<T>(url, { headers: defaultHeaders });
    }

    patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
        const defaultHeaders = this.getDefaultHeaders(headers);
        return this.http.patch<T>(url, body, { headers: defaultHeaders });
    }
}
