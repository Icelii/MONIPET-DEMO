import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportComponent } from "../../components/modals/report/report.component";
import { InfoReportComponent } from "../../components/modals/info-report/info-report.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReportComponent, InfoReportComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  showModal = false;
  showInfoModal = false;

  constructor() {}

  ngOnInit() {}

  deletePet() {
    Swal.fire({
      title: "¿Estás seguro de que quieres eliminar este reporte?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  onModalClosed() {
    this.showModal = false;

    const reportBtn = document.getElementById('reportModalBtn');
    reportBtn?.focus();
  }

  onInfoModalClosed() {
    this.showInfoModal = false;

    const infoReportBtn = document.getElementById('infoReportBtn');
    infoReportBtn?.focus();
  }
}
