import { ICatalogData, IProduct } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class CatalogData implements ICatalogData {
	protected _products: IProduct[];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(event: IEvents) {
		this.events = event;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('catalog:get', products);
	}

	get products() {
		return this._products;
	}

	set preview(productId: string) {
		if (this.getProduct(productId)) {
			this._preview = productId;
			this.events.emit('fullProduct:change', {
				id: productId,
			});
		} else {
			throw new Error(`Product with ID ${productId} not found`);
		}
	}

	get preview() {
		return this._preview;
	}

	getProduct(productId: string) {
		return this._products.find((item) => item.id === productId);
	}
}
