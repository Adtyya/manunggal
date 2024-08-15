import React from 'react';

export default function Progress(props) {
  // Progress percent
  const percent = props.percent + "%";
  const addClass = props.className ? ` ${props.className}` : '';

  return (
    <div className={`flex h-3 overflow-hidden bg-pink-100 rounded-lg mb-4${addClass}`}>
      <div
        className="progress-horizontal flex flex-col justify-center overflow-hidden text-white text-center whitespace-nowrap bg-primary-color"
        role="progressbar"
        style={{ width: `${percent}` }}
      />
    </div>
  );
}