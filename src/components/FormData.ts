import { FormErrors, IForm, TFormInfo, TVlaluePayment } from '../types';
import { IEvents } from './base/events';

export class FormData implements IForm {
	protected _payment: string;
	protected _email: string;
	protected _phone: string;
	protected _address: string;
	events: IEvents;
	formErrors: FormErrors = {};

	constructor(event: IEvents) {
		this.events = event;
	}

	set payment(value: string) {
		this._payment = value;
	}

	set address(value: string) {
		this._address = value;
	}

	set email(value: string) {
		this._email = value;
	}

	set phone(value: string) {
		this._phone = value;
	}

  getAllInfo() {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

	clearData() {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.events.emit('form:changed');
	}

	getErrors(): FormErrors {
		return this.formErrors;
	}

	setInputAddress(field: keyof TFormInfo, value: string) {
		this[field] = value;

		if (typeof this.checkValidationAddress() === 'string') {
			this.events.emit('Form: error', this.formErrors);
		} else {
			this.events.emit('Form: valid');
		}
	}
	setInputsContact(field: keyof TFormInfo, value: string) {
		this[field] = value;

		if (!this.checkValidationСontact()) {
			this.events.emit('Form: error', this.formErrors);
		} else {
			this.events.emit('Form: valid');
		}
	}

	checkValidationСontact(): boolean {
		const errors: typeof this.formErrors = {};
		if (!/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/.test(this._email)) {
			errors.email = 'Необходимо указать email в формате: example@example.com';
		}
		if (!/\+7[0-9]{10}/.test(this._phone)) {
			errors.phone = 'Необходимо указать телефон в формате: +7xxxxxxxxxx';
		}
		this.formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	checkValidationAddress(): true | string {
		const errors: typeof this.formErrors = {};

		if (!this._address) {
			errors.address = 'Необходимо указать адрес';
			this.formErrors = Object.assign(this.formErrors, errors);
			return errors.address;
		}
		return true;
	}
}
