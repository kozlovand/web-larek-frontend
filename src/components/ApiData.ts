import { IOrder, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";


export class ApiData extends Api {
  readonly cdn: string;
  constructor(cdn: string,baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]>{
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}
  postOrder(data: IOrder): Promise<IOrder> {
    return this.post('/order', data).then((order: IOrder) => order)
  }
}