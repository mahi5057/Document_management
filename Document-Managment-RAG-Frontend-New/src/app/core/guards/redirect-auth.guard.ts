import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class RedirectAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated().pipe(
            map((isAuthenticated: boolean) => {
                if (isAuthenticated) {
                    this.router.navigate(['/dashboard']);
                    return false;
                }
                return true;
            }),
            catchError((error) => {
                console.error('Error checking authentication status:', error);
                return [true];
            })
        );
    }
}
