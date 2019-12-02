import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
// import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';

@Component({
	selector: 'app-stores',
	templateUrl: './stores.component.html',
	styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
	store: any = {
		username: 'ccc',
		password: 'ccc',
		name: 'ccc',
		email: 'ccc@ccc.com',
		database_url: '192.168.0.2',
		database_name: 'BD2',
		database_port: '1443',
		database_username: 'sa',
		database_password: 'masterkey',
		background_img: '',
		logo_img: '',
		user: {}
	};

	storeList: any[];
	stores: any[];
	imagePath = AppComponent.BACKEND_URL + '/files/logo/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	storesListFiltered: any[];

	showSpinner: boolean = false;

	constructor(
		private auth: AuthService,
		private storeService: StoreService,
		// public filterUsersPipe: FilterUsersPipe,
		public dialog: MatDialog,
		private router: Router
	) { }

	ngOnInit() {
		this.getStores();
	}

	showDialog(result, message?) {
		const dialogRef = this.dialog.open(DialogComponent, {
			width: '400px',
			data: {
				action: 'Register ',
				message: message,
				result: result
			}
		});
		this.showSpinner = false;
		// this.user = {};
		// this.router.navigate(["/login"]);
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
		this.storeService.getStores(localStorage.getItem('userID')).subscribe((response: any) => {
			console.log(response)
			this.storeList = response.stores;
		});
	}

	registerStore() {
		this.store.user = localStorage.getItem('userID');

		if (this.storeService.registerStore(this.store)) {
			this.showDialog(true, 'Success store');
		} else {
			this.showDialog(false, 'Error store');
		}
	}
}
