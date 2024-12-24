import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { SidebarModule, Sidebar } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { filter } from 'rxjs';
import { SIDEBAR_CONFIG } from '../../../metadata/entity-config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, RouterModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = false;
  activeButton: string = 'upload';
  name: string = '';
  roles!: string[] | undefined;
  sidebarConfig = SIDEBAR_CONFIG;

  constructor(private userService: UserService, private router: Router) {
    effect(() => {
      const currentUser = this.userService._currentUser();
      this.name = currentUser?.name || '';
      this.roles = currentUser?.roles;
    });

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.sidebarConfig.buttons.forEach((button:any) => {
        if (event.url.includes(button.key)) {
          this.setActive(button.key);
        }
      });
    });
  }

  ngOnInit(): void {
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  setActive(button: string): void {
    this.activeButton = button;
  }

  logout() {
    this.userService.logout();
  }

  isButtonVisible(button: { roles?: string[] }): boolean | undefined{
    return !button.roles || this.roles?.some(role => button?.roles?.includes(role));
  }
}
