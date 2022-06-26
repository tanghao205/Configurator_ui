import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderForm } from '../models/orderForm';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private readonly http: HttpClient
  ) { }

  private url = 'http://localhost:8080/order/';

  getModel(){
    return this.http.get<any[]>(`${this.url}model`);
  }

  getOption(modelform: any){
    return this.http.post<any[]>(`${this.url}option`, modelform);
  }

  placeOrder(orderForm: OrderForm){
    return this.http.post<any>(`${this.url}placeOrder`, orderForm);
  }

}
