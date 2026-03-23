import { useCallback, useMemo, useState } from "react";
import useWeatherStore from "../store/weatherStore";
import { useTranslation } from "react-i18next";

/**
 * Derives user-facing weather alerts from current conditions and unit preferences in useWeatherStore.
 * Produces unit-aware warnings for extreme heat, freezing, heavy rain, strong wind, high UV, and poor visibility,
 * and omits any alerts the user has dismissed. Recomputes when weather data or temperature unit changes.
 *
 * @returns {Array} activeAlerts: array of active alert objects; 
 * @returns {Function} dismissAlert: function to mark an alert id as dismissed.
 */
const useWeatherAlerts = () => {
  const { t, i18n } = useTranslation();
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
        title: t("alerts.extreme_heat"),
        message: t("alerts.extreme_heat_msg", { temp: displayTemp, unit: displayUnit }),
        color: "bg-red-700",
        borderColor: "border-red-500",
      });
    } else if (current.apparent_temperature <= FREEZING_THRESHOLD) {
      alerts.push({
        id: "freezing",
        title: t("alerts.freezing"),
        message: t("alerts.freezing_msg", { temp: displayTemp, unit: displayUnit }),
        color: "bg-blue-700",
        borderColor: "border-blue-500",
      });
    }

    // Heavy rain
    if (current.precipitation > RAIN_THRESHOLD) {
      alerts.push({
        id: "heavy-rain",
        title: t("alerts.heavy_rain"),
        message: t("alerts.heavy_rain_msg", { val: current.precipitation.toFixed(1), unit: RAIN_UNIT }),
        color: "bg-blue-600",
        borderColor: "border-blue-400",
      });
    }

    if (current.wind_speed_10m > WIND_THRESHOLD) {
      alerts.push({
        id: "strong-wind",
        title: t("alerts.strong_wind"),
        message: t("alerts.strong_wind_msg", { speed: Math.round(current.wind_speed_10m), unit: WIND_UNIT }),
        color: "bg-orange-700",
        borderColor: "border-orange-500",
      });
    }

    // High UV
    if (current.uv_index > 7) {
      alerts.push({
        id: "high-uv",
        title: t("alerts.high_uv"),
        message: t("alerts.high_uv_msg", { val: current.uv_index }),
        color: "bg-yellow-800",
        borderColor: "border-yellow-600",
      });
    }

    // Poor visibility
    if (current.visibility < VISIBILITY_THRESHOLD) {
      alerts.push({
        id: "poor-visibility",
        title: t("alerts.poor_visibility"),
        message: t("alerts.poor_visibility_msg", { val: (VISIBILITY_THRESHOLD / 1000), unit: VISIBILITY_UNIT }),
        color: "bg-gray-700",
        borderColor: "border-gray-500",
      });
    }

    return alerts.filter((a) => !dismissed.includes(a.id));
  }, [current, dismissed, units?.temperature_unit, i18n.language]);

  const dismissAlert = useCallback((id) => {
    setDismissed((prev) => [...prev, id]);
  }, []);

  return { activeAlerts, dismissAlert };
};

export default useWeatherAlerts;
