import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

describe('HttpService', () => {
    let service: HttpService;
    let httpMock: HttpTestingController;

    const mockUrl = 'https://api.example.com';
    const mockBody = { key: 'value' };
    const mockResponse = { data: 'some data' };
    const mockToken = 'mock-token';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpService]
        });

        service = TestBed.inject(HttpService);
        httpMock = TestBed.inject(HttpTestingController);
        spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('GET method', () => {
        it('should call GET request with correct URL and headers', () => {
            service.get(mockUrl).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('GET');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockResponse);
        });

        it('should pass query parameters correctly', () => {
            const params = new HttpParams().set('param1', 'value1');
            service.get(mockUrl, params).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(req => req.url === mockUrl && req.params.has('param1'));
            expect(req.request.method).toBe('GET');
            expect(req.request.params.get('param1')).toBe('value1');
            req.flush(mockResponse);
        });
    });

    describe('POST method', () => {
        it('should call POST request with correct URL, body, and headers', () => {
            service.post(mockUrl, mockBody).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockBody);
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockResponse);
        });

        it('should include custom headers if provided', () => {
            const customHeaders = new HttpHeaders().set('Custom-Header', 'custom-value');
            service.post(mockUrl, mockBody, customHeaders).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.headers.get('Custom-Header')).toBe('custom-value');
            req.flush(mockResponse);
        });
    });

    describe('PUT method', () => {
        it('should call PUT request with correct URL, body, and headers', () => {
            service.put(mockUrl, mockBody).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(mockBody);
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockResponse);
        });
    });

    describe('DELETE method', () => {
        it('should call DELETE request with correct URL and headers', () => {
            service.delete(mockUrl).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('DELETE');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockResponse);
        });
    });

    describe('PATCH method', () => {
        it('should call PATCH request with correct URL, body, and headers', () => {
            service.patch(mockUrl, mockBody).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(mockUrl);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual(mockBody);
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            req.flush(mockResponse);
        });
    });
});
