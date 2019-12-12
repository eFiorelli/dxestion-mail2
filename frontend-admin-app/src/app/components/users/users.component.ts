import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
	providers: [FilterUsersPipe]
})
export class UsersComponent implements OnInit {
	constructor(
		public userService: UserService,
		public filterUsersPipe: FilterUsersPipe,
		private router: Router,
		private translate: TranslateService,
		private auth: AuthService
	) {}

	users: any[];
	userList: any[];
	imagePath = AppComponent.BACKEND_URL + '/files/user/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	usersListFiltered: any[];
	selectedTab;

	user: any = {
		username: 'ddd',
		password: 'ddd',
		name: 'ddd',
		email: 'ddd@ddd.com',
		logo_img: ''
	};

	showSpinner = false;

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.userService.getUsers().subscribe((response: any) => {
			this.users = response.users;
			this.userList = response.users;
		});
	}

	searchUsers(text?: string) {
		/* Search filter */
		if (text !== '' && text !== undefined && text !== null) {
			this.userList = this.users;
			this.searchText = text;
			this.usersListFiltered = this.filterUsersPipe.transform(
				this.userList,
				this.searchText
			);
			this.userList = this.usersListFiltered;
		} else {
			this.searchText = '';
			this.userList = this.users;
		}
		if (!this.usersListFiltered) {
			return;
		}
	}

	userDetail(id: string) {
		this.router.navigate(['/user/', id]);
	}

	userStores(user: any) {
		// localStorage.setItem('selectedUserID', user._id);
		this.router.navigate(['/stores/', user._id]);
	}

	registerUser() {
		this.showSpinner = true;
		this.userService
			.registerUser(this.user)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = this.translate.instant(
					'SUCCESS.REGISTER_USER'
				);
				Swal.fire('Error', success_text, 'success').then(() => {
					this.ngOnInit();
					this.selectedTab = 0;
				});
			})
			.catch(error => {
				this.showSpinner = false;
				const success_text = this.translate.instant(
					`ERRORS.ERROR_TYPE_${error.type}`
				);
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
