import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AppComponent } from "../../app.component";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { SignaturePad } from "angular2-signaturepad/signature-pad";

declare var $: any;

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
	@ViewChild(SignaturePad) signaturePad: SignaturePad;

	constructor(
		public userService: UserService,
		private translate: TranslateService
	) {}

	selectedFile: any;
	imagePath = AppComponent.BACKEND_URL + "/files/store/background/";
	backgroundImg = "";

	client = {
		email: "",
		name: "",
		phone: "",
		signature: new Blob(),
		gpdr: false
	};

	public signaturePadOptions: Object = {
		// passed through to szimek/signature_pad constructor
		minWidth: 5,
		canvasWidth: 250,
		canvasHeight: 200,
		backgroundColor: "white"
	};

	ngAfterViewInit() {
		// this.signaturePad is now available
		this.signaturePad.set("minWidth", 5); // set szimek/signature_pad options at runtime
		this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
		$("canvas").css("border-radius", "15px");
	}

	drawComplete() {
		// will be notified of szimek/signature_pad's onEnd event
		// console.log(this.signaturePad.toDataURL('image/png'));
	}

	drawStart() {
		// will be notified of szimek/signature_pad's onBegin event
		console.log("begin drawing");
	}

	ngOnInit() {
		if (localStorage.getItem("bg_image") !== "undefined") {
			this.backgroundImg =
				this.imagePath + localStorage.getItem("bg_image");
		} else {
			this.backgroundImg = "../../../assets/bg-heading-03.jpg";
		}
	}

	registerClient() {
		if (!this.client.gpdr) {
			const gpdr_text = this.translate.instant("ERRORS.GPDR_ACCEPT");
			Swal.fire("Error", gpdr_text, "error");
			return;
		}
		this.client.signature = this.dataURItoBlob(
			this.signaturePad.toDataURL("image/png")
		);
		this.userService
			.registerClient(this.client)
			.then(response => {
				const success_text = "Cliente creado con exito";
				Swal.fire("Exito", success_text, "success").then(() => {
					this.client = {
						email: "",
						name: "",
						phone: "",
						signature: new Blob(),
						gpdr: false
					};
					this.signaturePad.clear();
				});
			})
			.catch(error => {
				const error_text = this.translate.instant(
					`ERRORS.ERROR_TYPE_${error.type}`
				);
				Swal.fire("Error", error_text, "error");
			});
	}

	randomClient() {
		let random = Math.random()
			.toString(36)
			.substring(2, 15);
		let randomPhone =
			Math.floor(Math.random() * (699999999 - 600000000 + 1)) + 600000000;
		let client = {
			email: `${random}@${random}.com`,
			name: random,
			phone: randomPhone,
			signature: new Blob()
		};
		client.signature = this.dataURItoBlob(
			this.signaturePad.toDataURL("image/png")
		);
		this.userService
			.registerClient(client)
			.then(response => {
				const success_text = "Cliente creado con exito";
				Swal.fire("Exito", success_text, "success");
			})
			.catch(error => {
				const error_text = this.translate.instant(
					`ERRORS.ERROR_TYPE_${error.type}`
				);
				Swal.fire("Error", error_text, "error");
			});
	}

	dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(",")[0].indexOf("base64") >= 0)
			byteString = atob(dataURI.split(",")[1]);
		else byteString = unescape(dataURI.split(",")[1]);

		// separate out the mime component
		var mimeString = dataURI
			.split(",")[0]
			.split(":")[1]
			.split(";")[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}
}
