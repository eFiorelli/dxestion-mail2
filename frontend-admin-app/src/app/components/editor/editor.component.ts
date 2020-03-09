import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
})
export class EditorComponent implements OnInit {
	editorForm: FormGroup;

	editorStyle = {
		height: '300px'
	};

	constructor() {}

	ngOnInit() {
		this.editorForm = new FormGroup({
			editor: new FormControl(null)
		});
	}

	onSubmit() {
		console.log(this.editorForm.get('editor').value);
	}
}
