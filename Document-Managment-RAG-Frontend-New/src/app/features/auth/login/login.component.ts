import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { LoginForm } from '../../../interfaces/login-form.interface';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormComponent, ProgressSpinnerModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private apiEndpoints: ApiEndpointsService
  ) { }

  onSubmit(formData: LoginForm): void {
    if (!formData.email || !formData.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Email and Password are required.',
        life: 3000
      });
      return;
    }

    this.loading = true;

    const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.auth.login);
    this.userService.loginUser(url, formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errMsg: string = err?.error?.message || "Internal server error. Please try again later.";
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errMsg, life: 3000 });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
