import { async, inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { Product } from "../../model/product.model";
import { DeliveryOption } from "../../model/delivery-option.model";
import { DeliveryOptionsDataService } from "../../providers/delivery-options.service";
import { ShoppingCart } from "../../model/shopping-cart.model";
import { ShoppingCartService } from "../../providers/shopping-cart.service";
import { StorageService, LocalStorageServie } from "../../providers/storage.service";
import { CartItem } from "../../model/cart-item.model";
import { GetDataProvider } from "../../providers/get-data/get-data";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import * as sinon from "sinon";
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";
import { StoreFrontComponent } from "./store-front.component";

const PRODUCT_1 = new Product();
PRODUCT_1.ProductName = "Product 1";
PRODUCT_1.SrNo = "1";
PRODUCT_1.Price = 1;
PRODUCT_1.ProdDesc = "desc1";

const PRODUCT_2 = new Product();
PRODUCT_2.ProductName = "Product 2";
PRODUCT_2.SrNo = "2";
PRODUCT_2.Price = 2;
PRODUCT_2.ProdDesc = "desc2";

// tslint:disable-next-line:max-classes-per-file
class MockProductDataService extends GetDataProvider {
 // public all(): Observable<Product[]> {
   // return Observable.from([[PRODUCT_1, PRODUCT_2]]);
 // }
}

// tslint:disable-next-line:max-classes-per-file
class MockShoppingCartService {
  public unsubscriveCalled: boolean = false;
  public emptyCalled: boolean = false;

  private subscriptionObservable: Observable<ShoppingCart>;
  private subscriber: Observer<ShoppingCart>;
  private cart: ShoppingCart = new ShoppingCart();

  public constructor() {
    this.subscriptionObservable = new Observable<ShoppingCart>((observer: Observer<ShoppingCart>) => {
      this.subscriber = observer;
      observer.next(this.cart);
      return () => this.unsubscriveCalled = true;
    });
  }

  public addItem(product: Product, quantity: number): void {}

  public get(): Observable<ShoppingCart> {
    return this.subscriptionObservable;
  }

  public empty(): void {
    this.emptyCalled = true;
  }

  public dispatchCart(cart: ShoppingCart): void {
    this.cart = cart;
    if (this.subscriber) {
      this.subscriber.next(cart);
    }
  }
}

describe("StoreFrontComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingCartComponent,
        StoreFrontComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [
       { provide: GetDataProvider, useClass: MockProductDataService },
       { provide: DeliveryOptionsDataService, useValue: sinon.createStubInstance(DeliveryOptionsDataService) },
       { provide: StorageService, useClass: LocalStorageServie },
       { provide: ShoppingCartService, useClass: MockShoppingCartService }
     ]
    }).compileComponents();
  }));

  it("should create the component", async(() => {
    const fixture = TestBed.createComponent(StoreFrontComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it("should display all the products", async(() => {
    const fixture = TestBed.createComponent(StoreFrontComponent);
    fixture.detectChanges();

    const component = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    const productElements = compiled.querySelectorAll(".product-container");
    expect(productElements.length).toEqual(2);

    expect(productElements[0].querySelector(".js-product-name").textContent).toEqual(PRODUCT_1.ProductName);
    expect(productElements[0].querySelector(".js-product-price").textContent).toContain(PRODUCT_1.Price);
    expect(productElements[0].querySelector(".js-product-desc").textContent).toContain(PRODUCT_1.ProdDesc);

    expect(productElements[1].querySelector(".js-product-name").textContent).toEqual(PRODUCT_2.ProductName);
    expect(productElements[1].querySelector(".js-product-price").textContent).toContain(PRODUCT_2.Price);
    expect(productElements[1].querySelector(".js-product-desc").textContent).toContain(PRODUCT_2.ProdDesc);
  }));

  it("should not display the remove item button when the item is not in the cart", async(() => {
    const fixture = TestBed.createComponent(StoreFrontComponent);
    fixture.detectChanges();

    const component = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    const productElements = compiled.querySelectorAll(".product-container");
    expect(productElements.length).toEqual(2);

    expect(productElements[0].querySelector(".js-product-name").textContent).toEqual(PRODUCT_1.ProductName);
    expect(productElements[0].querySelector(".js-product-price").textContent).toContain(PRODUCT_1.Price);
    expect(productElements[0].querySelector(".js-product-desc").textContent).toContain(PRODUCT_1.ProdDesc);
    expect(productElements[0].querySelectorAll(".js-btn-remove").length).toEqual(0);
  }));

  it("should add the product to the cart when add item button is clicked",
     async(inject([ShoppingCartService], (service: MockShoppingCartService) => {
    const fixture = TestBed.createComponent(StoreFrontComponent);
    fixture.detectChanges();

    const addItemSpy = sinon.spy(service, "addItem");

    const component = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    const productElements = compiled.querySelectorAll(".product-container");

    productElements[0].querySelector(".js-btn-add").click();
    sinon.assert.calledOnce(addItemSpy);
    sinon.assert.calledWithExactly(addItemSpy, PRODUCT_1, 1);
  })));

  it("should remove the product from the cart when remove item button is clicked",
     async(inject([ShoppingCartService], (service: MockShoppingCartService) => {
    const newCart = new ShoppingCart();
    const cartItem = new CartItem();
    cartItem.productId = PRODUCT_1.SrNo;
    cartItem.quantity = 1;
    newCart.grossTotal = 1.5;
    newCart.items = [cartItem];
    service.dispatchCart(newCart);
    const fixture = TestBed.createComponent(StoreFrontComponent);
    fixture.detectChanges();

    const addItemSpy = sinon.spy(service, "addItem");

    const component = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    const productElements = compiled.querySelectorAll(".product-container");

    productElements[0].querySelector(".js-btn-remove").click();
    sinon.assert.calledOnce(addItemSpy);
    sinon.assert.calledWithExactly(addItemSpy, PRODUCT_1, -1);
  })));
});
