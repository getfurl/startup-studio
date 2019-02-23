import { DbService } from "./../../shared/db.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { FeedbackRequest } from 'src/app/shared/models';

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  id: string;
  promptIndex = 0;
  prompts = [];

  feedbackRequest: FeedbackRequest;

  savedState = new BehaviorSubject(true);

  form = new FormGroup({});

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService,
    private _router: Router
  ) {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
      this.loadFeedbackRequest(this.id);
    });

    this.form.valueChanges.pipe(debounceTime(2000)).subscribe(formData => {
      if (this.form.touched) {
        this.savedState.next(false);
        this.saveChanges(formData);
      }
    });
  }

  ngOnInit() {}

  addPrompt(promptValue: string) {
    const controlName = `prompt-${this.promptIndex}`;
    this.prompts.push({
      controlName
    });

    this.form.addControl(controlName, new FormControl(promptValue));
    this.promptIndex++;
  }

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService.getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest;
        this.loadPromptsFromFeedbackRequest(this.feedbackRequest);
      })
  }

  loadPromptsFromFeedbackRequest(feedbackRequest: FeedbackRequest) {
    if (feedbackRequest.emptyPrompts) {
      return this.addPrompt("");
    }
    
    feedbackRequest.prompts.forEach(prompt => {
      this.addPrompt(prompt);
    })
  }

  saveChanges(formData) {
    const promptsAsStrings = [];
    Object.entries(formData).forEach(keyValuePair => {
      if (!keyValuePair[1]) {
        return;
      }
      promptsAsStrings.push(keyValuePair[1]);
    });

    this._dbService.updatePrompts(this.id, promptsAsStrings).subscribe(() => {
      this.savedState.next(true);
    });
  }

  requestFeedback() {
    this._router.navigate(['results', this.id]);
  }
}
