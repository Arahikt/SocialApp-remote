import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter(); 
  
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[]=[];

  constructor(private accountService: AccountService, private toastr: ToastrService, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate= new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -13);

  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      confirmPassword: ['', [Validators.required, this.matchPasswords('password')]]

    })//validates, if password changes after confirming
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  matchPasswords(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }
  register() {
    console.log(this.registerForm.value);
      this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
        this.cancel();
      }, error => {
        this.validationErrors = error;
      })
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
