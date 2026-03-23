import { useMemo, useRef, useState } from "react";
import useWeatherStore from "../../../store/weatherStore";
import {
  getWeatherDescription,
  getWeatherIcon,
} from "../../../constants/weatherConstants";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { DaysDropdown, HourlyWeatherCard } from ".";

const HOURS_IN_A_DAY = 24;
const VISIBLE_SKELETON_COUNT = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const HourlyForecast = () => {
  const { t, i18n } = useTranslation();
  const listRef = useRef();

  const isFetching = useWeatherStore((state) => state.isFetching);
  const { current, hourly } =
    useWeatherStore((state) => state.weatherData) || {};

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Combine into a single array of objects
  const hourlyForecasts = useMemo(() => {
    if (!hourly) {
      return [];
    }

    const hourlyData = hourly.time.map((time, index) => ({
      time: time,
      weather_code: hourly.weather_code[index],
      temperature_2m: hourly.temperature_2m[index],
    }));

    const chunks = [];
    // Split into chunks of 24 (24 hours in a day)
    for (let i = 0; i < hourlyData.length; i += HOURS_IN_A_DAY) {
      chunks.push(hourlyData.slice(i, i + HOURS_IN_A_DAY));
    }
    return chunks;
  }, [hourly]);

  // Get the forecast data for the selected day and filter past hours for 'Today'
  const selectedDayData = useMemo(() => {
    if (hourlyForecasts.length === 0) return [];

    const day = hourlyForecasts[selectedDayIndex];

    if (!day) return [];

    const currentHour = new Date(current?.time ?? Date.now()).getHours();

    if (selectedDayIndex === 0) {
      return day.filter((hourData) => {
        const forecastHour = new Date(hourData.time).getHours();
        return forecastHour >= currentHour;
      });
    }

    return day;
  }, [current, hourlyForecasts, selectedDayIndex]);

  return (
    <section className="widget_bg" aria-labelledby="hourly-forecast-heading">
      <div className="flex justify-between items-center">
        <h3
          id="hourly-forecast-heading"
          className="text-preset-5 text-(--neutral-000) not-dark:text-(--neutral-900)"
        >
          {t("weather.hourly_forecast")}
        </h3>
        <DaysDropdown
          hourlyForecasts={hourlyForecasts}
          selectedDayIndex={selectedDayIndex}
          setSelectedDayIndex={setSelectedDayIndex}
        />
      </div>

      <motion.ul
        key={selectedDayIndex}
        ref={listRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="list"
        className="flex flex-col gap-4 overflow-y-auto scrollable_container py-2"
      >
        {isFetching || selectedDayData.length === 0
          ? Array(VISIBLE_SKELETON_COUNT)
              .fill(null)
              .map((_, index) => (
                <HourlyWeatherCard
                  key={`skeleton-${index}`}
                  isFetching={isFetching}
                  index={index}
                  icon={null}
                  time={null}
                  min_temp={null}
                  scrollRootRef={null}
                  altText={t("weather.loading")}
                />
              ))
          : selectedDayData.map((hourData, index) => {
              const weatherCode = hourData.weather_code;
              return (
                <HourlyWeatherCard
                  key={hourData.time}
                  index={index}
                  scrollRootRef={listRef}
                  icon={hourData ? getWeatherIcon(hourData.weather_code) : null}
                  altText={getWeatherDescription(weatherCode)}
                  time={
                    hourData
                      ? new Date(hourData.time).toLocaleTimeString([], {
                          hour: "numeric",
                          hour12: true,
                        })
                      : ""
                  }
                  min_temp={
                    hourData ? `${Math.round(hourData.temperature_2m)}°` : ""
                  }
                />
              );
            })}
      </motion.ul>
    </section>
  );
};

export default HourlyForecast;
