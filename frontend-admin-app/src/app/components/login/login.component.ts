import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar) { }

	username: string = 'dxestion';
	password: string = 'Dxestion0180';
	credentials: Object;
	showSpinner: boolean;

	ngOnInit(): void {
		localStorage.clear();
	}

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			(res) => {
				if (res) {
					this.showSpinner = false;
					this.router.navigate(['/home']);
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
