import React, { useState } from "react";
import { Row, Card } from "@/components/reactdash-ui";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrafficSource(props) {
  // Chart color
  const text_primary_500 = "#6366F1";
  const text_secondary_500 = "#EC4899";
  const text_green_500 = "#22C55E";
  const text_yellow_500 = "#F59E0B";
  // hex to rgba color
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
    labels: props?.label || [],
    datasets: [
      {
        label: "Payment Method used",
        data: props?.dataset || [],
        backgroundColor: [
          text_green_500,
          text_primary_500,
          hexToRGBA(text_primary_500, 0.6),
          text_yellow_500,
          hexToRGBA(text_yellow_500, 0.6),
          text_secondary_500,
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Chart option (props.options)
  const options1 = {
    animation: {
      delay: 1000,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const [isOptions, setOptions] = useState(options1);

  return (
    <Card className="h-full">
      <Row className="justify-between pb-6">
        <div className="flex flex-col">
          <h3 className="text-base font-bold">{props.title}</h3>
        </div>
      </Row>

      <div className="relative h-72 w-full">
        <Doughnut options={isOptions} data={data1} />
      </div>
    </Card>
  );
}
