import { Injectable, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { CurrentUser, LoginUser, User, UserModel } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from './api-endpoints.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public _currentUser = signal<CurrentUser | null>(null);
    public _allUsers = signal<UserModel[]>([]);

    constructor(
        private httpService: HttpService,
        private messageService: MessageService,
        private apiEndpoints: ApiEndpointsService
    ) { }

    createUser(url: string, user: User): Observable<User> {
        return this.httpService.post<User>(url, user);
    }

    getProfile(url: string): void {
        this.httpService.get<User>(url).subscribe({
            next: (res: any) => {
                this._currentUser.set({
                    name: res.name,
                    roles: res.roles
                } as CurrentUser);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    getUsers(): void {
        const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.user.base);
        this.httpService.get<UserModel[]>(url).subscribe({
            next: (res: UserModel[]) => {
                const users = res.map((user: any) => new UserModel(
                    user._id,
                    user.username,
                    user.name,
                    user.email,
                    user.roles,
                    user.createdAt
                ));
                this._allUsers.set(users);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
            }
        });
    }

    loginUser(url: string, user: LoginUser): Observable<User> {
        return this.httpService.post<User>(url, user);
    }

    deleteUser(userId: string) {
        const url = `${this.apiEndpoints.getEndpoint(this.apiEndpoints.user.base)}/${userId}`;
        this.httpService.delete<UserModel[]>(url).subscribe({
            next: (res: any) => {
                this._allUsers.set(this._allUsers().filter(user => user.id !== userId));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
            }
        });
    }


    deleteUsers(userIds: string[]) {
        const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.user.delete);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.httpService.post(url, userIds, headers).subscribe({
            next: () => {
                this._allUsers.set(this._allUsers().filter((user: any) => !userIds.includes(user.id)));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Users', life: 3000 });
            }
        });
    }

    updateUser(item: UserModel) {
        const url = `${this.apiEndpoints.getEndpoint(this.apiEndpoints.user.base)}/${item.id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.httpService.put(url, item, headers).subscribe({
            next: (res: any) => {
                console.log(res);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
            }
        });
    }

    logout(): void {
        localStorage.removeItem('accessToken');
        this._currentUser.set(null);
        console.log('User logged out successfully');
    }
}
