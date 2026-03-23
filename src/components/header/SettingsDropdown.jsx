import { memo, useCallback, useRef, useState } from "react";
import { Fragment } from "react";
import useWeatherStore from "../../store/weatherStore";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Dropdown, Gear } from "../basic/Icons";
import { useClickOutside } from "../../hooks";
import { SettingFieldset } from ".";



const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsDropdownRef = useRef();
  const { t } = useTranslation();

  const allFields = [
    {
      legend: t("nav.temp"),
      options: [
        { label: t("nav.celsius"), value: "celsius", type: "temperature_unit" },
        { label: t("nav.fahrenheit"), value: "fahrenheit", type: "temperature_unit" },
      ],
    },
    {
      legend: t("nav.wind"),
      options: [
        { label: t("nav.kmh"), value: "kmh", type: "wind_speed_unit" },
        { label: t("nav.mph"), value: "mph", type: "wind_speed_unit" },
      ],
    },
    {
      legend: t("nav.precip"),
      options: [
        { label: t("nav.mm"), value: "mm", type: "precipitation_unit" },
        { label: t("nav.inch"), value: "inch", type: "precipitation_unit" },
      ],
    },
  ];

  const units = useWeatherStore((state) => state.units);
  const setUnits = useWeatherStore((state) => state.setUnits);

  const { toggleDropdown } = useClickOutside(settingsDropdownRef, setIsOpen);

  // Toggle between Metric and Imperial unit systems
  const toggleSystem = useCallback(() => {
    const isMetric = units.temperature_unit === "celsius";
    const newUnits = isMetric
      ? {
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
        precipitation_unit: "inch",
      }
      : {
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        precipitation_unit: "mm",
      };
    setUnits(newUnits);
  }, [setUnits, units.temperature_unit]);

  return (
    <div ref={settingsDropdownRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        id="dropdownButton"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="dropdownMenu"
        className="settings_dropdown"
      >
        <Gear className="size-3.5 md:size-4" />
        <span>{t("nav.settings_units")}</span>
        <Dropdown isOpen={isOpen} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="dropdownMenu z-40"
            id="dropdownMenu"
            aria-labelledby="dropdownButton"
            role="region"
            aria-label="Unit settings"
          >
            <div className="flex flex-col p-1 gap-1">
              <button
                onClick={toggleSystem}
                className="switch_btn mb-0"
                type="button"
                aria-label="Switch unit system"
              >
                {units.temperature_unit === "celsius"
                  ? t("nav.settings_imperial")
                  : t("nav.settings_metric")}
              </button>
            </div>

            {allFields.map((field) => (
              <Fragment key={field.legend}>
                <SettingFieldset
                  legend={field.legend}
                  options={field.options}
                />

                <hr className="last:hidden" />
              </Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MemoizedSettingsDropdown = memo(SettingsDropdown);
MemoizedSettingsDropdown.displayName = "SettingsDropdown";
export default MemoizedSettingsDropdown;
