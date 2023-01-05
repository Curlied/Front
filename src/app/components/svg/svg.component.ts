import { Component, OnInit,Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css'],
})
export class SvgComponent implements OnInit {
  
  icon! : string;

  @Input("icon") set setIcon(_icon:string){
    this.icon = environment.AdresseIcon + _icon
  };

  ngOnInit(): void {
  }

}
