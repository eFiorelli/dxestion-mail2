import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AuthService } from '../../services/auth.service';

declare var $: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	@ViewChild(SignaturePad, { static: true })
	signaturePad: SignaturePad;

	constructor(public userService: UserService, private translate: TranslateService, private auth: AuthService) {}

	selectedFile: any;
	imagePath = AppComponent.BACKEND_URL + '/files/store/background/';
	backgroundImg = '';

	client = {
		email: '',
		name: '',
		phone: '',
		signature: new Blob(),
		gpdr: false
	};

	drawStatus = false;

	public signaturePadOptions: Object = {
		// passed through to szimek/signature_pad constructor
		minWidth: 5,
		canvasWidth: 250,
		canvasHeight: 200,
		backgroundColor: 'white',
		dotSize: 2
	};

	// tslint:disable-next-line: use-life-cycle-interface
	ngAfterViewInit() {
		// this.signaturePad is now available
		this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
		this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
		$('canvas').css('border-radius', '15px');
	}

	drawComplete() {
		// will be notified of szimek/signature_pad's onEnd event
	}

	drawStart() {
		this.drawStatus = true;
		// will be notified of szimek/signature_pad's onBegin event
	}

	ngOnInit() {
		if (localStorage.getItem('bg_image') !== 'undefined') {
			this.backgroundImg = this.imagePath + localStorage.getItem('bg_image');
		} else {
			this.backgroundImg = '../../../assets/bg-heading-03.jpg';
		}
	}

	registerClient() {
		if (!this.client.gpdr) {
			const gpdr_text = this.translate.instant('ERRORS.GPDR_ACCEPT');
			Swal.fire('Error', gpdr_text, 'error');
			return;
		}
		this.client.signature = this.dataURItoBlob(this.signaturePad.toDataURL('image/png'));
		this.userService
			.registerClient(this.client)
			.then((response) => {
				const success_text = 'Cliente creado con exito';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.flip();
				});
			})
			.catch((error) => {
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', error_text, 'error');
			});
	}

	clearForm() {
		this.client = {
			email: '',
			name: '',
			phone: '',
			signature: new Blob(),
			gpdr: false
		};
		this.drawStatus = false;
		this.signaturePad.clear();
	}

	clearSignaturePad() {
		this.drawStatus = false;
		this.signaturePad.clear();
	}

	flip() {
		$('.card').addClass('flip');
		$('.card-heading, .card-body').addClass('opacity');
		setTimeout(() => {
			$('.card-heading, .card-body').removeClass('opacity');
			this.clearForm();
		}, 1000);
		setTimeout(() => {
			$('.card').removeClass('flip');
		}, 2000);
	}

	showGPDR(active) {
		if (active) {
			const gpdr_text = JSON.stringify(localStorage.getItem('gpdr_text'));
			Swal.fire(gpdr_text);
		}
	}

	dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		let byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0) {
			byteString = atob(dataURI.split(',')[1]);
		} else {
			byteString = unescape(dataURI.split(',')[1]);
		}

		// separate out the mime component
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		const ia = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ ia ], { type: mimeString });
	}
}
