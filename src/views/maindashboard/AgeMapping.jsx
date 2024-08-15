import React from 'react';
import { Card } from '@/components/reactdash-ui';
import Progress from './Progress';

export default function AgeMapping(props) {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold">{props.title}</h3>
      {props.label.map((item, i) => {
        const percent = props.dataset[i] ? ((props.dataset[i] / props.total) * 100).toFixed(0) : 0;
        return (
          <div className="relative mt-2 mb-6" key={i}>
            <div className="flex flex-row justify-between mb-3">
              <h4 className="font-semibold text-base">{item}</h4>
              <p className="font-bold text-base text-primary-color">{`${props.dataset[i]} (${percent}%)`}</p>
            </div>
            <div className="w-full h-4 rounded-full mt-2">
              <Progress percent={percent} color="primary" />
            </div>
          </div>
        )
      })}
    </Card>
  );
}