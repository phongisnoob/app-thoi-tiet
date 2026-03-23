import { useCallback, useMemo, useState } from "react";
import useWeatherStore from "../store/weatherStore";

/**
 * Derives user-facing weather alerts from current conditions and unit preferences in useWeatherStore.
 * Produces unit-aware warnings for extreme heat, freezing, heavy rain, strong wind, high UV, and poor visibility,
 * and omits any alerts the user has dismissed. Recomputes when weather data or temperature unit changes.
 *
 * @returns {Array} activeAlerts: array of active alert objects; 
 * @returns {Function} dismissAlert: function to mark an alert id as dismissed.
 */
const useWeatherAlerts = () => {
  const weatherData = useWeatherStore((state) => state.weatherData);
  const units = useWeatherStore((state) => state.units);

  const [dismissed, setDismissed] = useState([]);

  const current = weatherData?.current;

  const activeAlerts = useMemo(() => {
    if (!current || current.apparent_temperature === undefined) {
      return [];
    }

    const isMetric = units?.temperature_unit === "celsius";

    const displayUnit = isMetric ? "°C" : "°F";
    const displayTemp = Math.round(current.apparent_temperature);

    const alerts = [];

    const HEAT_THRESHOLD = isMetric ? 35 : 95;
    const FREEZING_THRESHOLD = isMetric ? 0 : 32;
    const RAIN_THRESHOLD = isMetric ? 5 : 0.2;
    const RAIN_UNIT = isMetric ? "mm" : "inches";
    const WIND_THRESHOLD = isMetric ? 40 : 25;
    const WIND_UNIT = isMetric ? "km/h" : "mph";
    const VISIBILITY_THRESHOLD = 1000;
    const VISIBILITY_UNIT = "km";

    // Extreme temperature
    if (current.apparent_temperature > HEAT_THRESHOLD) {
      alerts.push({
        id: "extreme-heat",
        title: "🌡️ Cảnh báo nắng nóng",
        message: `Nhiệt độ cảm nhận là ${displayTemp}${displayUnit}. Hãy uống đủ nước và tránh tiếp xúc lâu với ánh nắng mặt trời.`,
        color: "bg-red-700",
        borderColor: "border-red-500",
      });
    } else if (current.apparent_temperature <= FREEZING_THRESHOLD) {
      alerts.push({
        id: "freezing",
        title: "🥶 Nhiệt độ đóng băng",
        message: `Nhiệt độ cảm nhận là ${displayTemp}${displayUnit}. Hãy mặc đủ ấm!`,
        color: "bg-blue-700",
        borderColor: "border-blue-500",
      });
    }

    // Heavy rain
    if (current.precipitation > RAIN_THRESHOLD) {
      alerts.push({
        id: "heavy-rain",
        title: "🌧️ Cảnh báo mưa lớn",
        message: `Lượng mưa đạt ${current.precipitation.toFixed(
          1
        )}${RAIN_UNIT}. Đừng quên mang theo ô/dù!`,
        color: "bg-blue-600",
        borderColor: "border-blue-400",
      });
    }

    if (current.wind_speed_10m > WIND_THRESHOLD) {
      alerts.push({
        id: "strong-wind",
        title: "💨 Cảnh báo gió giật mạnh",
        message: `Tốc độ gió lúc này là ${Math.round(
          current.wind_speed_10m
        )} ${WIND_UNIT}. Hãy chằng chống đồ vật cẩn thận.`,
        color: "bg-orange-700",
        borderColor: "border-orange-500",
      });
    }

    // High UV
    if (current.uv_index > 7) {
      alerts.push({
        id: "high-uv",
        title: "☀️ Chỉ số UV cao",
        message: `Chỉ số UV: ${current.uv_index}. Hãy thoa kem chống nắng và mặc áo khoác bảo vệ.`,
        color: "bg-yellow-800",
        borderColor: "border-yellow-600",
      });
    }

    // Poor visibility
    if (current.visibility < VISIBILITY_THRESHOLD) {
      alerts.push({
        id: "poor-visibility",
        title: "🌁 Tầm nhìn hạn chế",
        message: `Tầm nhìn dưới ${
          VISIBILITY_THRESHOLD / 1000
        } ${VISIBILITY_UNIT}. Hãy lái xe cẩn thận!`,
        color: "bg-gray-700",
        borderColor: "border-gray-500",
      });
    }

    return alerts.filter((a) => !dismissed.includes(a.id));
  }, [current, dismissed, units?.temperature_unit]);

  const dismissAlert = useCallback((id) => {
    setDismissed((prev) => [...prev, id]);
  }, []);

  return { activeAlerts, dismissAlert };
};

export default useWeatherAlerts;
