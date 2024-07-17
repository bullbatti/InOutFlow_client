import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { TrackingService } from '../../services/tracking.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CardModule, ChartModule, TooltipModule, ProgressSpinnerModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  data: any;
  options: any;
  currentLabels: string[] = [];
  labels: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    private trackingService: TrackingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // initializating chart
    const documentStyle = getComputedStyle(document.documentElement);
    const documentStyleSecond = getComputedStyle(document.documentElement);
    const textColorSecond = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    /**
     * Fetches the percentage data for the current year and updates the bar chart data.
     *
     * Uses the trackingService to send a request to the server to fetch
     * percentage data for the current year. Upon receiving a successful response, it updates
     * the bar chart data structure with the received data. If an error occurs, it displays
     * an error message using the messageService. Additionally, it configures the options for the chart.
     */
    this.trackingService.getCurrentYearPercentages().subscribe({
      next: (resp: number[]) => {
        this.currentMonthLabels();

        this.data = {
          labels: this.currentLabels,
          datasets: [
            {
              type: 'bar',
              label: 'Attendance',
              backgroundColor:
                documentStyleSecond.getPropertyValue('--blue-500'),
              data: resp[0],
            },
            {
              type: 'bar',
              label: 'Absences',
              backgroundColor:
                documentStyleSecond.getPropertyValue('--red-500'),
              data: resp[1],
            },
            {
              type: 'bar',
              label: 'Delays',
              backgroundColor:
                documentStyleSecond.getPropertyValue('--yellow-500'),
              data: resp[2],
            },
            {
              type: 'bar',
              label: 'Early exits',
              backgroundColor:
                documentStyleSecond.getPropertyValue('--orange-500'),
              data: resp[3],
            },
          ],
        };
      },

      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error retreiving current year data, please refresh the page or contact the technical support',
        });
        console.error(err.message);
      },
    });

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            usePointStyle: true,
            color: textColorSecond,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  currentMonthLabels() {
    const currentMonth = new Date().getMonth();
    for (let i = 0; i <= currentMonth; ++i) {
      this.currentLabels.push(this.labels[i]);
    }
  }
}
