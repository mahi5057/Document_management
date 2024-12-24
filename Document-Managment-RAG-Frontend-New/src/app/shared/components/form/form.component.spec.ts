import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { formConfig } from '../../../metadata/form-config';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent, FormsModule, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with fields based on formType', () => {
    const mockFormType = 'signup';
    const mockConfig = {
      title: 'Sign Up',
      fields: [
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true },
        { name: 'email', type: 'email', label: 'Email', required: false },
      ],
    };
    formConfig[mockFormType] = mockConfig;

    component.formType = mockFormType;
    component.ngOnInit();

    expect(component.config).toEqual(mockConfig);
    expect(component.form.contains('username')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
  });

  it('should log an error if form configuration is not found', () => {
    spyOn(console, 'error');
    component.formType = 'unknown' as any; 
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      `Form configuration for type 'unknown' not found.`
    );
  });

  it('should emit form data when form is valid and submitted', () => {
    const mockFormType = 'login';
    const mockConfig = {
      title: 'Login',
      fields: [
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true },
      ],
    };
    formConfig[mockFormType] = mockConfig;

    component.formType = mockFormType;
    component.ngOnInit();

    spyOn(component.submitForm, 'emit');

    component.form.setValue({
      username: 'testuser',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.submitForm.emit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should not emit form data if the form is invalid', () => {
    const mockFormType = 'login';
    const mockConfig = {
      title: 'Login',
      fields: [
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true },
      ],
    };
    formConfig[mockFormType] = mockConfig;

    component.formType = mockFormType;
    component.ngOnInit();

    spyOn(component.submitForm, 'emit');

    component.form.setValue({
      username: 'testuser',
      password: '',
    });

    component.onSubmit();

    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });
});
