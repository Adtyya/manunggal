import React, { useState } from "react";
import { ThreeDots } from "react-bootstrap-icons";
import { Menu } from "@headlessui/react";
import { Row, Card } from "@/components/reactdash-ui";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlySales(props) {
  // Chart color
  const text_primary_500 = "#6366F1";
  // Convert HEX TO RGBA color
  function hexToRGBA(hex, opacity) {
    if (hex != null) {
      return (
        "rgba(" +
        (hex = hex.replace("#", ""))
          .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
          .map(function (l) {
            return parseInt(hex.length % 2 ? l + l : l, 16);
          })
          .concat(isFinite(opacity) ? opacity : 1)
          .join(",") +
        ")"
      );
    }
  }

  // Chart data 1 (props.data1)
  const data1 = {
    labels: props.labelRange,
    datasets: [
      {
        label: props.label,
        data: props.dataset,
        backgroundColor: [hexToRGBA(text_primary_500, 0.6)],
        borderColor: [hexToRGBA(text_primary_500, 0.6)],
        borderWidth: 1,
      },
    ],
  };

  // Chart option (props.options)
  const options1 = {
    animation: {
      y: {
        duration: 2000,
        from: 500,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          borderDash: [4, 4],
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const [isOptions, setOptions] = useState(options1);

  return (
    <Card>
      <Row className="justify-between pb-6">
        <div className="flex flex-col">
          <h3 className="text-base font-bold">{props.title}</h3>
        </div>
      </Row>

      <div className="relative">
        <Bar options={isOptions} data={data1} className="max-w-100" />
      </div>
    </Card>
  );
}
