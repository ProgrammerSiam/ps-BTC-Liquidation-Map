import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { FiRefreshCw } from "react-icons/fi";

const TradingChart = () => {
  // Play/pause state (UI only)
  const [playing, setPlaying] = useState(false);

  // Generate sample candlestick data
  const generateCandlestickData = () => {
    const data = [];
    const volumeData = [];
    let basePrice = 105000;

    for (let i = 0; i < 100; i++) {
      const open = basePrice + (Math.random() - 0.5) * 2000;
      const close = open + (Math.random() - 0.5) * 1500;
      const high = Math.max(open, close) + Math.random() * 800;
      const low = Math.min(open, close) - Math.random() * 800;

      data.push([open, close, low, high]);
      volumeData.push(Math.random() * 100000000 + 10000000);
      basePrice = close;
    }

    return { candlestick: data, volume: volumeData };
  };

  // Generate horizontal bar overlays (liquidation levels)
  const generateHorizontalBars = () => {
    // Each bar: {start, end, price, value}
    const bars = [];
    for (let i = 0; i < 65; i++) {
      const start = Math.floor(Math.random() * 80);
      const end = start + Math.floor(Math.random() * 20) + 5;
      const price = 101000 + Math.random() * 12500;
      const value = Math.random() * 137520000;
      bars.push({ start, end: Math.min(end, 99), price, value });
    }
    return bars;
  };

  const { candlestick, volume } = generateCandlestickData();
  const horizontalBars = generateHorizontalBars();

  // Generate time axis
  const timeAxis = Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (100 - i) * 5);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  const option = {
    backgroundColor: "#16151F",
    grid: [
      {
        left: 60,
        right: 70,
        top: 24,

        bottom: 110,
        height: "65%",
      },
      {
        left: 60,
        right: 70,
        top: "80%",
        height: 60,
      },
    ],
    xAxis: [
      {
        type: "category",
        data: timeAxis,
        scale: true,
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: "#8392a5",
          fontSize: 10,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#23263a",
            width: 0.5,
          },
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: timeAxis,
        scale: true,
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        scale: true,
        min: 101000,
        max: 113500,
        position: "right",
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: "#8392a5",
          fontSize: 10,
          align: "right",
          margin: 16,
          fontWeight: 500,
          formatter: (value: number) => value.toFixed(0),
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#23263a",
            width: 0.5,
          },
        },
      },
      {
        scale: true,
        gridIndex: 1,
        position: "right",
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    visualMap: {
      show: true,
      type: "continuous",
      min: 0,
      max: 137520000,
      calculable: false,
      orient: "vertical",
      left: 16,
      top: 24,
      bottom: 120,
      inRange: {
        color: [
          "#440A5E",
          "#27778F",
          "#219387",
          "#36B270",
          "#7ACC46",
          "#EBE22C",
        ],
      },
      text: ["137.52M", "0"],
      textStyle: {
        color: "#aaa",
        fontWeight: 500,
      },
      itemHeight: 520,
      itemWidth: 27,
      padding: 0,
    },
    series: [
      // Horizontal bars (liquidation levels)
      {
        name: "Liquidation Leverage",
        type: "custom",
        renderItem: function (params: any, api: any) {
          const bar = horizontalBars[params.dataIndex];
          if (!bar) return null;
          const xStart = api.coord([bar.start, bar.price]);
          const xEnd = api.coord([bar.end, bar.price]);
          const barHeight = 3;
          return {
            type: "rect",
            shape: {
              x: xStart[0],
              y: xStart[1] - barHeight / 2,
              width: xEnd[0] - xStart[0],
              height: barHeight,
            },
            style: api.style({
              fill: api.visual("color"),
              opacity: 0.85,
            }),
          };
        },
        data: horizontalBars,
        encode: {
          tooltip: ["price", "value"],
        },
        itemStyle: {
          borderWidth: 0,
        },
        z: 2,
      },
      // Candlestick series
      {
        name: "Supercharts",
        type: "candlestick",
        data: candlestick,
        itemStyle: {
          color: "#00ff6a",
          color0: "#ff3b3b",
          borderColor: "#00ff6a",
          borderColor0: "#ff3b3b",
          borderWidth: 1,
        },
        barMaxWidth: 8,
        z: 3,
      },
      // Volume line series at the bottom
      {
        name: "Volume",
        type: "line",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volume,
        lineStyle: {
          color: "#4fc3f7",
          width: 1,
        },
        showSymbol: false,
        areaStyle: {
          color: "rgba(79, 195, 247, 0.04)",
        },
        z: 1,
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        lineStyle: {
          color: "#8392a5",
          type: "dashed",
        },
      },
      backgroundColor: "rgba(10, 14, 39, 0.9)",
      borderColor: "#2a2e43",
      textStyle: {
        color: "#ffffff",
      },
      extraCssText: "border-radius: 10px;",
      formatter: function (params: any) {
        const candleData = params.find(
          (p: any) => p.seriesName === "Supercharts"
        );
        const volumeData = params.find((p: any) => p.seriesName === "Volume");
        const barData = params.find(
          (p: any) => p.seriesName === "Liquidation Leverage"
        );
        let html = '<div style="padding: 8px;">';
        if (candleData && candleData.data) {
          // Add custom marker (G) as a circle
          html += `<div style=\"display:flex;align-items:center;margin-bottom:4px;\"><span style=\"display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#2a2e43;color:#fff;border-radius:50%;font-weight:bold;margin-right:8px;box-shadow:0 2px 8px #0002;\">G</span>Supercharts</div>`;
          const [open, close, low, high] = candleData.data;
          html += `<div>Open: ${open.toFixed(2)}</div>`;
          html += `<div>Close: ${close.toFixed(2)}</div>`;
          html += `<div>High: ${high.toFixed(2)}</div>`;
          html += `<div>Low: ${low.toFixed(2)}</div>`;
        }
        if (barData && barData.data) {
          html += `<div>Liquidation: ${barData.data.value.toFixed(2)}</div>`;
        }
        if (volumeData) {
          html += `<div>Volume: ${volumeData.data.toFixed(0)}</div>`;
        }
        html += "</div>";
        return html;
      },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 50,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
        backgroundColor: "#1a1e33",
        fillerColor: "rgba(135, 146, 165, 0.2)",
        borderColor: "#2a2e43",
        handleIcon:
          "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        textStyle: {
          color: "#8392a5",
        },
      },
    ],
    legend: {
      data: [
        {
          name: "Liquidation Leverage",
          icon: "rect",
          itemStyle: { color: "#35407A" },
        },
        {
          name: "Supercharts",
          icon: "rect",
          itemStyle: { color: "#0DCB81" },
        },
      ],
      top: 0,

      // right: 50,
      left: "center",
      textStyle: {
        color: "#B6B7C9",
        fontSize: 14,
        fontWeight: 400,
      },
      itemWidth: 14,
      itemHeight: 10,
    },
  };

  return (
    <div className="w-full h-screen  bg-[#06050F]">
      <div className="relative h-full bg-[#06050F] ">
        <div className="flex flex-col items-start justify-between px-6 pt-6 mb-2 md:flex-row">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-[16px]">
              <span
                className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#181823]"
                style={{ border: "1px solid #B6B7C9" }}
              >
                <span
                  className="text-[22px] font-bold text-[#B6B7C9]"
                  style={{ lineHeight: "0.9" }}
                >
                  !
                </span>
              </span>
              <h2 className="text-[24px] md:text-[30px]   leading-[37px] font-semibold text-white">
                Binance BTC/USDT Liquidation Heatmap
              </h2>
            </div>
            <div className="mb-2 text-[14px] leading-[17.5px]  text-[#B6B7C9]">
              Visualiza en tiempo real los niveles de liquidación más relevantes
              de BTC/USDT y detecta zonas de presión por apalancamiento en el
              mercado.
            </div>
          </div>
          <button
            className="w-[48px] h-[38px] flex items-center justify-center bg-[#16171A] rounded-lg shadow text-gray-300 hover:bg-[#23263a] focus:outline-none mt-1"
            title="Refresh"
          >
            <FiRefreshCw size={18} color="#fff" />
          </button>
        </div>

        <ReactECharts
          option={option}
          style={{ height: "calc(100% - 80px)", width: "100%" }}
          theme="dark"
        />
        {/* Play/Pause button at bottom left of volume chart */}
        <div className="absolute" style={{ zIndex: 10 }}>
          <button
            className="w-7 h-7 flex items-center justify-center bg-[#23263a] rounded-full shadow text-gray-300 hover:bg-[#2a2e43] focus:outline-none"
            title={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
            style={{ fontSize: 16 }}
          >
            {playing ? (
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <rect x="3" y="3" width="3" height="10" rx="1" />
                <rect x="10" y="3" width="3" height="10" rx="1" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <polygon points="3,2 14,8 3,14" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
