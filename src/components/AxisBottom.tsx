import { ScaleLinear } from "d3-scale";
import { memo } from "react";

type AxisBottomProps = {
  xScale: ScaleLinear<number, number, never>;
  innerHeight: number;
  tickOffset: number;
  lineOffset: number;
};

export const AxisBottom = memo(
  ({
    xScale,
    innerHeight = 0,
    tickOffset = 0,
    lineOffset = 0,
  }: AxisBottomProps) => (
    <g className="axis-bottom">
      {xScale.ticks().map((tickValue) => (
        <g
          className="tick"
          key={tickValue}
          transform={`translate(${xScale(tickValue)},0)`}
        >
          <line y2={innerHeight + lineOffset} />

          <text
            style={{ textAnchor: "middle" }}
            dy=".71em"
            y={innerHeight + lineOffset + tickOffset}
          >
            {tickValue + 1}
          </text>
        </g>
      ))}
    </g>
  )
);

AxisBottom.displayName = "AxisBottom";
