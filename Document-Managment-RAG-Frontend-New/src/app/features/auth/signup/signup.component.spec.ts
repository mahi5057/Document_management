import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { SignupComponent } from './signup.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    const userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    const apiEndpointsSpy = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);
    let apiEndpointsService: ApiEndpointsService;

    beforeEach(async () => {
        const messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
        await TestBed.configureTestingModule({
            imports: [SignupComponent, FormsModule, ReactiveFormsModule, CommonModule, FormComponent],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MessageService, useValue: messageServiceMock },
                { provide: ApiEndpointsService, useValue: apiEndpointsSpy },
                ApiEndpointsService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
        apiEndpointsService = TestBed.inject(ApiEndpointsService);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should show validation error if any field is missing', () => {
        component.onSubmit({ username: '', name: '', email: '', password: '' });
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'All fields are required.',
            life: 3000
        });
    });

    it('should call createUser on form submission with valid data', () => {
        const mockResponse = { success: true };
        userServiceSpy.createUser.and.returnValue(of(mockResponse));
        const formData = { username: 'testuser', name: 'Test User', email: 'test@example.com', password: 'password123' };
        const endpointUrl = apiEndpointsService.getEndpoint(apiEndpointsService.auth.signup);

        component.onSubmit(formData);

        expect(userServiceSpy.createUser).toHaveBeenCalledWith(endpointUrl, formData);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Successful',
            detail: 'User registered successfully!',
            life: 3000
        });
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show error message if registration fails', () => {
        const mockError = { error: { message: 'Registration failed' } };
        userServiceSpy.createUser.and.returnValue(throwError(() => mockError));
        const formData = { username: 'testuser', name: 'Test User', email: 'test@example.com', password: 'password123' };

        component.onSubmit(formData);

        expect(userServiceSpy.createUser).toHaveBeenCalled();
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Registration failed',
            life: 3000
        });
    });
});
