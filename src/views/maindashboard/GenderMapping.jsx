import React from "react";
import { Row, Card } from "@/components/reactdash-ui";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenderMapping(props) {
  const data1 = {
    labels: props?.label || [],
    datasets: [
      {
        label: "Gender Mapping",
        data: props?.dataset || [],
        backgroundColor: [
          "#AC0A6D",
          "#FACBD5",
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
        display: false,
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card className="h-full">
      <Row className="justify-between pb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{props.title}</h3>
        </div>
      </Row>

      <div className="flex flex-col xl:flex-row gap-1">
        <div className="relative h-72 w-full xl:w-1/2">
          <Doughnut options={options1} data={data1} />
        </div>
        <div className="flex xl:flex-col justify-center gap-5 xl:w-1/2">
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 w-5 bg-primary-color rounded-full"></div>
            <div>
              <p className="text-base font-semibold">Laki-laki</p>
              <p className="font-bold text-base text-primary-color">
                {`${props?.dataset[0] || 0} Orang (${((props?.dataset[0] * props?.total) / 100).toFixed(0)}%)`}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 w-5 bg-secondary-color rounded-full"></div>
            <div>
              <p className="text-base font-semibold">Perempuan</p>
              <p className="font-bold text-base text-primary-color">
                {`${props?.dataset[1] || 0} Orang (${((props?.dataset[1] * props?.total) / 100).toFixed(0)}%)`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
