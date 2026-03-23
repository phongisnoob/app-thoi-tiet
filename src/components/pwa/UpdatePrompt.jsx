import { useRegisterSW } from "virtual:pwa-register/react";
import { useTranslation } from "react-i18next";

const UpdatePrompt = () => {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleRefresh = async () => {
    await updateServiceWorker(true);
  };

  if (!needRefresh) return null;

  return (
    <div
      className="fixed z-999 top-4 right-4 bg-white py-2 px-4 rounded shadow-lg flex flex-col items-center gap-3 border border-gray-100 max-w-xs"
      aria-live="polite"
    >
      <p>{t("pwa.update_available", "Có bản cập nhật mới cho ứng dụng!")}</p>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium 
                   py-2 rounded-lg text-sm transition-colors duration-200 
                   shadow-md"
        onClick={handleRefresh}
      >
        Tải lại trang web
      </button>

      <button
        className="w-full text-gray-500 hover:text-gray-700 text-xs mt-1"
        onClick={() => setNeedRefresh(false)}
      >
        {t("pwa.dismiss", "Để sau")}
      </button>
    </div>
  );
};

export default UpdatePrompt;
