import { IBasketData, IProduct } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected _basket: IProduct[] = [];
	protected events: IEvents;

	constructor(event: IEvents) {
		this.events = event;
	}

	addProduct(product: IProduct) {
		this._basket.push(product);
		this.events.emit('basket:change', {
			products: this._basket,
		});
		this.events.emit('fullProduct:change' , {
			id: product.id
		})
	}
	deleteProduct(productID: string) {
		this._basket = this._basket.filter((item) => item.id !== productID);
		this.events.emit('fullProduct:change' , {
			id: productID
		})
	}

	deleteProductInBasket(productID: string) {
		this._basket = this._basket.filter((item) => item.id !== productID);
		this.events.emit('basket:change', {
			products: this._basket,
		});
	}

	inBasket(productId: string) {
		return this._basket.some((item) => item.id === productId);
	}
	getProduct(productID: string): IProduct {
		return this._basket.find((item) => item.id === productID);
	}

	getCount() {
		return this._basket.length;
	}

	getIds(): string[] {
		return this._basket.map((item) => item.id);
	}

	getTotalPrice(): number {
		return this._basket.reduce((acc, item) => acc + item.price, 0);
	}

	isEmpty() {
		return this._basket.length === 0;
	}

	get basket() {
		return this._basket;
	}

	clear() {
		this._basket = [];
	}
}
