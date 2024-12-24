import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';
import { UserService } from '../../../core/services/user.service';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile']);
  const apiEndpointsSpy = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);
  let apiEndpointsService: ApiEndpointsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, SidebarComponent, RouterOutlet],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ApiEndpointsService, useValue: apiEndpointsSpy },
        ApiEndpointsService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    apiEndpointsService = TestBed.inject(ApiEndpointsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
