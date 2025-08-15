import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportComponent } from "../../components/modals/report/report.component";
import { InfoReportComponent } from "../../components/modals/info-report/info-report.component";
import { ReportService } from '../../../../core/services/reports/report.service';
import { reports } from '../../../../core/stores/reports.store';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReportComponent, InfoReportComponent, LoaderElementsComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  showModal = false;
  showInfoModal = false;
  reports = computed(() => reports());
  loading = signal(true);
  selectedReportIndex: number | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.getReports();
  }

  deleteReport(reportIndex: number) {
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
        this.reportService.deleteReport(reportIndex).pipe(timeout(15000), take(1)).subscribe({
          next: (response) => {
            if (response.result) {
              Swal.fire({
                title: "Reporte eliminado!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              }).then((result) => {
                this.getReports();
              });
            }
          },
          error: (error: HttpErrorResponse | TimeoutError) => {
            console.log(error);
          }
        });
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
    this.selectedReportIndex = null;

    const infoReportBtn = document.getElementById('infoReportBtn');
    infoReportBtn?.focus();
  }
  
  openInfoModal(index: number) {
    this.selectedReportIndex = index;
    this.showInfoModal = true;
  }

  getReports() {
    this.reportService.getReports().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          reports.set(response.data);
          this.loading.set(false);
        } else {
          reports.set([]);
          this.loading.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        reports.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
  }
}
