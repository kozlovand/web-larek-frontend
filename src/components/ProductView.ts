import { IProduct } from '../types';
import { productCategory } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class ProductView extends Component<IProduct> {
	protected _id: string;
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
	}

	get id() {
		return this._id;
	}

	set id(id: string) {
		this._id = id;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}
}

export class ProductBasketCatalogAndFullView extends ProductView {
	protected _category: HTMLSpanElement;
	protected _image: HTMLImageElement;
	
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._category = this.container.querySelector('.card__category');
		this._image = this.container.querySelector('.card__image');
		
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.classList.add(productCategory[value]);
		}
	}
}

export class ProductCatalogView extends ProductBasketCatalogAndFullView {
	protected _category: HTMLSpanElement;
	protected _image: HTMLImageElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.container.addEventListener('click', () =>
			this.events.emit('product:select', {
				id: this._id,
			})
		);
	}
}

export class ProductFullView extends ProductBasketCatalogAndFullView {
	protected _description: HTMLParagraphElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._button = this.container.querySelector('.card__button');
		this._description = this.container.querySelector('.card__text');
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(state: boolean) {
		if (state) {
			this.setText(this._button, 'Удалить из корзины');
			this._button.addEventListener('click', () => {
				this.events.emit('productBasket:delete', { id: this._id });
			});
		} else {
			this._button.addEventListener('click', () =>
				this.events.emit('productBasket:add', {
					id: this._id,
				})
			);
		}
	}
}

export class ProductBasketView extends ProductView {
	protected _index: HTMLSpanElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._index = this.container.querySelector('.basket__item-index');
		this._button = this.container.querySelector('.basket__item-delete');

		this._button.addEventListener('click', () =>
			this.events.emit('productBasket:deleteInBasket', { id: this._id })
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
