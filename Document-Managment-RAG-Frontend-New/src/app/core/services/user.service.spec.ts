import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpService } from './http.service';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from './api-endpoints.service';
import { of, throwError } from 'rxjs';
import { User, UserModel, CurrentUser, LoginUser } from '../../models/user.model';
import { HttpHeaders } from '@angular/common/http';

describe('UserService', () => {
    let service: UserService;
    let httpServiceSpy: jasmine.SpyObj<HttpService>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    let apiEndpointsServiceSpy: jasmine.SpyObj<ApiEndpointsService>;

    beforeEach(() => {
        httpServiceSpy = jasmine.createSpyObj('HttpService', ['post', 'get', 'put', 'delete']);
        messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
        apiEndpointsServiceSpy = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);

        TestBed.configureTestingModule({
            providers: [
                UserService,
                { provide: HttpService, useValue: httpServiceSpy },
                { provide: MessageService, useValue: messageServiceSpy },
                { provide: ApiEndpointsService, useValue: apiEndpointsServiceSpy }
            ]
        });

        service = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createUser', () => {
        it('should create a user successfully', () => {
            const mockUser: User = { username: 'test', password: 'password', name: 'Test User', email: 'test@gmail.com' };
            const url = 'http://mock-api.com/createUser';
            httpServiceSpy.post.and.returnValue(of(mockUser));

            service.createUser(url, mockUser).subscribe(response => {
                expect(response).toEqual(mockUser);
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith(url, mockUser);
        });
    });

    describe('getUsers', () => {
        it('should fetch all users successfully', () => {
            const mockUsers: UserModel[] = [
                new UserModel('1', 'testuser1', 'Test User 1', 'test1@example.com', ['admin'], new Date('2024-01-01')),
                new UserModel('2', 'testuser2', 'Test User 2', 'test2@example.com', ['user'], new Date('2024-01-01'))
            ];
            const url = 'http://mock-api.com/getUsers';
            httpServiceSpy.get.and.returnValue(of(mockUsers));
            apiEndpointsServiceSpy.getEndpoint.and.returnValue(url);

            service.getUsers();

            expect(service._allUsers().length).toBe(2);
            expect(service._allUsers()[0].name).toBe('Test User 1');
        });

        it('should handle error while fetching users', () => {
            const url = 'http://mock-api.com/getUsers';
            httpServiceSpy.get.and.returnValue(throwError(() => new Error('Users fetch error')));
            apiEndpointsServiceSpy.getEndpoint.and.returnValue(url);

            service.getUsers();

            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Users fetch error',
                life: 3000
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', () => {
            const mockUserId = '1';
            const url = `http://mock-api.com/deleteUser/${mockUserId}`;
            httpServiceSpy.delete.and.returnValue(of([]));

            service.deleteUser(mockUserId);

            expect(httpServiceSpy.delete).toHaveBeenCalledWith(url);
            expect(service._allUsers().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Deleted',
                life: 3000
            });
        });

        it('should handle error while deleting a user', () => {
            const mockUserId = '1';
            const url = `http://mock-api.com/deleteUser/${mockUserId}`;
            httpServiceSpy.delete.and.returnValue(throwError(() => new Error('Delete user error')));

            service.deleteUser(mockUserId);

            expect(service._allUsers().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Delete user error',
                life: 3000
            });
        });
    });

    describe('deleteUsers', () => {
        it('should delete multiple users successfully', () => {
            const mockUserIds = ['1', '2'];
            const url = 'http://mock-api.com/deleteUsers';
            httpServiceSpy.post.and.returnValue(of([]));

            service.deleteUsers(mockUserIds);

            expect(httpServiceSpy.post).toHaveBeenCalledWith(url, mockUserIds, jasmine.any(HttpHeaders));
            expect(service._allUsers().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'success',
                summary: 'Successful',
                detail: 'Users Deleted',
                life: 3000
            });
        });

        it('should handle error while deleting multiple users', () => {
            const mockUserIds = ['1', '2'];
            const url = 'http://mock-api.com/deleteUsers';
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Delete users error')));

            service.deleteUsers(mockUserIds);

            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete Users',
                life: 3000
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', () => {
            const mockUser = new UserModel('1', 'testuser1', 'Test User 1', 'test1@example.com', ['admin'], new Date('2024-01-01'));
            const url = `http://mock-api.com/updateUser/${mockUser.id}`;
            httpServiceSpy.put.and.returnValue(of(mockUser));

            service.updateUser(mockUser);

            expect(httpServiceSpy.put).toHaveBeenCalledWith(url, mockUser, jasmine.any(HttpHeaders));
        });

        it('should handle error while updating a user', () => {
            const mockUser = new UserModel('1', 'testuser1', 'Test User 1', 'test1@example.com', ['admin'], new Date('2024-01-01'));
            const url = `http://mock-api.com/updateUser/${mockUser.id}`;
            httpServiceSpy.put.and.returnValue(throwError(() => new Error('Update user error')));

            service.updateUser(mockUser);

            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Update user error',
                life: 3000
            });
        });
    });

    describe('logout', () => {
        it('should log out the user and clear current user', () => {
            localStorage.setItem('accessToken', 'mock-token');
            service.logout();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(service._currentUser()).toBeNull();
        });
    });
});
