import { Component, OnInit } from '@angular/core';
import {Equipo} from '../../models/equipo';
import {EquiposService} from '../../services/equipos.service';
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";


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
  AccionABM = "L"; //INICIALMENTE INICIA EN EL LISTADO DE EQUIPOS
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };
  FormRegEq: FormGroup;
  constructor( public formbuilder: FormBuilder,
    private equiposService: EquiposService,
    private modalDialogService: ModalDialogService) {
   }

  ngOnInit() {
    this.GetEquipos();
    this.FormRegEq = this.formbuilder.group({
      EquipoNombre: [null],
      EquipoRanking: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      IdEquipo: [0]
    });
  }

  GetEquipos(){
    this.equiposService.get()
    .subscribe((res:Equipo[]) => {
      this.Items = res;
    });
  }

  Alta() {
    this.AccionABM = "A";
    this.FormRegEq.reset(this.FormRegEq.value);
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormRegEq.markAsUntouched();
  }

   // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABM) {
    window.scroll(0, 0); // ir al incio del scroll
    this.equiposService.getById(Dto.IdEquipo).subscribe((res: any) => {
      this.FormRegEq.patchValue(res);
      this.AccionABM = AccionABM;
    });
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
     if (this.FormRegEq.invalid) {
      return;
    }
    //hacemos una copia de los datos del formulario
    const itemCopy = { ...this.FormRegEq.value };
    // agregar post
    if (itemCopy.IdEquipo == 0 || itemCopy.IdEquipo == null) {
      this.equiposService.post(itemCopy).subscribe((res: any) =>{
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente');
      });
    } else {
      // modificar put
      this.equiposService
        .put(itemCopy.IdEquipo, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
        });
    }
  }
  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABM = "L";
  }

   // comienza la modificacion, luego la confirma con el metodo Grabar
  Editar(Dto) {
    this.submitted = false;
    this.FormRegEq.markAsPristine();
    this.FormRegEq.markAsUntouched();
    this.BuscarPorId(Dto, "M");
  }
    // representa la baja 
  Eliminar(Dto) {
   this.modalDialogService.Confirm(
      "Esta seguro de eliminar este registro?",
      undefined,
      undefined,
      undefined,
      () =>
        this.equiposService  
          .delete(Dto.IdEquipo)
          .subscribe((res: any) => 
            this.Buscar()
          ),
      this.modalDialogService.Alert("Registro eliminado correctamente"),
    );
    
  }
// Buscar segun los filtros, establecidos en FormReg
  Buscar() {
    this.equiposService
      .get()
      .subscribe((res: any) => {
      });
  }
}
