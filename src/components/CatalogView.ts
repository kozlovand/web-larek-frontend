import { IProduct } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IProductContainer {
  counter: number;
  catalog: HTMLElement[]
}

export  class HeaderView extends Component<IProductContainer> {
  events: IEvents;
  protected _counter: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
    this._basket = container.querySelector('.header__basket') as HTMLElement;

    this._basket.addEventListener('click', () => {
      // this.events.emit('basket:isEmpty');
      this.events.emit('basket:open');
  });
  }
  set counter(value: number) {
    this.setText(this._counter, String(value));
}
}

export class CatalogView extends Component<IProductContainer> {
  events: IEvents;
  protected _catalog: HTMLElement[];

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
  }

  set catalog(catalog: HTMLElement[]) {
    this.container.replaceChildren(...catalog);
}
}