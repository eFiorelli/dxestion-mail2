import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

const APP_ROUTES: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [ AuthGuardService ] },
    { path: 'products', component: ProductsComponent, canActivate: [ AuthGuardService ] },
    { path: 'users', component: UsersComponent, canActivate: [ AuthGuardService ] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [ AuthGuardService ] },
	{ path: '**', pathMatch: 'full', redirectTo: 'login'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });