import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { Subject } from 'rxjs';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let routerEventsSubject: Subject<any>;

    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['_currentUser', 'logout']);
        routerEventsSubject = new Subject<any>();
        routerSpy = jasmine.createSpyObj('Router', ['navigate'], { events: routerEventsSubject.asObservable() });

        await TestBed.configureTestingModule({
            imports: [SidebarComponent, CommonModule, SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user details on effect', () => {
        const mockUser = { username: 'johndoe', name: 'John Doe', roles: ['admin'] };
        userServiceSpy._currentUser.and.returnValue(mockUser);

        fixture.detectChanges();

        expect(component.name).toBe('John Doe');
        expect(component.roles).toEqual(['admin']);
    });

    it('should set active button based on navigation', () => {
        const mockEvent = new NavigationEnd(1, '/upload', '/upload');
        routerEventsSubject.next(mockEvent);

        fixture.detectChanges();

        expect(component.activeButton).toBe('upload');
    });

    it('should call logout on userService when logout is called', () => {
        component.logout();
        expect(userServiceSpy.logout).toHaveBeenCalled();
    });

    it('should determine button visibility based on roles', () => {
        component.roles = ['admin'];
        const button = { roles: ['admin', 'user'] };

        expect(component.isButtonVisible(button)).toBeTrue();

        const buttonWithoutRoles = {};
        expect(component.isButtonVisible(buttonWithoutRoles)).toBeTrue();

        component.roles = ['guest'];
        expect(component.isButtonVisible(button)).toBeFalse();
    });
});
