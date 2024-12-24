import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { LoginComponent } from './login.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  const apiEndpointsSpy = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);
  let apiEndpointsService: ApiEndpointsService;

  beforeEach(async () => {
    const messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormComponent, ProgressSpinnerModule, CommonModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: ApiEndpointsService, useValue: apiEndpointsSpy },
        ApiEndpointsService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    apiEndpointsService = TestBed.inject(ApiEndpointsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error if email or password is missing', () => {
    component.onSubmit({ email: '', password: '' });
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Email and Password are required.',
      life: 3000
    });
  });

  it('should call loginUser on form submission with valid data', () => {
    const mockResponse = { access_token: 'mockToken' };
    userServiceSpy.loginUser.and.returnValue(of(mockResponse));
    const formData = { email: 'test@example.com', password: 'password123' };
    const endpointUrl = apiEndpointsService.getEndpoint(apiEndpointsService.auth.login);

    component.onSubmit(formData);

    expect(userServiceSpy.loginUser).toHaveBeenCalledWith(endpointUrl, formData);
    expect(localStorage.getItem('accessToken')).toBe('mockToken');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message if login fails', () => {
    const mockError = { error: { message: 'Invalid credentials' } };
    userServiceSpy.loginUser.and.returnValue(throwError(() => mockError));
    const formData = { email: 'test@example.com', password: 'password123' };

    component.onSubmit(formData);

    expect(userServiceSpy.loginUser).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid credentials',
      life: 3000,
    });
    expect(component.loading).toBeFalse();
  });

  it('should stop loading spinner when request fails', () => {
    const mockError = { error: { message: 'Invalid credentials' } };
    userServiceSpy.loginUser.and.returnValue(throwError(() => mockError));
    const formData = { email: 'test@example.com', password: 'password123' };
    component.onSubmit(formData);
    expect(component.loading).toBeFalse();
  });
});
