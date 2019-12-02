import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
// import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { AppComponent } from "../../app.component";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { StoreService } from "../../services/store.service";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "app-stores",
	templateUrl: "./stores.component.html",
	styleUrls: ["./stores.component.css"]
})
export class StoresComponent implements OnInit {
	username = Math.random()
		.toString(36)
		.substring(2, 15);

	newStore: any = {
		username: this.username,
		password: "1234",
		name: this.username,
		email: `${this.username}@${this.username}.com`,
		database_url: "192.168.0.2",
		database_name: "BD2",
		database_port: "1443",
		database_username: "sa",
		database_password: "masterkey",
		background_img: "",
		logo_img: "",
		user: {}
	};

	userList: any[];
	storeList: any[];
	stores: any[];
	imagePath = AppComponent.BACKEND_URL + "/files/logo/";
	noImage = "./assets/no-image.jpg";
	searchText = "";
	storesListFiltered: any[];
	selectedTab;
	showSpinner = false;

	constructor(
		public auth: AuthService,
		private storeService: StoreService,
		private userService: UserService,
		// public filterUsersPipe: FilterUsersPipe,
		private router: Router,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.getStores();
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
		this.storeService
			.getStores(localStorage.getItem("userID"))
			.subscribe((response: any) => {
				console.log(response);
				this.storeList = response.stores;
			});
	}

	registerStore() {
		this.showSpinner = true;
		const username = Math.random()
			.toString(36)
			.substring(2, 15);
		const randomStore = {
			username: username,
			password: "1234",
			name: username,
			email: `${username}@${username}.com`,
			database_url: "192.168.0.2",
			database_name: "BD2",
			database_port: "1443",
			database_username: "sa",
			database_password: "masterkey",
			background_img: "",
			logo_img: "",
			user: {}
		};

		this.storeService
			.registerStore(this.newStore)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = "Store created successfully";
				Swal.fire("Exito", success_text, "success").then(() => {
					this.ngOnInit();
					this.selectedTab = 0;
				});
			})
			.catch((error: any) => {
				this.showSpinner = false;
				const error_text = this.translate.instant(
					`ERRORS.ERROR_TYPE_${error.type}`
				);
				Swal.fire("Error", error_text, "error");
			});
	}

	goToStore(store: any) {
		this.router.navigate(["/store", store._id]);
	}
}
