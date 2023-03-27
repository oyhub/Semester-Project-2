import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ButtonVariantEnum } from './button.enum';

const Variants: { [Key in ButtonVariantEnum]: string } = {
  [ButtonVariantEnum.PRIMARY]: 'ws-btn',
  [ButtonVariantEnum.SECONDARY]: 'ws-btn ws-btn--secondary',
};

@Component({
  selector: 'button[ws-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() text: string;

  @Input() public variant: keyof typeof ButtonVariantEnum =
    ButtonVariantEnum.PRIMARY;

  public Variants = Variants;

  constructor() {}

  ngOnInit(): void {}

  @HostBinding('class') get hostClass() {
    return this.Variants[this.variant];
  }
}
