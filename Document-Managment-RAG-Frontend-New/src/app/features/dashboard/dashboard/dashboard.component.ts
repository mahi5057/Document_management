import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private apiEndpoints: ApiEndpointsService
  ) { }

  ngOnInit(): void {
    const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.user.profile);
    this.userService.getProfile(url);
  }
}
