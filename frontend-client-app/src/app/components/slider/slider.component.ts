import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

declare var $: any;

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: [ './slider.component.css' ]
})
export class SliderComponent implements OnInit {
	constructor(private router: Router) {}

	images = [
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/6.jpg',
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/4.jpg',
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/2.jpg',
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/6.jpg',
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/4.jpg',
		'https://tympanus.net/Tutorials/CSS3FullscreenSlideshow/images/2.jpg'
	];

	abs_path = AppComponent.BACKEND_URL + '/files/store/background/';
	ls_images = localStorage.getItem('bg_image');
	bg_images = this.ls_images.split(',');

	ngOnInit() {
		console.log(this.bg_images);
		$('.cb-slideshow li:nth-child(1) span').css('background', `url(${this.abs_path + this.bg_images[0]})`);
		$('.cb-slideshow li:nth-child(2) span').css('background', `url(${this.abs_path + this.bg_images[1]})`);
		$('.cb-slideshow li:nth-child(3) span').css('background', `url(${this.abs_path + this.bg_images[2]})`);
		$('.cb-slideshow li:nth-child(4) span').css('background', `url(${this.abs_path + this.bg_images[3]})`);
		$('.cb-slideshow li:nth-child(5) span').css('background', `url(${this.abs_path + this.bg_images[4]})`);
		$('.cb-slideshow li:nth-child(6) span').css('background', `url(${this.abs_path + this.bg_images[5]})`);
	}

	goToHome() {
		this.router.navigate([ '/home' ]);
	}
}
