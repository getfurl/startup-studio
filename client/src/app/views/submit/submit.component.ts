import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @ViewChild("url")
  urlInput: ElementRef;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  submitWebsite(event) {
    event.preventDefault();
    const url = this.urlInput.nativeElement.value;
    this._router.navigate([`/edit`, url]);
  }
}
