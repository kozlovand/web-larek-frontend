import { IProduct } from "../types";
import { createElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasket {
  list: HTMLElement;
  total: HTMLElement;
  button: HTMLElement;
  items: HTMLElement[];
}

export class BasketView extends Component<IBasket> {
  protected events: IEvents;
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected button: HTMLElement;


  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._list = this.container.querySelector('.basket__list') as HTMLElement;
    this._total = this.container.querySelector('.basket__price') as HTMLElement;
    this.button = this.container.querySelector('.basket__button') as HTMLElement;

    if (this.button) {
      this.button.addEventListener('click', () => {
          events.emit('order:open');
      });
  }
  }


  set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
        }));
    }
  }

  toggleButton(state: boolean) {
		this.setDisabled(this.button, state);
	}

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }
}