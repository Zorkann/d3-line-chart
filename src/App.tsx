import "./styles.css";
import { useState, useRef, useMemo } from "react";
import { scaleLinear, extent } from "d3";
import { AxisBottom } from "./components/AxisBottom";
import { AxisLeft } from "./components/AxisLeft";
import { Tooltip } from "./components/Tooltip";
import { Line } from "./components/Line";
import { useResizeObserver } from "./useResizeObserver";
import { DATA_OBJ } from "./data";

const xLineOffset = 20;
const xTickOffset = 10;
const yLineOffset = 20;
const yTickOffset = 10;
const margin = {
  top: 40,
  right: 40,
  bottom: 40 + yLineOffset + yTickOffset,
  left: 40 + xLineOffset + xTickOffset,
};

export default function App() {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const { width, height } = useResizeObserver(svgContainerRef);

  return (
    <div className="App">
      <div className="ChartWrapper" ref={svgContainerRef}>
        {width && height ? <LineChart width={width} height={height} /> : null}
      </div>
    </div>
  );
}

function LineChart({ width, height }: { width: number; height: number }) {
  const [selectedLine, setSelectedLine] = useState<number>(0);
  const selectedPoint = selectedLine - 1;
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState(DATA_OBJ);

  const data1 = data.map((d) => d.line1);
  const data2 = data.map((d) => d.line2);
  const flatData = data.map((obj) => Object.values(obj)).flat();

  const widthInner = width - margin.left - margin.right;
  const heightInner = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, data.length - 1])
        .range([0, widthInner])
        .nice(),
    [data.length, widthInner]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain(extent(flatData) as [number, number])
        .range([heightInner, 0])
        .nice(),
    [flatData, heightInner]
  );

  const handleOnClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!svgRef.current) return;

    const { left } = svgRef.current.getBoundingClientRect();

    const selected = Math.round(
      xScale.clamp(true).invert(e.clientX - left - margin.left)
    );

    setSelectedLine((selectedLine) => {
      if (selected === selectedLine - 1) {
        return 0;
      }

      return selected + 1;
    });
  };

  return (
    <>
      <div className="Chart">
        <svg width={width} height={height} onClick={handleOnClick} ref={svgRef}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <AxisBottom
              xScale={xScale}
              innerHeight={heightInner}
              lineOffset={xLineOffset}
              tickOffset={xTickOffset}
            />
            <AxisLeft
              yScale={yScale}
              innerWidth={widthInner}
              lineOffset={yLineOffset}
              tickOffset={yTickOffset}
            />
            <line
              className="tooltip-line"
              opacity={selectedLine}
              y2={heightInner + xLineOffset}
              stroke="black"
              transform={`translate(${xScale(selectedPoint)},0)`}
            />
            <Line
              data={data1}
              yScale={yScale}
              xScale={xScale}
              stroke="#137b80"
              selectedPoint={selectedPoint}
            />
            <Line
              data={data2}
              yScale={yScale}
              xScale={xScale}
              stroke="purple"
              selectedPoint={selectedPoint}
            />
          </g>
        </svg>
        <Tooltip
          leftOffset={xScale(selectedPoint) + margin.left}
          values={data[selectedPoint]}
        />
      </div>
      <button
        onClick={() => setData(data.map((d) => ({ ...d, line1: d.line1 + 2 })))}
      >
        Update
      </button>
    </>
  );
}
