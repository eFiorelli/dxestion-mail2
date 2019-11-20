import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent {
	constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar) {}

	username: string = '';
	password: string = '';
	credentials: Object;
	showSpinner: boolean;

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			(res) => {
				if (res) {
					this.showSpinner = false;
					this.router.navigate([ '/home' ]);
				}
			},
			(error) => {
				this.snackBar.open('Incorrect login', 'dismiss', {
					duration: 3000
				});
				this.showSpinner = false;
			}
		);
	}
}
