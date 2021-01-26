import React, { useMemo, useCallback } from "react";
import { Area, Bar } from "@visx/shape";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { max, extent, bisector } from "d3-array";
import { timeFormat } from "d3-time-format";
type TooltipData = AppleStock;
// const stock = appleStock.slice(1200);
// console.log('==:', stock)
export const background = "#ffffff";
export const background2 = "#ffffff";
export const accentColor = "#000";
export const accentColorDark = "#75daad";
const tooltipStyles = {
  ...defaultStyles,
  border: "2px solid #3586ff",
  borderRadius: "3px",
  color: "#3586ff"
};
const chartData = {
  data: {
    "contract_decimals": 18,
    "contract_name": "Uniswap",
    "contract_ticker_symbol": "UNI",
    "contract_address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "logo_url": "https://logos.covalenthq.com/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
    "quote_currency": "USD",
     prices: [
      {
        date: "2021-01-01",
        price: 14.7661986
      },
      {
        date: "2020-12-31",
        price: 51.1154914
      },
      {
        date: "2020-12-30",
        price: 4.1594906
      },
      {
        date: "2020-12-29",
        price: 31.7173963
      },
      {
        date: "2020-12-28",
        price: 25.7365217
      },
      {
        date: "2020-12-25",
        price: 38.7365217
      },
      {
        date: "2020-12-22",
        price: 55.7365217
      }
    ]
  },
  "error": false,
  "error_message": null,
  "error_code": null
};
const stock = chartData.data.prices;
// util
const formatDate = timeFormat("%b %d, '%y");
// accessors
type chartDataType = {
  date: string,
  price: number
};
const getDate = (d: chartDataType) => new Date(d.date);
const getStockValue = (d: chartDataType) => d.price;
const bisectDate = bisector<chartDataType, Date>((d) => new Date(d.date)).left;
export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};
export default withTooltip<AreaProps, chartDataType>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0
  }: AreaProps & WithTooltipProvidedProps<chartDataType>) => {
    if (width < 10) return null;
    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date]
        }),
      [innerWidth, margin.left]
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
          nice: true
        }),
      [margin.top, innerHeight]
    );
    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d))
        });
      },
      [showTooltip, stockValueScale, dateScale]
    );
    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            color={accentColor}
            toOpacity={1}
          />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            strokeOpacity={0}
            pointerEvents="none"
          />
          <Area<chartDataType>
            data={chartData.data.prices}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            strokeWidth={4}
            stroke="#3586ff"
            fill="url(#area-gradient)"
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={5}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill="#3586ff"
                stroke="#3586ff"
                strokeWidth={12}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)"
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);