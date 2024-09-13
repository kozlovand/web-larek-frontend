import { IEvents } from "../components/base/events";

export interface IProduct {
	id: string;
	title: string;
	price: number;
	description?: string;
	image: string;
	category: string;
}

export interface IOrder {
	payment: string ;
	total: number;
	email: string;
	phone: string;
	address: string;
	items: string[];
}

export interface ICatalogData {
	products: IProduct[];
	preview: string | null;
  getProduct(cardID: string): IProduct;
}

export interface IBasketData {
	basket: IProduct[];
	addProduct(product: IProduct): void;
	deleteProduct(cardID: string): void;
	getProduct(productID: string): IProduct;
  getCount(products: IProduct[]): number
}

export interface IForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
	clearData(): void;
	checkValidationСontact(): boolean;
	checkValidationAddress(): true | string;
}


export type TProduct = Pick<
	IProduct,
	'title' | 'image' | 'category' | 'price' | 'description'
>;

export type TVlaluePayment = 'online' | 'offline';

export type TFormInfo = Pick<IOrder, 'payment' | 'address' | 'phone' | 'email' >;

export type FormErrors = Partial<Record<keyof TFormInfo, string>>;


