# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build

```

## Данные и типы данных, используемые в приложении

Товар

```

interface IProduct {
  id: string,
  title: string,
  price: number,
  description: string,
  image: string,
  category: string
}

```

Заказ

```
interface IOrder {
	payment: string,
  total: number,
  email: string,
  phone: string,
  address: string
  items: string[]
}
```

Интерфейс для модели данных товара

```
interface ICatalogData {
	products: IProduct[];
	preview: string | null;
  getProduct(cardID: string): IProduct;
}

```

Интерфейс для модели данных в корзине

```

interface IBagData {
	products: IProduct[];
  itemsCount: number;
	addProduct(product: IProduct): void;
	deleteProduct(cardID: string): void;
	buyProduct(order: TBag): void;
	getProduct(productID: string): IProduct;
  mathCount(product: IProduct[]): number;
}

```

<!-- export type TProductBasic = Pick<IProduct, 'title' | 'image' | 'category' | 'price' > -->

Данные товара используемые в попапе товара

```
type TProduct = Pick<IProduct, 'title' | 'image' | 'category' | 'price' | 'description' >

```

Данные товара используемые в попапе корзины

```

type TBag = Pick<IProduct & IOrder,  'title' | 'price' | 'total' >

```
Данные пользователя используемые в попапе оплаты и контактных данных

```

type TOrderPayment = Pick<IOrder, 'address' | 'payment' | 'phone' | 'email'>;

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
- constructor(baseUrl: string, options: RequestInit = {})
Методы: 
- handleResponse(response: Response) - метод который возвращает элемент json, либо ошибку после успешного либо нет ответа от запроса get или post
- get(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс CatalogData

Класс отвечает за хранение и логику работы с данными товаров пришедших с сервера\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- productsAll: IProduct[]; - массив объектов товаров.
- previewItem: string | null; - id товара для просмотра в модальном окне.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Также в классе будут присутствовать методы для работы с данными:
- getProduct(cardID: string): IProduct - возвращает товар по ее id


#### Класс BasketData

Класс отвечает за хранение и обработку логики работы с товарами в корзине\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
 
- products: TBag[] - массив обьектов товаров корзины.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- itemsCount: number

Также в классе будут присутствовать методы для работы с данными:
- addProduct(product: IProduct): void - добавляет один товар в список товаров.
- deleteProduct(cardID: string): void - удаляем один товар из списка товаров.
-	getProduct(productID: string): IProduct - получаем один товар 

#### Класс FormData

Класс отвечает за хранение и обработку логики работы с данными пользователя\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- payment: 'online' | 'offline';
-	email: string;
-	phone: string;
-	address: string;

Также в классе будут присутствовать методы для работы с данными:
-	setData(data: TFormInfo): void;
-	clearData(): void;
-	checkValidation(data: Record<keyof TFormInfo, string>): boolean;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс ProductView

Отвечает за отображение товара, задавая в товаре данные названия, описания, изображения, категории, стоимости. Класс используется для отображения товара на странице сайта, в корзине и в попапе товара. В конструктор класса передается DOM элемент темплейта, что позволяет формировать товары разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки параметров товара, поиск которых осуществляется в конструкторе. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\

Наследует абстрактный класс компонент

Методы:

- get id(): string - геттер id возвращает уникальный id карточки
- set id(value: string) - установка id
- set title(value: string) - установка заголовка
- set image(value: string) - установка картинки
- set description(value: string)  - установка описания
- set category(value: string) - установка категории
- set price (value: number) - установка цены

#### Класс CatalogView

Отвечает за отображение блока товаров на главной странице и отображения счетчика в корзине.
Метод сеттер для добавление товаров на страницу пришедших с сервера. В контрукторе принимает элемент контейнер, в который встраиваются товары.

constructor(container: HTMLElement, events: IEvents)

Наследует абстрактный класс компонент

Поля: 
- _counter: HTMLElement - элемент счетчика
- _basket: HTMLElement - элемент корзины
- _gallery: HTMLElement - элемент куда встраиваются товары


- set counter(value: number) - сеттер для добавление количества товаров в корзине
- set _gallery(items: HTMLElement[]) - добавление товаров в галерею


#### Класс BasketView

Отвечает за отображение разметки корзины.
В конструктор передаем темплейт.
constructor(container: HTMLElement, events: EventEmitter).

Наследует абстрактный класс компонент

Поля:

- _list: HTMLElement - элемент списка в темплейте
- _total: HTMLElement - элемент общей суммы
- _button: HTMLElement - элемент кнопки оформления

 
Методы: 
- set items(items: HTMLElement[]) - сеттер для добавления списка товаров
- set total(total: number) - сеттер для установки общей суммы
- set selected(items: string[]) - переключение состояния кнопки

#### Класс ModalView
Реализует модальное окно.
- constructor(container: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.
В конструкторе находим элемент кнопки и установливаем слушатели для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа

Наследует абстрактный класс компонент

Поля класса
- _closeButton: HTMLButtonElement;
- _content: HTMLElement;

Методы:
- open()
- close()
- set content(value: HTMLElement) - установка контента

#### Класс FormView

Предназначен для реализации формы\
В constructor(form: HTMLFormElement, events: IEvents) передаем элемент темплейт формы и экземпляр `EventEmitter` для инициации событий.\

Поля класса:
- _button: HTMLButtonElement - кнопка записи данных  
- _error: HTMLSpanElement - ошибки валидации 

Методы:
- set submit(state: boolean) - изменение статуса блокировки кнопки 
- set error(value: string) - установка значение в поле 'error'
- clear: () => void - очищение полей

#### Класс FormViewPay

Расширяет класс FormView. Класс отображения формы с выбором способа оплаты и вводом адреса покупателя.\

Наследует абстрактный класс компонент

Поля класса:
- _payOnline: HTMLButtonElement - кнопка оплаты картой 
- _payOffline: HTMLButtonElement- кнопка оплаты наличными 
- _addressField: HTMLInputElement - адрес доставки 

Методы класса:
- togglePayment: (value: string) => void - переключение активного класса кнопок 
- set address(value: string) - установка значения в поле 'address'

#### Класс FormViewContact

Расширяет класс FormView. Класс отображения формы с вводом электронной почты и номера телефона.\

Наследует абстрактный класс компонент

Поля класса:
- _emailInput: HTMLInputElement- электронная почта 
- _phoneInput: HTMLInputElement - номер телефона 


Методы класса:
- set email(value: string) - установка значения в поле 'email' 
- set phone(value: string) - установка значения в поле 'phone'

#### Класс SuccessView

Предназначен для реализации темплейта success\
В конструктор класса передаем нужный темплейт и экземпляр `EventEmitter` для инициации событий.\

Наследует абстрактный класс компонент

Поля класса:
- _total: number - общая стоимость товаров
- _close: HTMLElement - элемент кнопки закрытия

Методы класса:
- set total(value: number) - установка общей суммы заказа


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `product:selected` - изменение открываемого товара в модальном окне
- `product:previewClear` - очистка данных открываемого товара в модальном окне

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

- `product:select` - выбор товара для отображения в модальном окне
- `productBasket:add` - добавление товара в корзину
- `productBasket:delete` - удаление товара из корзины
- `order:open` - открытие формы оплаты и адреса
- `constants:open`- открытие формы контактов
- `order:submit` -  отправка формы заказов
- `constants:submit` - отправка формы контактов
- `success:submit` -событие, генерируемое при нажатии "За новыми покупками" в модальном окне подтверждения
- `order:validation` - событие, сообщающее о необходимости валидации формы order
- `constants:validation` - событие, сообщающее о необходимости валидации формы contacts

