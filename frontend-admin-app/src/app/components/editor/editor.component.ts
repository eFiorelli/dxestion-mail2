import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
})
export class EditorComponent implements OnInit {
	editorForm: FormGroup;
	@Output() updatePreview = new EventEmitter<string>();

	editorStyle = {
		height: '500px'
	};

	constructor() {}

	ngOnInit() {
		this.editorForm = new FormGroup({
			editor: new FormControl(null)
		});
	}

	onSubmit() {
		this.updatePreview.emit(this.editorForm.get('editor').value);
	}

	updateChanges() {
		this.updatePreview.emit(this.editorForm.get('editor').value);
	}
}
