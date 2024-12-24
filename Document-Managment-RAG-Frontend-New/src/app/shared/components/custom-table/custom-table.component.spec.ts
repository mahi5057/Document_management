import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTableComponent } from './custom-table.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

describe('CustomTableComponent', () => {
    let component: CustomTableComponent;
    let fixture: ComponentFixture<CustomTableComponent>;
    let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

    beforeEach(async () => {
        mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
        await TestBed.configureTestingModule({
            imports: [
                CustomTableComponent,
                DialogModule,
                ButtonModule,
                TableModule,
                ToastModule,
                ToolbarModule,
                FileUploadModule,
                InputTextModule,
                DropdownModule,
                RadioButtonModule,
                InputNumberModule,
                TagModule,
                RatingModule,
                ConfirmDialogModule,
            ],
            providers: [
                ConfirmationService,
                MessageService,
                { provide: ConfirmationService, useValue: mockConfirmationService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomTableComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.isChat).toBeFalse();
        expect(component.dialogVisible).toBeFalse();
        expect(component.selectedItems).toBeNull();
        expect(component.submitted).toBeFalse();
    });

    it('should set rolesOptions and isChat on initialization', () => {
        const mockConfig = { isChat: true };
        component.config = mockConfig;
        component.ngOnInit();

        expect(component.isChat).toBeTrue();
        expect(component.rolesOptions).toEqual(component.userConfig.rolesOptions);
    });

    it('should open the dialog and reset submitted flag', () => {
        component.openNew();
        expect(component.dialogVisible).toBeTrue();
        expect(component.submitted).toBeFalse();
    });

    it('should open the dialog and set the current item for editing', () => {
        const mockItem = { id: 1, name: 'Item 1' };
        component.editItem(mockItem);
        expect(component.dialogVisible).toBeTrue();
        expect(component.currentItem).toEqual(mockItem);
    });

    it('should emit the item for deletion', () => {
        const mockItem = { id: 1, name: 'Item 1' };
        spyOn(component.deleteItemEvent, 'emit');
        component.deleteItem(mockItem);
        expect(component.deleteItemEvent.emit).toHaveBeenCalledWith(mockItem);
    });

   it('should return the correct index for a given ID', () => {
        component.data = [{ id: '1' }, { id: '2' }, { id: '3' }];
        const index = component.findIndexById('2');
        expect(index).toBe(1);
    });

    it('should create a unique ID', () => {
        const id = component.createId();
        expect(id).toMatch(/^[A-Za-z0-9]{5}$/);
    });
});
