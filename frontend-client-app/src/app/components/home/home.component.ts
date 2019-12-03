import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	constructor(public userService: UserService, private translate: TranslateService) { }

	selectedFile: any;
	imagePath = AppComponent.BACKEND_URL + '/files/client/signature/';

	random = Math.random()
		.toString(36)
		.substring(2, 15);

	randomPhone = Math.floor(Math.random() * (699999999 - 600000000 + 1)) + 600000000;

	client = {
		email: `${this.random}@${this.random}.com`,
		name: this.random,
		phone: this.randomPhone,
		signature: ''
	};

	ngOnInit() { }

	selectImage(event) {
		this.selectedFile = event.target.files[0];
	}

	registerClient() {
		this.client.signature = this.selectedFile;
		this.userService.registerClient(this.client).then((response) => {
			const success_text = 'Cliente creado con exito';
			Swal.fire('Exito', success_text, 'success');
		}).catch((error) => {
			const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
			Swal.fire('Error', error_text, 'error');
		})
	}

}
