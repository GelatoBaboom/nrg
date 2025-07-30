import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  results: any[] = [];

  ngOnInit() {
    fetch('/results')
      .then(r => r.json())
      .then(data => this.results = data)
      .catch(err => console.error(err));
  }
}
