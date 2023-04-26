import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';
import { Subscription} from "rxjs";
import {ModalService} from "../../services/modal.service";
import {InputComponent} from "../inputs/input.component";
import {Login} from "../../models/login.model";
import {DataService} from "../../services/data.service";
import {StorageService} from "../../services/storage.service";
import {UserService} from "../../services/user.service";
import {Register} from "../../models/register.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ws-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  activeClass: boolean = false;
  isLoggedIn: boolean;
  isMediumScreen: boolean;
  isSmallScreen: boolean;
  showModal: boolean = false
  templateOutlet: TemplateRef<any>;

  private screenMediumSubscription: Subscription;
  private screenSmallSubscription: Subscription;
  private userSubscription: Subscription;

  // Register form variables
  regForm: FormGroup;
  regValidationMessage: any;

  @ViewChild('login', { static: true }) loginTemplate;
  @ViewChild('logout', { static: true }) logoutTemplate;
  @ViewChild('register', { static: true }) registerTemplate;
  @ViewChild('emailInput') email: InputComponent;
  @ViewChild('passwordInput') password: InputComponent;


  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService,
    public modalService: ModalService,
    private dataService: DataService,
    private storageService: StorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private router: Router
  ) {
      this.modalService.showModal$.subscribe(show => this.showModal = show);
  }



  ngOnInit(): void {
    this.screenMediumSubscription =
      this.screenWidthDetectionService.mediumScreen.subscribe((status: boolean) => {
        this.isMediumScreen = status;
        if (this.isMediumScreen === true) {
          this.activeClass = false;
        }
      })

    this.screenSmallSubscription = this.screenWidthDetectionService.smallScreen.subscribe((status: boolean) => {
      this.isSmallScreen = status;
    });

    this.userSubscription = this.userService.user$.subscribe((status: boolean) => {
        this.isLoggedIn = status;
      }
    );

    this.regForm = this.formBuilder.group({
      regEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$')]],
      regUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_\s]+$')]],
      regPassword: ['', [Validators.required, Validators.pattern('^[^\\s]+$'), Validators.minLength(6)]]
    });

    this.validationService.setValidationMessages({
      regEmail: {
        required: 'You need to fill in a email adress',
        pattern: 'You need to fill in a valid @stud.noroff.no email adress'
      },
      regUsername: {
        required: 'You need to fill in a username',
        pattern: 'The username can only contain alphanumeric characters'
      },
      regPassword: {
        required: 'You need to fill in a password',
        pattern: 'The password can not contain any spaces',
        minLength: 'The password must be 6 or more characters'
      }
    });
    this.regValidationMessage = this.validationService.resetValidationMessages(this.regForm);

    // this.regForm.valueChanges.pipe(debounceTime(1200)).subscribe(value => {
    //   console.log(value)
    //   this.regValidationMessage = this.validationService.getValidationMessages(this.regForm);
    // });

    this.validationService.trackFieldChanges(this.regForm, (fieldName, validationMessage) => {
      this.regValidationMessage[fieldName] = validationMessage;
    });

  }

  ngOnDestroy() {
    this.screenMediumSubscription.unsubscribe();
    this.screenSmallSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  hamburgerClick() {
    this.activeClass = this.activeClass ? this.activeClass = false : this.activeClass = true;
  }

  registerClick() {
    this.templateOutlet = this.registerTemplate;
    this.activeClass = this.activeClass ? !this.activeClass : undefined;
    this.modalService.openModal();
  }

  loginClick() {
    this.templateOutlet = this.loginTemplate;
    this.activeClass = this.activeClass ? !this.activeClass : undefined;
    this.modalService.openModal();
  }

  onLogin(event) {
    event.preventDefault();

    if (!this.email.inputValue || !this.password.inputValue) {
      alert('Please write login details');
      return;
    }

    const login: Login = {
      email: this.email.inputValue.trim(),
      password: this.password.inputValue.trim()
    };

   this.dataService.getAuth(login);
  }

  onRegister() {
    if (this.regForm.status === 'INVALID'){
      this.regValidationMessage = this.validationService.getValidationMessages(this.regForm);
      return
    }
    const register: Register = {
      name: this.regForm.controls['regUsername'].value,
      email: this.regForm.controls['regEmail'].value,
      password: this.regForm.controls['regPassword'].value
    }
    this.dataService.register(register);
  }

  logoutClick() {
    this.templateOutlet = this.logoutTemplate;
    this.activeClass = this.activeClass ? !this.activeClass : undefined;
    this.modalService.openModal();
  }

  onLogout() {
    this.storageService.clearAllStorage();
    this.userService.checkIfUserExist();
    this.modalService.closeModal()
    this.router.navigateByUrl('/');
  }

}


