import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { config } from '../../../common/src/config/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private title: Title) {
        this.title.setTitle(config.title);
    }
}
