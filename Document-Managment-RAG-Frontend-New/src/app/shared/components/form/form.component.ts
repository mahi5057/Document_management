import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { formConfig } from '../../../metadata/form-config';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  @Input() formType!: 'signup' | 'login';
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;
  config:any;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.config = formConfig[this.formType];
    if (!this.config) {
      console.error(`Form configuration for type '${this.formType}' not found.`);
      return;
    }
    this.form = this.fb.group({});
    this.config.fields.forEach((field:any) => {
      this.form.addControl(
        field.name,
        this.fb.control('', field.required ? Validators.required : null)
      );
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
