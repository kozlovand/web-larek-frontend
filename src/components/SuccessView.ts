import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ISuccess {
  total: number;
}

export class SuccessView extends Component<ISuccess> {
  protected _close: HTMLElement;
  events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._close = this.container.querySelector('.order-success__close') as HTMLElement;

    this._close.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.container.querySelector('.order-success__description').textContent = `Списано ${value} синапсов`;
  }
}