import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

// tslint:disable: indent
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	constructor(
		private auth: AuthService,
		private router: Router,
		@Inject(DOCUMENT) private document: any
	) {}

	username = 'igavd24chk';
	password = '1234';
	credentials: Object;
	showSpinner: boolean;
	elem;

	ngOnInit() {
		localStorage.clear();
		this.elem = document.documentElement;
		setTimeout(() => {
			this.fullScreen();
		}, 150);
	}

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			res => {
				if (res) {
					this.showSpinner = false;
					this.fullScreen();
					this.router.navigate(['/home']);
				}
			},
			error => {
				Swal.fire('Login incorrecto', error, 'error');
				this.showSpinner = false;
			}
		);
	}

	fullScreen() {
		if (this.elem.requestFullscreen) {
			this.elem.requestFullscreen();
		} else if (this.elem.mozRequestFullScreen) {
			/* Firefox */
			this.elem.mozRequestFullScreen();
		} else if (this.elem.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			this.elem.webkitRequestFullscreen();
		} else if (this.elem.msRequestFullscreen) {
			/* IE/Edge */
			this.elem.msRequestFullscreen();
		}
	}
}
