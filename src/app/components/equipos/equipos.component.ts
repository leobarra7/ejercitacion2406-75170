import { Component, OnInit } from '@angular/core';
import {Equipo} from '../../models/equipo'

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  Items: Equipo[] = [];
  Titulo = "Equipos"
  submitted = false;
   TituloAccionABM = {
    A:"(Alta)",
    B:"(Eliminar)",
    M:"(Editar)",
    L:"(Listado)"
  };
  AccionABM = "L"; //INICIALMENTE INICIA EN EL LISTADO DE EMPRESAS
  constructor() { }

  ngOnInit() {
  }

}