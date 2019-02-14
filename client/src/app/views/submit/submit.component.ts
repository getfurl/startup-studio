import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @ViewChild("url")
  url: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  submitWebsite(event) {
    event.preventDefault();
    
    console.log(this.url.nativeElement.value);
  }
}
