import { Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { OrderService } from './service/order.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private readonly orderService: OrderService) {}

  modelDisplayedColumns = ['checked', 'modelName'];
  optionDisplayedColumns = ['checked', 'option'];
  dataSource: any = null;
  optionDataSource: any = null;
  submitted = false;
  orderNumber = '';

  title="Configurator Tool"

  showModel = true;
  selectedModel = new Set();
  selectedOption = new Set();

  ngOnInit(): void {
    firstValueFrom(this.orderService.getModel()).then(
      (res) => {
        let data:any[] = []
        res.forEach(element => {
          let newModel = {checked: false, modelName: element.model, hightlighted: false};
          data.push(newModel);
        })
        this.dataSource = new MatTableDataSource(data);
      }
    )
  }


  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  onSelect(row: any) {
    row.highlighted = !row.highlighted;
    if (row.highlighted) {
      this.selectedModel.add(row.modelName);
    } else {
      this.selectedModel.delete(row.modelName);
    }
  }

  onOptionSelect(row: any) {
    row.highlighted = !row.highlighted;
    if (row.highlighted) {
      this.selectedOption.add(row.option);
    } else {
      this.selectedOption.delete(row.option);
    }
  }

  onSelectClick() {
    let array = Array.from(this.selectedModel);
    let modelForm = {model: array[0] as string}
    firstValueFrom(this.orderService.getOption(modelForm)).then(
      (res) => {
        let data:any[] = []
        res.forEach(element => {
          let newOption = {checked: false, option: element.optionName, hightlighted: false};
          data.push(newOption);
        })
        this.optionDataSource = new MatTableDataSource(data);
      }
    )
    this.showModel = false;
    this.dataSource.data.forEach((row: any) => {
      if (row.modelName === array[0] as string) {
        row.checked = false;
      }
    })
  }

  onOrderClick() {
    let modelArray = Array.from(this.selectedModel);
    let optionArray = Array.from(this.selectedOption);
    let orderForm = {model: modelArray[0] as string, optionList: optionArray as string[]}
    console.log(orderForm);
    firstValueFrom(this.orderService.placeOrder(orderForm)).then(
      (res) => {
        this.orderNumber = res.orderNumber;
        console.log(res)
        console.log(this.orderNumber)
      }
    )
    this.submitted = true;

  }

  onReturnClick() {
    this.showModel = true;
    this.selectedModel = new Set();
    this.selectedOption = new Set()
    this.dataSource.data.forEach((row: any) => {
        row.checked = false;
        row.highlighted = false;
    })
    this.optionDataSource.data.forEach((row: any) => {
      row.checked = false;
      row.highlighted = false;
    })
  }

  onConfirm() {
    this.submitted = false;
    this.orderNumber = '';
    this.onReturnClick();
  }

  getMdoel() {
    return Array.from(this.selectedModel)[0];
  }

}
