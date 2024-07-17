import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TrackingService } from '../../services/tracking.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CardModule, ChartModule, TooltipModule, ProgressSpinnerModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  data: any;
  options: any;

  constructor(
    private trackingService: TrackingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    /**
     * Fetches the percentage data for the last week and updates the chart data.
     *
     * Uses the trackingService to send a request to the server to fetch
     * percentage data for the last week. Upon receiving a successful response, it updates
     * the chart data structure with the received data. If an error occurs, it displays
     * an error message using the messageService.
     */
    this.trackingService.getLastWeekPercentages().subscribe({
      next: (weekData: number[]) => {
        this.data = {
          labels: ['Attendance', 'Absences', 'Delays', 'Early exits'],
          datasets: [
            {
              data: weekData,
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--orange-400'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--red-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--orange-300'),
              ],
            },
          ],
        };
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error retreiving last week data, please refresh the page or contact the technical support',
        });
        console.error(err.message);
      },
    });

    // chart initialization
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }
}
