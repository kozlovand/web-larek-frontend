import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IModal {
  content: HTMLElement;
}

export class ModalView extends Component<IModal> {
  protected events: IEvents;
  protected _content: HTMLElement;
  protected _closeButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._content = this.container.querySelector('.modal__content') as HTMLElement;
    this._closeButton = this.container.querySelector('.modal__close') as HTMLElement;

    this._closeButton.addEventListener('click', this.close.bind(this));

    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  open() {
    document.body.style.overflow = 'hidden';
    this.container.classList.add('modal_active');
    document.addEventListener("keyup", this.handleEscUp);
    this.events.emit('modal:open');
  }

  close() {
    document.body.style.overflow = '';
    this.container.classList.remove('modal_active');
    document.removeEventListener("keyup", this.handleEscUp);
    this.events.emit('modal:close');
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  handleEscUp (evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  render(data?: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}