import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "../../services/store.service";

@Component({
	selector: "app-store",
	templateUrl: "./store.component.html",
	styleUrls: ["./store.component.css"]
})
export class StoreComponent implements OnInit {
	store = {};
	constructor(
		private activatedRoute: ActivatedRoute,
		private storeService: StoreService
	) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			this.storeService.getStoreById(id).subscribe((response: any) => {
				console.log(response);
				this.store = response.store;
			});
		});
	}
}
