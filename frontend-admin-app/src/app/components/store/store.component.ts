import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../services/user.service';
import { ClientService } from '../../services/client.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

class ImageSnippet {
	pending: boolean = false;
	status: string = 'init';

	constructor(public src: string, public file: File) {}
}

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
		background_img: [],
		free_fields: [],
		selected_free_fields: '',
		gpdr_text: ''
	};
	userList: any;
	logo_imgURL: any;
	background_imgURL: any[];
	showSpinner: boolean;
	imagePath = AppComponent.BACKEND_URL + '/files/store/logo/';
	BGimagePath = AppComponent.BACKEND_URL + '/files/store/background/';
	noImage = './assets/no-image.jpg';
	message = '';
	clients = [];
	commerce_password = false;
	storeTypes = [ 'FrontRetail/Manager', 'FrontRest', 'Agora' ];
	signaturePath = AppComponent.BACKEND_URL + '/files/client/signature/';
	user_role = localStorage.getItem('role');
	freeFields = [];
	connectionError = null;

	selectedFiles: ImageSnippet[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private storeService: StoreService,
		private clientService: ClientService,
		private userService: UserService,
		private router: Router,
		private translate: TranslateService,
		private auth: AuthService
	) {}

	ngOnInit() {
		if (this.auth.isAdmin()) {
			this.userService.getUsers().subscribe((users: any) => {
				this.userList = users.users;
			});
		} else {
			this.userList = [];
		}
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.storeService.getStoreById(id).subscribe((response: any) => {
				this.store = response.store;
				this.freeFields = this.store.free_fields;
				this.background_imgURL = [ ...this.store.background_img ];
				this.clientService.getClients(this.store._id).subscribe((response_clients: any) => {
					this.clients = response_clients.clients;
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
		for (let i = 0; i < this.selectedFiles.length; i++) {
			if (!this.store.background_img[i]) {
				this.store.background_img[i] = this.selectedFiles[i].file;
			}
		}
		// return;
		this.showSpinner = true;
		if (!this.store.user) {
			Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
			return;
		}
		if (!this.store.store_type) {
			Swal.fire('Error', 'Debe seleccionar un tipo de tienda', 'error');
			return;
		}

		this.store.free_fields = this.freeFields.map((value: any) => {
			if (value && value.active) {
				return value;
			}
		});

		this.store.selected_free_fields = JSON.stringify(this.store.free_fields);

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

	selectLogoImage(event) {
		this.store.logo_img = event.target.files[0];
	}

	removeImage(type: number, index: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.store.logo_img = null;
		} else {
			this.onError(index);
		}
	}

	preview(type: number, files: any, index: number) {
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
		};
	}

	private onSuccess(index: number) {
		this.selectedFiles[index].pending = false;
		this.selectedFiles[index].status = 'ok';
	}

	private onError(index: number) {
		if (this.selectedFiles[index]) {
			this.selectedFiles[index].pending = false;
			this.selectedFiles[index].status = 'fail';
			this.selectedFiles[index].src = '';
		} else {
			this.store.background_img[index] = '';
			this.selectedFiles[index].src = '';
		}
	}

	processFile(imageInput: any, index: number) {
		const file: File = imageInput.files[0];
		const reader = new FileReader();

		reader.addEventListener('load', (event: any) => {
			this.selectedFiles[index] = new ImageSnippet(event.target.result, file);
			this.selectedFiles[index].pending = true;
		});

		reader.readAsDataURL(file);
		this.store.background_img[index] = null;
	}

	testConnection() {
		const data = {
			database_url: this.store.database_url,
			database_password: this.store.database_password,
			database_name: this.store.database_name,
			database_port: this.store.database_port,
			database_username: this.store.database_username
		};
		this.storeService.checkStoreConnection(data).subscribe((response: any) => {
			if (response.ok) {
				this.freeFields = response.free_fields.free_fields;
				Swal.fire('Exito', 'Conexión realizada', 'success').then(() => {
					this.connectionError = false;
				});
			} else {
				Swal.fire('Fallo', 'No es posible conectar con el servidor', 'error').then(() => {
					this.connectionError = true;
				});
			}
		});
	}
}
