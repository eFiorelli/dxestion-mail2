import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
// import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { AppComponent } from '../../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-stores',
	templateUrl: './stores.component.html',
	styleUrls: [ './stores.component.css' ]
})
export class StoresComponent implements OnInit {
	username = Math.random().toString(36).substring(2, 15);

	newStore: any = {
		username: this.username,
		password: '1234',
		name: this.username,
		email: `${this.username}@${this.username}.com`,
		database_url: '192.168.0.2',
		database_name: 'BD1',
		database_port: '1443',
		database_username: 'sa',
		database_password: 'masterkey',
		background_img: '',
		logo_img: '',
		store_type: '',
		commerce_password: '',
		user: ''
	};

	userList: any[];
	storeList: any[];
	stores: any[];

	imagePath = AppComponent.BACKEND_URL + '/files/logo/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	storesListFiltered: any[];
	selectedTab;
	showSpinner = false;
	currentUser = null;
	background_imgURL: any;
	logo_imgURL: any;
	message: any;
	commerce_password: boolean = false;
	storeTypes = [ 'FrontRetail/Manager', 'FrontRest', 'Agora' ];

	constructor(
		public auth: AuthService,
		private storeService: StoreService,
		private userService: UserService,
		// public filterUsersPipe: FilterUsersPipe,
		private router: Router,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			this.currentUser = params.id;
			this.getStores();
		});
		if (this.auth.isAdmin()) {
			this.userService.getUsers().subscribe((response: any) => {
				this.userList = response.users;
			});
		}
	}

	searchStores(text?: string) {
		/* Search filter */
		// if (text !== '' && text !== undefined && text !== null) {
		// 	this.storeList = this.stores;
		// 	this.searchText = text;
		// 	this.storesListFiltered = this.filterUsersPipe.transform(this.storeList, this.searchText);
		// 	this.storeList = this.storesListFiltered;
		// } else {
		// 	this.searchText = '';
		// 	this.storeList = this.stores;
		// }
		// if (!this.storesListFiltered) {
		// 	return;
		// }
	}

	getStores() {
		if (this.currentUser) {
			this.storeService.getUserStores(this.currentUser).subscribe((response: any) => {
				this.storeList = response.stores;
			});
		} else {
			this.storeService.getStores().subscribe((response: any) => {
				this.storeList = response.stores;
			});
		}
	}

	registerStore() {
		this.showSpinner = true;
		if (!this.newStore.user) {
			Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
			return;
		}
		if (!this.newStore.store_type) {
			Swal.fire('Error', 'Debe seleccionar un tipo de tienda', 'error');
			return;
		}

		this.storeService
			.registerStore(this.newStore)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = 'Store created successfully';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.ngOnInit();
					this.selectedTab = 0;
				});
			})
			.catch((error: any) => {
				this.showSpinner = false;
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', error_text, 'error');
			});
	}

	goToStore(store: any) {
		this.router.navigate([ '/store', store._id ]);
	}

	selectBGImage(event) {
		this.newStore.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.newStore.logo_img = event.target.files[0];
	}

	removeImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.newStore.logo_img = null;
		}

		if (type === 1) {
			this.background_imgURL = null;
			this.newStore.background_img = null;
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
