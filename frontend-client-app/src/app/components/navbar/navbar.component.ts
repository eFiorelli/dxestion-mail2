import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

declare var $;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit {
	activeLang = 'es';

	constructor(public auth: AuthService, private router: Router, private translate: TranslateService) {
		this.translate.setDefaultLang(this.activeLang);
	}

	ngOnInit() {}

	changeLanguage(lang: string) {
		this.activeLang = lang;
		this.translate.use(lang);
	}

	logout() {
		Swal.fire({
			title: this.translate.instant('EXIT_POPUP.TITLE'),
			input: 'password',
			inputAttributes: {
				autocapitalize: 'off'
			},
			heightAuto: false,
			showCancelButton: true,
			confirmButtonText: this.translate.instant('EXIT_POPUP.ACCEPT'),
			cancelButtonText: this.translate.instant('EXIT_POPUP.CANCEL'),
			showLoaderOnConfirm: true,
			preConfirm: (code) => {},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((code) => {
			if (code.value === '0180') {
				this.auth.logout();
			}
		});
	}
}
