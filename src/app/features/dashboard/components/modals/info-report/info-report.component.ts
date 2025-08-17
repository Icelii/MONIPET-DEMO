import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReportService } from '../../../../../core/services/reports/report.service';
import { report } from '../../../../../core/stores/reports.store';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderElementsComponent } from '../../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-info-report',
  standalone: true,
  imports: [CommonModule, LoaderElementsComponent],
  templateUrl: './info-report.component.html',
  styleUrl: './info-report.component.css'
})
export class InfoReportComponent {
  @Input() isOpen = false;
   @Input() reportIndex: number | null = null; 
  @Output() closed = new EventEmitter<void>();
  reportInfo = computed(() => report());
  loading = signal(true);
  showModal = false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
  /*  if (this.reportIndex !== null) {
      this.getReport();
    } */
  }

  ngOnChanges() {
    if (this.reportIndex !== null) {
      this.getReport();
    }
  }

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

  getReport() {
    this.reportService.getReport(this.reportIndex).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          report.set(response.data);
          //console.log('REPORTE INFO: ', report());
          this.loading.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
      }
    });
  }

}
