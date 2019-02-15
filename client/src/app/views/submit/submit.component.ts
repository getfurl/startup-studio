import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/shared/db.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @ViewChild("url")
  urlInput: ElementRef;

  constructor(private _router: Router, private _dbService: DbService) { }

  ngOnInit() {
  }

  submitWebsite(event) {
    event.preventDefault();
    const url = this.urlInput.nativeElement.value;
    this._dbService.createFeedbackRequest(url)
      .subscribe(documentRef => {
        this._router.navigate([`/edit`, documentRef.id]);
      })
  }
}
