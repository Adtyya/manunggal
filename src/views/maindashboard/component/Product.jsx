import React from "react";
import { ChatDots, Eye, HandThumbsUp } from "react-bootstrap-icons";
import { Column, Row, Card } from "@/components/reactdash-ui";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import GetPercent from "./GetPercent";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TotalProduct(props) {
  // Data percent (props.datapercent)
  const datapercent = {
    newData: props.total,
    iconPercent: <ChatDots />,
  };

  return (
    <Card className="h-full">
      <Row className="items-center w-full">
        <Column className="w-2/3">
          <small className="font-bold">Product</small>
          <h5 className="text-gray-500 mb-1">Total Product</h5>
          <GetPercent datapercent={datapercent} />
        </Column>
        <Column className="w-max">
          <img alt="eye" src="/img/dashboard/chat.png" height={60} width={60} />
        </Column>
      </Row>
    </Card>
  );
}
