import { TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../../core/services/user.service';
import { NoDataComponent } from '../../../shared/components/no-data/no-data.component';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';
import { of } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let userServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.callFake(() => {}),
      deleteUser: jasmine.createSpy('deleteUser').and.callFake((id: string) => {}),
      deleteUsers: jasmine.createSpy('deleteUsers').and.callFake((ids: string[]) => {}),
      updateUser: jasmine.createSpy('updateUser').and.callFake((user: any) => {}),
      _allUsers: jasmine.createSpy('_allUsers').and.returnValue(of([{ id: '1', name: 'Test User' }]))
    };

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoDataComponent, CustomTableComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize entityType and fetch users on ngOnInit', () => {
    component.ngOnInit();
    expect(component.entityType).toBe(component.config.type);
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it('should delete a user when deleteUser is called', () => {
    const user = { id: '1', name: 'Test User' };
    component.deleteUser(user);
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(user.id);
  });

  it('should delete multiple users when deleteUsers is called', () => {
    const users = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ];
    component.deleteUsers(users);
    const userIds = users.map(user => user.id);
    expect(userServiceMock.deleteUsers).toHaveBeenCalledWith(userIds);
  });

  it('should update a user when updateUser is called', () => {
    const user = { id: '1', name: 'Updated User' };
    component.updateUser(user);
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(user);
  });
});
