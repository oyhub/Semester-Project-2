import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';
import {Subscription} from "rxjs";
import {ModalService} from "../../services/modal.service";
import {InputComponent} from "../inputs/input.component";
import {Login} from "../../models/login.model";
import {DataService} from "../../services/data.service";
import {StorageService} from "../../services/storage.service";
import {UserService} from "../../services/user.service";

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

  @ViewChild('login', { static: true }) loginTemplate;
  @ViewChild('register', { static: true }) registerTemplate;
  @ViewChild('emailInput') email: InputComponent;
  @ViewChild('passwordInput') password: InputComponent;


  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService,
    private modalService: ModalService,
    private dataService: DataService,
    private storageService: StorageService,
    private userService: UserService
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

  onLogin() {
    console.log(this.storageService.getUser());
    if (!this.email.inputValue || !this.password.inputValue) {
      alert('Please write login details');
      return;
    }

    const login: Login = {
      email: this.email.inputValue.trim(),
      password: this.password.inputValue.trim(),
    };

   this.dataService.getAuth(login);

   console.log(this.storageService.getUser());
  }
}
