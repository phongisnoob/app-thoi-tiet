import Tippy from "@tippyjs/react";
import { motion } from "motion/react";
import { useSettings } from "../../hooks";
import { useState } from "react";
import { IconLanguage } from "@tabler/icons-react";
import soundToggle from "/sounds/switch.mp3";
import useSound from "use-sound";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { isSoundEnabled } = useSettings();
  const [isWiggling, setIsWiggling] = useState(false);
  const { t, i18n } = useTranslation();

  const [playToggle] = useSound(soundToggle, {
    volume: 0.5,
    playbackRate: 1.5,
    interrupt: true,
    soundEnabled: isSoundEnabled,
  });

  const isVietnamese = i18n.language?.startsWith('vi');
  const tippyContent = isVietnamese ? t("nav.settings_language_en", "English") : t("nav.settings_language_vi", "Tiếng Việt");

  const wiggleVariants = {
    wiggle: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        times: [0, 0.1, 0.3, 0.5, 0.7, 1],
      },
    },
  };

  const handleClick = () => {
    playToggle();
    setIsWiggling(true);
    const nextLang = isVietnamese ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Tippy content={tippyContent}>
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        animate={isWiggling ? "wiggle" : undefined}
        variants={wiggleVariants}
        onAnimationComplete={() => setIsWiggling(false)}
        aria-label={tippyContent}
        className="sound_btn"
      >
        <IconLanguage />
      </motion.button>
    </Tippy>
  );
};

export default LanguageToggle;
