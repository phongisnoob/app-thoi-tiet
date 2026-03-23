import { useMemo } from "react";
import {
  IconDropletHalf2Filled,
  IconSunriseFilled,
  IconSunsetFilled,
  IconTemperature,
  IconWind,
  IconCloudRain,
  IconUvIndex,
  IconEye,
  IconGauge,
  IconCloudFilled,
} from "@tabler/icons-react";
import useWeatherStore from "../store/weatherStore";
import { formatTime, roundUp } from "../utils/helperUtils";
import { getUvLevel } from "../constants/weatherConstants";

/**
 * Builds a memoized list of display-ready weather details from the weather store.
 * Combines current metrics, daily times, and units into items with label, value, unit, and icon,
 * then splits them into essentials (first four) and extras (remaining).
 *
 * @returns {Object} The computed weather details.
 * @returns {Array} detailsData: All computed detail items
 * @returns {Array} essentials: first four core items
 * @returns {Array} extras: remaining items.
 */
const useWeatherDetails = () => {
  const { current } = useWeatherStore((state) => state.weatherData) || {};
  const { daily } = useWeatherStore((state) => state.weatherData) || {};
  const { current_units } = useWeatherStore((state) => state.weatherData) || {};

  // Memoize details data to avoid unnecessary recalculations
  const detailsData = useMemo(
    () => [
      {
        label: "Cảm giác như",
        value: roundUp(current?.apparent_temperature),
        unit: current_units?.temperature_2m || "°",
        icon: <IconTemperature className="text-red-500" />,
      },
      {
        label: "Độ ẩm",
        value: roundUp(current?.relative_humidity_2m),
        unit: current_units?.relative_humidity_2m || "%",
        icon: <IconDropletHalf2Filled className="text-blue-500" />,
      },
      {
        label: "Gió",
        value: roundUp(current?.wind_speed_10m),
        unit: current_units?.wind_speed_10m || "km/h",
        icon: <IconWind className="text-gray-500" />,
      },
      {
        label: "Lượng mưa",
        value: (current?.precipitation ?? 0).toFixed(1),
        unit: current_units?.precipitation || "mm",
        icon: <IconCloudRain className="text-sky-500" />,
      },
      {
        label: "Bình minh",
        value: formatTime(daily?.sunrise?.[0]),
        unit: "",
        icon: <IconSunriseFilled className="text-yellow-500" />,
        className: "md:col-span-2",
      },
      {
        label: "Hoàng hôn",
        value: formatTime(daily?.sunset?.[0]),
        unit: "",
        icon: <IconSunsetFilled className="text-red-700" />,
        className: "md:col-span-2",
      },
      {
        label: "Chỉ số UV",
        value: getUvLevel(current?.uv_index),
        unit: current_units?.uv_index || "",
        icon: <IconUvIndex className="text-amber-500" />,
      },
      {
        label: "Tầm nhìn",
        value: (current?.visibility / 1000 || 0).toFixed(1),
        unit: "km",
        icon: <IconEye className="text-indigo-500" />,
      },
      {
        label: "Áp suất không khí",
        value: roundUp(current?.surface_pressure),
        unit: current_units?.surface_pressure || "hPa",
        icon: <IconGauge className="text-stone-400" />,
      },
      {
        label: "Mây che phủ",
        value: roundUp(current?.cloud_cover),
        unit: current_units?.cloud_cover || "%",
        icon: <IconCloudFilled className="text-blue-400" />,
      },
    ],
    [current, current_units, daily]
  );
  const essentials = detailsData.slice(0, 4);
  const extras = detailsData.slice(4);

  return { detailsData, essentials, extras };
};

export default useWeatherDetails;
