import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/* HTTP and Routes */
import { RouterModule } from "@angular/router";

import { APP_ROUTING } from "./app.routes";

/* Translations */
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

/* HTTP Interceptors */
import {
	HTTP_INTERCEPTORS,
	HttpClientModule,
	HttpClient
} from "@angular/common/http";
import { TokenInterceptor } from "./services/token-interceptor";

/* Auth & guards services */
import { AuthService } from "./services/auth.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { AdminGuardService } from "./services/admin-guard.service";

/* Components */
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RegisterComponent } from "./components/register/register.component";
import { UsersComponent } from "./components/users/users.component";
import { DialogComponent } from "./components/dialog/dialog.component";

import { FilterUsersPipe } from "./pipes/filter-users.pipe";

/* Angular material modules */
import {
	MatInputModule,
	MatButtonModule,
	MatCheckboxModule,
	MatToolbarModule,
	MatSnackBarModule,
	MatProgressSpinnerModule,
	MatFormFieldModule,
	MatCardModule,
	MatDialogModule
} from "@angular/material";
import { UserComponent } from "./components/user/user.component";
import { StoresComponent } from "./components/stores/stores.component";
import { StoreComponent } from "./components/store/store.component";
import { ProfileComponent } from "./components/profile/profile.component";

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		LoginComponent,
		NavbarComponent,
		RegisterComponent,
		UsersComponent,
		DialogComponent,
		FilterUsersPipe,
		UserComponent,
		StoresComponent,
		StoreComponent,
		ProfileComponent
	],
	imports: [
		RouterModule,
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		APP_ROUTING,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSnackBarModule,
		MatDialogModule,
		MatButtonModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatCardModule,
		MatFormFieldModule,
		MatProgressSpinnerModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => {
					return new TranslateHttpLoader(http);
				},
				deps: [HttpClient]
			}
		})
	],
	entryComponents: [DialogComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
