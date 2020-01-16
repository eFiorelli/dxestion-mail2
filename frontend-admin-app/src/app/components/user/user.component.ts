import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StoreService } from 'src/app/services/store.service';
import { AppComponent } from '../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: [ './user.component.css' ]
})
export class UserComponent implements OnInit {
	constructor(
		private userService: UserService,
		private storeService: StoreService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	user: any;
	public imagePath;
	background_imgURL: any;
	backendImgUrl = AppComponent.BACKEND_URL + '/files/user/';
	logo_imgURL: any;
	public message: string;
	showSpinner = false;
	noImage = 'assets/no-image.png';
	oldPassword = '';

	preview(files: any) {
		if (files.length === 0) {
			return;
		}

		const mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = 'Only images are supported.';
			return;
		}

		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.logo_imgURL = reader.result;
		};
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.userService.getUserById(id).subscribe((user: any) => {
				if (user.ok) {
					this.user = user.user;
					if (!this.user.emailConfig) {
						this.user.emailConfig = {
							smtp: '',
							port: '',
							emailAccount: '',
							emailPassword: ''
						};
					}
					// this.user.emailConfig = JSON.parse(this.user.emailConfig);
				} else {
					alert('Error');
				}
			});
		});
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}

	removeImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.user.logo_img = null;
		}
	}

	updateUser() {
		this.user.emailConfig = JSON.stringify(this.user.emailConfig);
		this.userService
			.updateUser(this.user)
			.then((response: any) => {
				const success_text = 'Usuario modificado con éxito';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.router.navigate([ '/users' ]);
				});
			})
			.catch((error: any) => {
				console.log(error);
				const error_text = 'Ocurrió un problema al modificar el usuario';
				Swal.fire('Error', error_text, 'error').then(() => {
					this.router.navigate([ '/users' ]);
				});
			});
	}

	cancel() {}
}
