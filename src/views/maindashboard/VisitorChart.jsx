import React from 'react';
import { Card } from '@/components/reactdash-ui';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

export default function VisitorChart(props) {
  // Chart color
  const color_primary = '#AC0A6D';
  // Convert HEX TO RGBA color
  function hexToRGBA(hex, opacity) {
    if (hex != null) {
      return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) { return parseInt(hex.length % 2 ? l + l : l, 16) }).concat(isFinite(opacity) ? opacity : 1).join(',') + ')';
    }
  }

  // Chart data 1 (props.data1)
  const data1 = {
    labels: props?.label || [],
    datasets: (props?.dataset || []).map((dataset, index) => ({
      label: dataset?.title || `Dataset ${index + 1}`,
      data: dataset?.data || [],
      fill: {
        target: 'origin'
      },
      borderColor: dataset?.color || color_primary,
      backgroundColor: hexToRGBA(dataset?.color || color_primary, 0.2),
      tension: 0.3,
      pointBackgroundColor: dataset?.color || color_primary,
      pointBorderWidth: 0,
      pointHitRadius: 30,
      pointHoverBackgroundColor: dataset?.color || color_primary,
      pointHoverRadius: 5,
      pointRadius: 0
    }))
  };
  // Chart option (props.options)
  const options1 = {
    animation: {
      scales: {
        y: {
          duration: 2000,
          from: 500
        }
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          borderDash: [4, 4]
        },
        min: 0,
        // ticks: {
        //   stepSize: 1,
        // },
      }
    }
  };

  return (
    <Card className="h-full">
      <h3 className="text-base font-bold">{props.title}</h3>

      <div className="relative pt-2">
        <Line options={options1} data={data1} className="max-w-100" />
      </div>
    </Card>
  );
}