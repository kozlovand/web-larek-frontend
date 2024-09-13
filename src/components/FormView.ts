import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IFormState {
  submit: boolean;
  errors: string;
}

export class FormView extends Component<IFormState> {
  protected events: IEvents;
  protected _button: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected container: HTMLFormElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this._errors = this.container.querySelector('.form__errors') as HTMLElement;
    this._button = this.container.querySelector('.button.order__button') as HTMLButtonElement;

    this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`form:submit`);
		});
  }

  set button(state: boolean) {
    this._button.disabled = !state;
  }


  set errors(error: string) {
    this.setText(this._errors, error);
}
  clear() {
    this.container.reset()
  }
}

export class FormViewPayment extends FormView {

  payOnline: HTMLButtonElement;
  payOffline: HTMLButtonElement;
  addressField: HTMLInputElement;
  

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.payOnline = this.container.card as HTMLButtonElement;
    this.payOffline = this.container.cash as HTMLButtonElement;
    this.addressField = this.container.address as HTMLInputElement;
    
    this.addressField.addEventListener('input', (e,) => {
      const target = e.target as HTMLInputElement;
        const inputName = target.name;
        const inputValue = target.value;

      this.events.emit('addressInput:change', {
        inputName,
        inputValue,
      });
    });

    this.payOnline.addEventListener('click', () => {
      this.events.emit('Payment:select',{
        payment: 'online',});
      this.payment = 'online';
    });;
    this.payOffline.addEventListener('click', () => {
      this.events.emit('Payment:select', {
        payment: 'offline',
      });
      this.payment = 'offline';
    });
  }

  set address(value: string) {
    this.addressField.value = value;
  }

  set payment(value: string) {
    if (value === 'online') {
      this.payOnline.classList.add('button_alt-active');
      this.payOffline.classList.remove('button_alt-active');
    } else {
      this.payOnline.classList.remove('button_alt-active');
      this.payOffline.classList.add('button_alt-active');
    }
  }
}

export class FormViewContact extends FormView {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = this.container.email as HTMLInputElement;
    this.phoneInput = this.container.phone as HTMLInputElement;
    this._button = this.container.querySelector('.button') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
      this.events.emit('Order:submit');
    });

    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
        const inputName = target.name;
        const inputValue = target.value;
        this.events.emit(`contacts:change`, {
          inputName,
          inputValue
      });
    });
  }

  set email(value: string){
    this.emailInput.value = value;
  }

  set phone(value: string){
    this.phoneInput.value = value;
  } 
}
