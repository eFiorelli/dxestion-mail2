import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../services/user.service';
import { ClientService } from '../../services/client.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: [ './store.component.css' ]
})
export class StoreComponent implements OnInit {
	store = {
		_id: '',
		username: '',
		password: '',
		name: '',
		email: '',
		database_url: '',
		database_password: '',
		database_name: '',
		database_port: '',
		database_username: '',
		user: '',
		store_type: '',
		commerce_password: '',
		logo_img: '',
		background_img: ''
	};
	userList: any;
	logo_imgURL: any;
	background_imgURL: any;
	showSpinner: boolean;
	imagePath = AppComponent.BACKEND_URL + '/files/logo/';
	clientImagePath = AppComponent.BACKEND_URL + '/files/client/signature/';
	noImage = './assets/no-image.jpg';
	message = '';
	clients = [];
	commerce_password: boolean = false;
	storeTypes = [ 'FrontRetail/Manager', 'FrontRest', 'Agora' ];
	signaturePath = AppComponent.BACKEND_URL + '/files/client/signature/';

	constructor(
		private activatedRoute: ActivatedRoute,
		private storeService: StoreService,
		private clientService: ClientService,
		private userService: UserService,
		private router: Router,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.userService.getUsers().subscribe((users: any) => {
			this.userList = users.users;
		});
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.storeService.getStoreById(id).subscribe((response: any) => {
				this.store = response.store;
				this.clientService.getClients(this.store._id).subscribe((response: any) => {
					this.clients = response.clients;
				});
			});
		});
	}

	clientDetail(client) {
		Swal.fire({
			title: client.name,
			text: client.phone + '  -  ' + client.email,
			imageUrl: this.signaturePath + client.signature,
			imageWidth: 400,
			imageHeight: 200,
			imageAlt: client.name,
			customClass: {
				image: 'custom-swal2-image'
			}
		});
	}

	updateStore() {
		this.showSpinner = true;
		if (!this.store.user) {
			Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
			return;
		}
		if (!this.store.store_type) {
			Swal.fire('Error', 'Debe seleccionar un tipo de tienda', 'error');
			return;
		}

		this.storeService
			.updateStore(this.store, this.store._id)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = 'Store created successfully';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.router.navigate([ '/stores' ]);
				});
			})
			.catch((error: any) => {
				this.showSpinner = false;
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', error_text, 'error').then(() => {
					this.router.navigate([ '/stores' ]);
				});
			});
	}

	selectBGImage(event) {
		this.store.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.store.logo_img = event.target.files[0];
	}

	removeImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.store.logo_img = null;
		}

		if (type === 1) {
			this.background_imgURL = null;
			this.store.background_img = null;
		}
	}

	preview(type: number, files: any) {
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
			if (type === 0) {
				this.logo_imgURL = reader.result;
			}
			if (type === 1) {
				this.background_imgURL = reader.result;
			}
		};
	}
}
