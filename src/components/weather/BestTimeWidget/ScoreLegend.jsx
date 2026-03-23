import { useTranslation } from "react-i18next";

const ScoreLegend = () => {
  const { t } = useTranslation();

  const legend = [
    { label: t("score.excellent"), color: "bg-green-500" },
    { label: t("score.good"), color: "bg-yellow-500" },
    { label: t("score.fair"), color: "bg-orange-500" },
    { label: t("score.poor"), color: "bg-red-500" },
  ];
  return (
    <div
      className="flex flex-wrap items-center gap-3 text-xs md:text-sm"
      role="region"
      aria-label="Color key for outdoor activity score"
    >
      {legend.map((tag) => (
        <div key={tag.label} className="flex items-center gap-1.5">
          <div aria-hidden="true" className={`w-3 h-3 rounded ${tag.color}`} />
          <span className="text-(--neutral-300) not-dark:text-(--neutral-600)">
            {tag.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScoreLegend;
