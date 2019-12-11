import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { ClientService } from '../../services/client.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: [ './store.component.css' ]
})
export class StoreComponent implements OnInit {
	store = {
		_id: ''
	};
	clients = [];
	signaturePath = AppComponent.BACKEND_URL + '/files/client/signature/';

	constructor(
		private activatedRoute: ActivatedRoute,
		private storeService: StoreService,
		private clientService: ClientService
	) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.storeService.getStoreById(id).subscribe((response: any) => {
				console.log(response);
				this.store = response.store;
			});
		});
	}

	test() {
		this.clientService.getClients(this.store._id).subscribe((response: any) => {
			this.clients = response.clients;
		});
	}

	clientDetail(client) {
		Swal.fire({
			title: client.name,
			text: client.phone + ' || ' + client.email,
			imageUrl: this.signaturePath + client.signature,
			imageWidth: 400,
			imageHeight: 200,
			imageAlt: client.name,
			customClass: {
				image: 'custom-swal2-image'
			}
		});
	}
}
