import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	user: any = {
		username: 'ddd',
		password: 'ddd',
		name: 'ddd',
		email: 'ddd@ddd.com',
		logo_img: ''
	};

	showSpinner = false;

	constructor(private userService: UserService, private router: Router, private translate: TranslateService) { }

	ngOnInit() { }

	/*
	import Swal from 'sweetalert2';
	import { TranslateService } from '@ngx-translate/core';
	private translate: TranslateService
	const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.error.type}`);
	Swal.fire('Error', error_text, 'error').then(() => {
		this.showSpinner = false;
	});

	*/

	registerUser() {
		this.showSpinner = true;
		this.userService.registerUser(this.user).then((response: any) => {
			this.showSpinner = false;
			const success_text = this.translate.instant('SUCCESS.REGISTER_USER');
			Swal.fire('Error', success_text, 'success').then(() => {
				this.router.navigate(['/home']);
			});
		}).catch((error) => {
			this.showSpinner = false;
			const success_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
			Swal.fire('Exito', success_text, 'error');
		});
	}

	selectBGImage(event) {
		this.user.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}
}
