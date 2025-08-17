import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrdenService } from '../../../../core/services/orders/orden.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { take, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css'
})
export class OrderCardComponent {
  @Input() id: number = 0;
  @Input() purchase_date: string | null = null;
  @Input() price: number = 0;
  @Input() status: string = '';
  @Input() quantity: number = 0;
  @Input() photos: string[] = [];
  @Output() updated = new EventEmitter<void>();
  cancelOrderForm: FormGroup;

  constructor(private ordenService: OrdenService, private fb: FormBuilder, private router: Router) {
    this.cancelOrderForm = this.fb.group({
      'status': ['Cancelada']
    });
  }

  onOrderUpdated() {
    this.updated.emit();
  }

  confirmCancel() {
    Swal.fire({
      title: "¿Estas seguro de cancelar esta orden?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
         this.cancelOrder();
      }
    });
  }

  cancelOrder() {
    const data = this.cancelOrderForm.value;

    this.ordenService.cancelOrder(this.id, data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          if (response.result) {
            Swal.fire({
              title: "¡Orden cancelada!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
              }).then((result) => {
                this.updated.emit();
            });
          }
        }
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }

  goToDetails() {
    this.router.navigate(['dashboard/orders/detail', this.id]);
  }
}
