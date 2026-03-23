import { useRef, useState } from "react";
import { useClickOutside } from "../../../hooks";
import useWeatherStore from "../../../store/weatherStore";
import { Dropdown } from "../../basic/Icons";
import { useTranslation } from "react-i18next";

const DaysDropdown = ({ hourlyForecasts, selectedDayIndex, setSelectedDayIndex }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const daysDropdownRef = useRef();
  const triggerButtonRef = useRef();

  const isFetching = useWeatherStore((state) => state.isFetching);

  // Generate options based on actual forecast chunks
  const dropdownOptions = hourlyForecasts.map((chunk, index) => {
    if (index === 0) return { index, label: t("weather.today") };
    
    const d = new Date(chunk[0].time);
    const dayName = new Intl.DateTimeFormat(i18n.language?.startsWith('vi') ? "vi-VN" : "en-US", { weekday: "long" }).format(d);
    return { index, label: dayName };
  });

  // Determine display text for the trigger button
  const displayLabel = dropdownOptions.find(opt => opt.index === selectedDayIndex)?.label || t("weather.today");

  const { toggleDropdown } = useClickOutside(daysDropdownRef, setIsOpen);

  // Keyboard Navigation
  const handleMenuKeyDownKeyboard = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerButtonRef.current?.focus();
    }
  };

  return (
    <div ref={daysDropdownRef} className="relative">
      <button
        ref={triggerButtonRef}
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="days_dropdown"
        aria-controls="days-dropdown-menu"
        aria-haspopup="true"
      >
        <span className="capitalize">{isFetching ? "-" : displayLabel}</span>
        <Dropdown isOpen={isOpen} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul
          id="days-dropdown-menu"
          role="menu"
          onKeyDown={handleMenuKeyDownKeyboard}
          className="py-2 flex flex-col gap-1 z-10 dropdownMenu"
          tabIndex="-1"
        >
          {dropdownOptions.map((opt) => (
            <li key={opt.index}>
              <button
                role="menuitem"
                onClick={() => {
                  setSelectedDayIndex(opt.index);
                  setIsOpen(false);
                }}
                aria-label={`Select ${opt.label}`}
                className="day_button capitalize"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DaysDropdown;
