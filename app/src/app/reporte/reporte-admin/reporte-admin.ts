import { Component, OnInit, ViewChild } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';
import type { AgChartInstance } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-angular';
import { ReporteService } from '../../share/services/reporte.service';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-reporte-admin',
  standalone: false,
  templateUrl: './reporte-admin.html',
  styleUrl: './reporte-admin.css',
})
export class ReporteAdmin implements OnInit {
  chartOptionsTipo: any = {};
  chartOptionsProductos: any = {};
  chartOptionsUsuario: any = {};

  dataTipo: any[] = [];
  dataProductos: any[] = [];
  dataUsuario: any[] = [];

  @ViewChild('chartTipo') chartTipo!: AgCharts;
  @ViewChild('chartProductos') chartProductos!: AgCharts;
  @ViewChild('chartUsuario') chartUsuario!: AgCharts;

  constructor(private reporteService: ReporteService) {}

  ngOnInit() {
    this.reporteService.getVentasPorTipoTransaccion().subscribe((data: any[]) => {
      if (!data || data.length === 0) {
        return;
      }
      this.dataTipo = data;

      const metodos = Object.keys(data[0]).filter((key) => key !== 'fecha');

      const moneyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      const series: any[] = metodos.map((metodo) => ({
        type: 'bar',
        xKey: 'fecha',
        yKey: metodo,
        yName: this.prettyName(metodo),
        tooltip: {
          renderer: ({ datum }: any) => ({
            title: datum.fecha,
            data: [
              {
                label: this.prettyName(metodo),
                value: moneyFormatter.format(Number(datum[metodo]) || 0),
              },
            ],
          }),
        },
        showInLegend: true,
      }));

      this.chartOptionsTipo = {
        data,
        title: {
          text: 'Ventas por tipo de transacción',
          fontSize: 18,
        },
        subtitle: {
          text: 'Totales diarios por método de pago',
        },
        legend: {
          position: 'bottom',
        },
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: { text: 'Fecha' },
            label: { rotation: -45, autoRotate: false },
          },
          {
            type: 'number',
            position: 'left',
            title: { text: 'Monto' },
            label: {
              formatter: (params: any) =>
                params.value >= 1000 ? `$${(params.value / 1000).toFixed(1)}k` : `$${params.value}`,
            },
          },
        ],
        series,
      };
    });

    this.reporteService.getProductosPorVentas().subscribe((data: any[]) => {
      this.dataProductos = data;
      this.chartOptionsProductos = {
        data,
        title: { text: 'Productos por ventas' },
        subtitle: { text: 'Unidades vendidas por producto' },
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: { text: 'Producto' },
            label: {
              rotation: -45,
              autoRotate: true,
              minSpacing: 5,
            },
          },
          {
            type: 'number',
            position: 'left',
            title: { text: 'Cantidad vendida' },
            nice: true,
          },
        ],
        series: [
          {
            type: 'line',
            xKey: 'producto',
            yKey: 'cantidad',
            yName: 'Cantidad vendida',
            marker: {
              enabled: true,
              size: 6,
              shape: 'circle',
            },
            tooltip: {
              renderer: ({ datum }: any) => ({
                title: datum.producto,
                data: [{ label: 'Cantidad vendida', value: datum.cantidad }],
              }),
            },
          },
        ],
        legend: { enabled: true },
      };
    });

    this.reporteService.getVentasPorUsuario().subscribe((data: any[]) => {
      this.dataUsuario = data;
      const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const tooltipRenderer = ({ datum }: any) => ({
        title: datum.usuario,
        data: [
          { label: 'Total vendido', value: currencyFormatter.format(datum.total) },
          { label: 'Facturas', value: datum.cantidadFacturas },
        ],
      });

      this.chartOptionsUsuario = {
        data,
        title: { text: 'Ventas por usuario' },
        subtitle: { text: 'Total vendido y número de facturas por usuario' },
        axes: [
          {
            type: 'category',
            position: 'bottom',
            label: {
              rotation: -45,
              autoRotate: true,
              minSpacing: 8,
            },
            title: { text: 'Usuario' },
          },
          {
            type: 'number',
            position: 'left',
            key: 'totalAxis',
            title: { text: 'Total vendido' },
            label: {
              formatter: (params: { value: number }) =>
                currencyFormatter.format(params.value),
            },
          },
          {
            type: 'number',
            position: 'right',
            key: 'facturasAxis',
            title: { text: 'Facturas' },
          },
        ],
        series: [
          {
            type: 'line',
            xKey: 'usuario',
            yKey: 'total',
            yName: 'Total vendido',
            yAxisKey: 'totalAxis',
            marker: { enabled: true, size: 6 },
            tooltip: { renderer: tooltipRenderer },
          },
          {
            type: 'line',
            xKey: 'usuario',
            yKey: 'cantidadFacturas',
            yName: 'Facturas',
            yAxisKey: 'facturasAxis',
            marker: { enabled: true, size: 6 },
            tooltip: { renderer: tooltipRenderer },
          },
        ],
      };
    });
  }

  private prettyName(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  exportarExcelTipo(): void {
    this.exportarExcel(this.dataTipo, 'Ventas-por-tipo-transaccion', this.chartTipo?.chart);
  }

  exportarExcelProductos(): void {
    this.exportarExcel(this.dataProductos, 'Productos-por-ventas', this.chartProductos?.chart);
  }

  exportarExcelUsuario(): void {
    this.exportarExcel(this.dataUsuario, 'Ventas-por-usuario', this.chartUsuario?.chart);
  }

  exportarPowerBITipo(): void {
    this.exportarCSV(this.dataTipo, 'Ventas-por-tipo-transaccion');
  }

  exportarPowerBIProductos(): void {
    this.exportarCSV(this.dataProductos, 'Productos-por-ventas');
  }

  exportarPowerBIUsuario(): void {
    this.exportarCSV(this.dataUsuario, 'Ventas-por-usuario');
  }

  private async exportarExcel(
    data: any[],
    nombreArchivo: string,
    chart?: AgChartInstance,
  ): Promise<void> {
    if (!data || data.length === 0) {
      return;
    }

    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet('Datos');

    const headers = Object.keys(data[0]);
    hoja.addRow(headers);
    data.forEach((fila) => hoja.addRow(headers.map((h) => fila[h])));
    hoja.getRow(1).font = { bold: true };
    hoja.getRow(1).alignment = { vertical: 'middle' };
    hoja.columns.forEach((col, i) => {
      const ancho = Math.max(headers[i]?.length || 0, ...data.map((f) => String(f[headers[i]] ?? '').length));
      col.width = Math.max(ancho + 2, 10);
    });

    if (chart) {
      try {
        const dataUrl = await chart.getImageDataURL();
        const base64 = dataUrl.split(',')[1];
        const imageId = libro.addImage({ base64, extension: 'png' });
        const filaImagen = headers.length + 2;
        hoja.addImage(imageId, {
          tl: { col: 0, row: filaImagen },
          ext: { width: 640, height: 420 },
        });
      } catch (e) {
        console.error('No se pudo incrustar la gráfica en el Excel', e);
      }
    }

    const buffer = await libro.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private exportarCSV(data: any[], nombreArchivo: string): void {
    if (!data || data.length === 0) {
      return;
    }
    const hoja = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(hoja);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
