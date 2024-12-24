import { EntityConfig } from "../interfaces/entity.interface";
import { SidebarConfig } from "../interfaces/sidebar.interface";

export const DOC_CONFIGS: EntityConfig = {
    type: 'documents',
    isChat: true,
    fields: [
        { key: 'fileName', label: 'Title' },
        { key: 'author', label: 'Author', allowToUpdate: false },
        { key: 'fileType', label: 'Content Type', allowToUpdate: false },
        { key: 'createdAt', label: 'Created At', allowToUpdate: false },
    ],
}

export const SIDEBAR_CONFIG: SidebarConfig = {
    buttons: [
        { key: 'upload', label: 'Upload / Import', icon: 'pi pi-plus-circle', route: '/dashboard/upload' },
        { key: 'documents', label: 'Documents', icon: 'pi pi-book', route: '/dashboard/documents' },
        { key: 'users', label: 'Users', icon: 'pi pi-chart-bar', route: '/dashboard/users', roles: ['admin'] },
    ],
};

export const USER_CONFIGS: EntityConfig = {
    type: 'users',
    rolesOptions: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' }
    ],
    fields: [
        { key: 'username', label: 'Username' },
        { key: 'name', label: 'Name' },
        { key: 'roles', label: 'Roles', allowToUpdate: true },
        { key: 'createdAt', label: 'Created At', allowToUpdate: false },
    ],
}

