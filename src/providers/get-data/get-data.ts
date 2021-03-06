import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../model/product.model';
import { CachcingServiceBase } from '../caching.service';
import { Category } from '../../model/category.model';
import { Offer} from '../../model/offer.model';
import { Store } from '../../model/store.model'

/*
  Generated class for the GetDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let count = 0;
@Injectable()
export class GetDataProvider extends CachcingServiceBase {
  public products: Observable<Product[]>;
  public categories: Observable<Category[]>;
  public offers:Observable<Offer[]>;
  public stores:Observable<Store[]>;
  public constructor(private http: Http) {
    super();
  }

  // public allProduct(): Observable<Product[]> 
  // { 
   
  //    return this.cache<Product[]>(() => this.products,
  //     (val: Observable<Product[]>) => this.products = val,
  //     () => this.http
  //       .get("./assets/data/BJPProducts.json")
  //       .map((response) => response.json()
  //         .map((item) => {
  //           let model = new Product();
  //           model.updateFrom(item);
  //         return model;
  //         })));
  //       //  return this.cache<Product[]> 
  // }

public menuArry = [];

public allProduct()
  {  
     return this.http.get("./assets/data/BJPProducts.json").map(response =>
      response.json()
      .map((item) => 
      {
         return item;
         //return this.menuArry;
      })); 
  }


  public allCategory(): Observable<Category[]> {
    return this.cache<Category[]>(() => this.categories,
      (val: Observable<Category[]>) => this.categories = val,
      () => this.http
        .get("./assets/data/BJPCategory.json")
        .map((response) => response.json()
          .map((item) => {
            let model = new Category();
            model.updateFrom(item);
                return model;
          })));
  
  }
  public allOffers(): Observable<Offer[]> {
    return this.cache<Offer[]>(() => this.offers,
      (val: Observable<Offer[]>) => this.offers = val,
      () => this.http
        .get("./assets/data/BJPOffers.json")
        .map((response) => response.json()
          .map((item) => {
            let model = new Offer();
            model.updateFrom(item);
                return model;
          })));
  
  }

  public allStores(): Observable<Store[]> {
    return this.cache<Store[]>(() => this.stores,
      (val: Observable<Store[]>) => this.stores = val,
      () => this.http
        .get("./assets/data/BJPStores.json")
        .map((response) => response.json()
          .map((item) => {
            let model = new Store();
            model.updateFrom(item);
                return model;
          })));
  
  }

//get data from customization json
public getCustomizationData()
  {  
     return this.http.get("./assets/data/BJPpizzaCustomization.json").map(response =>
      response.json()
      .map((customD) => 
      {
         return customD;
         //return this.menuArry;
      })); 
  }


}