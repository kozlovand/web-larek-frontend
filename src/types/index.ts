export interface IProduct {
	id: string;
	title: string;
	price: number;
	description?: string;
	image: string;
	category: string;
}

export interface IOrder {
	payment: 'online' | 'offline' ;
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
	basket: TBag[];
  itemsCount: number;
	addProduct(product: IProduct): void;
	deleteProduct(cardID: string): void;
	getProduct(productID: string): IProduct;
  mathCount(product: TBag[]): number;
}

export interface IForm {
	payment: 'online' | 'offline';
	email: string;
	phone: string;
	address: string;
	setData(data: TFormInfo): void;
	clearData(): void;
	checkValidation(data: Record<keyof TFormInfo, string>): boolean;
}


export type TProduct = Pick<
	IProduct,
	'title' | 'image' | 'category' | 'price' | 'description'
>;

export type TProductPublic = Pick<
	IProduct,
	'title' | 'image' | 'category' | 'price'
>;

export type TBag = Pick<IProduct & IOrder, 'title' | 'price' | 'total' | 'id'>;

export type TFormInfo = Pick<IOrder, 'address' | 'payment' | 'phone' | 'email' >;


