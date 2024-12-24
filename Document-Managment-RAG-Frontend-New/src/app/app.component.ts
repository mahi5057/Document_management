import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './core/services/socket.service';
import { SignupComponent } from './features/auth/signup/signup.component';
import { SocketModule } from './module/scoket.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpReqInterceptor } from './core/interceptors/http.interceptor';
import { UserService } from './core/services/user.service';
import { ApiEndpointsService } from './core/services/api-endpoints.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SocketModule,
    SignupComponent,
    ToastModule
  ],
  providers: [
    SocketService,
    MessageService,
    UserService,
    MessageService,
    ApiEndpointsService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpReqInterceptor, multi: true }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'document-management-ui';
}
