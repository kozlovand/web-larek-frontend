import { ApiData } from './components/ApiData';
import { BasketData } from './components/BasketData';
import { BasketView } from './components/BasketView';
import { CatalogData } from './components/CatalogData';
import { CatalogView, HeaderView } from './components/CatalogView';
import { FormData } from './components/FormData';
import { FormViewContact, FormViewPayment } from './components/FormView';
import { ModalView } from './components/ModalView';
import { ProductBasketView, ProductCatalogView, ProductFullView, ProductView } from './components/ProductView';
import { SuccessView } from './components/SuccessView';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { FormErrors, IProduct, TFormInfo, TVlaluePayment } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const cardTemplateCatalog = document.querySelector("#card-catalog") as HTMLTemplateElement;
const cardTemplatePreview = document.querySelector("#card-preview") as HTMLTemplateElement;
const cardTemplateBasket = document.querySelector("#card-basket") as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const payTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactTemplete = document.querySelector("#contacts") as HTMLTemplateElement;
const successTemplate = document.querySelector("#success") as HTMLTemplateElement;

const catalogSection = document.querySelector('.gallery') as HTMLElement;
const headerSection = document.querySelector('.header') as HTMLElement;

const api = new ApiData( CDN_URL ,API_URL, settings);
const event = new EventEmitter();
const catalogData = new CatalogData(event);
const basketData = new BasketData(event);
const formData = new FormData(event);

const success = new SuccessView(cloneTemplate(successTemplate), event);
const basket = new BasketView(cloneTemplate(basketTemplate), event);
const catalog = new CatalogView(catalogSection, event);
const modal = new ModalView(document.querySelector('#modal-container'), event);
const formPay = new FormViewPayment(cloneTemplate(payTemplate), event);
const formContact = new FormViewContact(cloneTemplate(contactTemplete), event);
const header = new HeaderView(headerSection, event);

event.onAll(event => {
  console.log(event.eventName, event.data)
})

// Загрузка каталога

api.getProducts()
  .then((products) => {
    catalogData.products = products;
  })
  .catch(err => {
    console.error(err);
  })

  
// Загрузка карточек
  event.on('initialData:loaded', () => {
    const arrayProducts = catalogData.products.map((product) => {
      const productInstant = new ProductCatalogView(cloneTemplate(cardTemplateCatalog), event);
      return productInstant.render(product);
    });

    catalog.render({catalog:arrayProducts});
  })

  // Открытие корзины
  event.on('basket:open', () => {
     const arrayProductsBasket = basketData.basket.map((product, index) => {
      const productInstant = new ProductBasketView(cloneTemplate(cardTemplateBasket), event);
      productInstant.index = index + 1;
      return productInstant.render(product);
     })
     if (basketData.isEmpty()) {
      basket.toggleButton(true);
    } else {
      basket.toggleButton(false);
    }
    basket.items = arrayProductsBasket;
    basket.total = basketData.getTotalPrice();
    modal.render({content:basket.render()});
  })

  // Открытие пустой корзины
  // event.on('basket:isEmpty', () => {
   
  //   modal.content = basket.render();
  // });

  // Обновление корзины
  event.on('basket:change', (data: {products: IProduct[]} ) => {
    const arrayProductsBasket = data.products.map((product, index) => {
      const productBasketView = new ProductBasketView(cloneTemplate(cardTemplateBasket), event);
      productBasketView.index = index + 1;
      return productBasketView.render(product) as HTMLLIElement;
    });
    basket.items = arrayProductsBasket;
    if(basketData.isEmpty()) {
      basket.toggleButton(true);
    } else {
      basket.toggleButton(false);
    }
    basket.total = basketData.getTotalPrice();
    header.counter = basketData.getCount();
    modal.content = basket.render();
  });

  // Выбор товара
  event.on('product:select', (data : {id: string}) => {
	  catalogData.preview = data.id;
  });

  // Открытие товара по select
  event.on('fullProduct:change', (data : {id: string}) => {
    const product = catalogData.getProduct(data.id);
    const state = basketData.inBasket(data.id);
    const productFullView = new ProductFullView(cloneTemplate(cardTemplatePreview), event);
    productFullView.button = state;
    header.counter = basketData.getCount();
    modal.render({content:productFullView.render(product)});
  });

  // Добавление в корзину
  event.on('productBasket:add', (data: {id:string}) => {
    const product = catalogData.getProduct(data.id);
    basketData.addProduct(product);
  })

  // Удаление из корзины в попапе карточки
  event.on('productBasket:delete', (data: {id:string}) => {
    basketData.deleteProduct(data.id);
    basket.total = basketData.getTotalPrice();
  })

  // Удаление из корзины в корзине
  event.on('productBasket:deleteInBasket', (data: {id:string}) => {
    basketData.deleteProductInBasket(data.id);
  })
  
  // Открытие формы
  event.on('order:open' , () => {
    formData.payment = 'offline';
    formPay.clear();
    formContact.clear();
    formPay.payment = formData.payment;
    modal.render({content:formPay.render()});
  })

  // Выбор способа оплаты
  event.on('Payment:select', ( data: {payment: TVlaluePayment} ) => {
    formPay.payment = data.payment;
  })

  // Изменение input address
  event.on('addressInput:change', ( data : { inputName: keyof TFormInfo, inputValue: string }) => {
    formData.setInputAddress(data.inputName, data.inputValue);
  })

  // Событие формы при ошибке
  event.on('Form: error', (data: FormErrors) => {
    formPay.errors = data.address || data.payment;
    formPay.button = false;
    formContact.errors = data.email || data.phone;
    formContact.button = false;
    
  })

  // Событие формы при валидности
  event.on('Form: valid', () => {
    formPay.button = true;
    formPay.errors = '';
    formContact.button = true;
    formContact.errors = '';
  })

  // Переход к форме контактов
  event.on('form:submit', () => {
    modal.render({content:formContact.render()});
  });

  // Изменение input contact
  event.on('contacts:change',( data : { inputName: keyof TFormInfo, inputValue: string }) => {
      formData.setInputsContact(data.inputName, data.inputValue);
  })

  // Отправка формы
  event.on('Order:submit', () => {
    const order = {
      ...formData.getAllInfo(),
      total: basketData.getTotalPrice(),
      items: basketData.getIds()
    }
    api.postOrder(order)
      .then((data) => {
        basketData.clear();
        formData.clearData();
        success.total = data.total;
        header.counter = basketData.basket.length;
        modal.render({content:success.render()});
        event.emit('initialData:load');
      })
      .catch(err => {
        console.error(err);
    })
  })

  // Закрытие модального окна успешного заказа
  event.on('success:close', () => {
    modal.close();
  })
