import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectAuthGuard } from './core/guards/redirect-auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { DocQnaInterfaceComponent } from './features/doc-qna-interface/doc-qna-interface.component';
import { DocumentListComponent } from './features/document-management/document-list/document-list.component';
import { UploadDocumentComponent } from './features/document-management/upload-document/upload-document.component';
import { UserListComponent } from './features/user-management/user-list/user-list.component';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
    { path: 'login', component: LoginComponent, canActivate: [RedirectAuthGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [RedirectAuthGuard] },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'upload', component: UploadDocumentComponent },
            { path: 'documents', component: DocumentListComponent },
            { path: 'users', component: UserListComponent },
            { path: 'users', component: CustomTableComponent },
            { path: 'docQna/:url', component: DocQnaInterfaceComponent },
            { path: '', redirectTo: 'upload', pathMatch: 'full' }
        ],
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/login' } 
]