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

  //FILTROS
  fromDateFilter = signal<string | null>(null);
  typeFilter = signal<string>('todo');
  toDateFilter = signal<string | null>(null);
  searchFilter = signal<string>('');

  private getYMD = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  filteredReports = computed(() => {
    const all = this.reports() || [];
    const from = this.fromDateFilter();
    const to = this.toDateFilter();
    const type = this.typeFilter();
    const search = this.searchFilter().trim();

    return all.filter((app: any) => {
      let ok = true;

      if (type !== 'todo' && type) {
        ok = ok && app.type?.toLowerCase() === type.toLowerCase();
      }

      const appDateStr = this.getYMD(app.date);

      if (from) {
        ok = ok && appDateStr >= from;
      }

      if (to) {
        ok = ok && appDateStr <= to;
      }

      if (search) {
        ok = ok && app.index.toString().includes(search);
      }

      return ok;
    });
  });

  // PAGINACION
  p = signal(1);
  perPage = 5;  

  paginatedReports = computed(() => {
    const start = (this.p() - 1) * this.perPage;
    return this.filteredReports().slice(start, start + this.perPage);
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredReports().length / this.perPage)
  );

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.getReports();
  }

  onSelectChange(event: Event, filter: 'status' | 'type') {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    if (filter === 'type') this.typeFilter.set(select.value);

    this.p.set(1);
  }

  onDateChange(event: Event, filter: 'from' | 'to') {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    if (filter === 'from') {
      this.fromDateFilter.set(input.value);

      const to = this.toDateFilter();
      if (to && to < input.value) {
        this.toDateFilter.set(input.value);
        const toEl = document.getElementById('toDate') as HTMLInputElement;
        if (toEl) toEl.value = input.value;
      }
    } else {
      this.toDateFilter.set(input.value);
    }

    this.p.set(1);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.searchFilter.set(input.value);

    this.p.set(1);
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
      }
    });
  }
}
