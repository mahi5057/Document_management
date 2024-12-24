import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { FormComponent } from '../../../shared/components/form/form.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private apiEndpoints: ApiEndpointsService
  ) { }

  onSubmit(formData: any): void {
    if (!formData.username || !formData.name || !formData.email || !formData.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'All fields are required.',
        life: 3000
      });
      return;
    }

    const newUser: User = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.auth.signup);
    this.userService.createUser(url, newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User registered successfully!',
          life: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const errMsg: string = err?.error?.message || 'Failed to register user. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errMsg,
          life: 3000
        });
      }
    });
  }
}
