import i18n from "../i18n";

/**
 * WEATHER CODE MAPPINGS (for Open-Meteo)
 */
export const WEATHER_ICON_MAP = {
  0: "sunny",
  1: "partly-cloudy",
  2: "partly-cloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

export const WEATHER_CODE_DESCRIPTIONS = {
  0: "Trời quang",
  1: "Chủ yếu quang mây",
  2: "Có mây vài nơi",
  3: "U ám",
  45: "Sương mù",
  48: "Sương mù đóng băng",
  51: "Mưa phùn nhẹ",
  53: "Mưa phùn vừa",
  55: "Mưa phùn dày đặc",
  56: "Mưa phùn đóng băng nhẹ",
  57: "Mưa phùn đóng băng dày đặc",
  61: "Mưa nhỏ",
  63: "Mưa vừa",
  65: "Mưa to",
  66: "Mưa đóng băng nhẹ",
  67: "Mưa đóng băng to",
  71: "Tuyết rơi nhẹ",
  73: "Tuyết rơi vừa",
  75: "Tuyết rơi dày",
  77: "Mưa hạt tuyết",
  80: "Mưa rào nhẹ",
  81: "Mưa rào vừa",
  82: "Mưa rào dữ dội",
  85: "Mưa tuyết nhẹ",
  86: "Mưa tuyết dày",
  95: "Giông bão",
  96: "Giông bão kèm mưa đá nhỏ",
  99: "Giông bão kèm mưa đá to",
};

/**
 * UV INDEX MAPPING
 */
export const UV_INDEX_LEVELS = {
  0: "Thấp",
  1: "Thấp",
  2: "Thấp",
  3: "Trung bình",
  4: "Trung bình",
  5: "Trung bình",
  6: "Cao",
  7: "Cao",
  8: "Rất cao",
  9: "Rất cao",
  10: "Rất cao",
  11: "Đỉnh điểm",
};

/**
 * UTILITY FUNCTIONS
 */
// Function to get the simplified icon name from a weather code
export const getWeatherIcon = (code) => {
  return WEATHER_ICON_MAP[code] || "sunny";
};

// Function to get the detailed description from a weather code
export const getWeatherDescription = (code) => {
  return i18n.t(`weather_codes.${code}`, { defaultValue: WEATHER_CODE_DESCRIPTIONS[code] || "Điều kiện thay đổi" });
};

// Helper function to retrieve the UV level based on the index number.
export const getUvLevel = (uvIndex) => {
  const index = Math.min(11, Math.max(0, Math.round(uvIndex)));
  return i18n.t(`uv_levels.${index}`, { defaultValue: UV_INDEX_LEVELS[index] || "Không xác định" });
};
