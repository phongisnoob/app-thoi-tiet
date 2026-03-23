import { motion } from "motion/react";

const DailyForecastCard = ({ day, icon, min_temp, max_temp, isFetching }) => {
  return (
    <div className="forecast">
      {isFetching ? (
        <>
          <div className="bg-black/10 dark:bg-white/10 motion-safe:animate-pulse h-7 w-2/3 rounded-full"></div>
          <div className="bg-black/10 dark:bg-white/10 motion-safe:animate-pulse h-10 w-10 rounded-full"></div>

          <div className="temp_range">
            <div className="bg-black/10 dark:bg-white/10 motion-safe:animate-pulse h-5 w-1/3 rounded-full"></div>
            <div className="bg-black/10 dark:bg-white/10 motion-safe:animate-pulse h-5 w-1/3 rounded-full"></div>
          </div>
        </>
      ) : (
        <>
          <p className="text-preset-6">{day}</p>
          {icon && (
            <motion.img
              initial={{ scale: 1, y: 0 }}
              animate={{ scale: 1.1, y: [-2, 2, -2] }}
              transition={{
                scale: { duration: 2.5, repeat: Infinity, repeatType: "reverse" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              alt="Weather icon"
              className="daily_icon"
              src={`/assets/images/weather/icon-${icon}.webp`}
            />
          )}
          <div className="temp_range">
            <span aria-label={`Minimum temperature for ${day}`}>{min_temp}</span>
            <span aria-label={`Maximum temperature for ${day}`}>{max_temp}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyForecastCard;
