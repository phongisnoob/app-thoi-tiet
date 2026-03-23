import { useState } from "react";
import { AnimatePresence } from "motion/react";
import useWeatherStore from "../store/weatherStore";
import { useGeolocation } from "../hooks";
import {
  AddLocationModal,
  ComparisonGrid,
  ComparisonHeader,
  EmptyState,
  LoadingOverlay,
} from "../components/comparison";
import { notifyError, notifyInfo } from "../components/basic/toast";
import { useTranslation } from "react-i18next";

const ComparisonPage = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const fetchGeolocationWeather = useWeatherStore(
    (state) => state.fetchGeolocationWeather
  );
  const compareLocations = useWeatherStore((state) => state.compareLocations);
  const addCompareLocation = useWeatherStore(
    (state) => state.addCompareLocation
  );
  const isAddingLocation = useWeatherStore((state) => state.isAddingLocation);
  const currentLocation = useWeatherStore((state) => state.currentLocation);

  const { getCurrentPositionPromise } = useGeolocation();

  // Handle adding current location
  const handleAddCurrentLocation = async () => {
    try {
      let locationToAdd = currentLocation;

      if (!locationToAdd) {
        const position = await getCurrentPositionPromise();
        notifyInfo(t("comparison.fetching_current"));
        locationToAdd = await fetchGeolocationWeather(position);
      }

      if (locationToAdd) {
        const isAlreadyAdded = compareLocations.some(
          (loc) =>
            loc.originalLatitude === locationToAdd.latitude &&
            loc.originalLongitude === locationToAdd.longitude
        );

        if (isAlreadyAdded) {
          notifyError(t("comparison.already_added"));
        } else {
          await addCompareLocation(locationToAdd);
        }
      } else {
        notifyError(t("comparison.cannot_retrieve"));
      }
    } catch (error) {
      notifyError(
        error.message || t("comparison.failed_compare")
      );
    }
  };

  return (
    <section>
      <AnimatePresence>
        {showModal && <AddLocationModal setShowModal={setShowModal} />}
      </AnimatePresence>

      <ComparisonHeader
        compareCount={compareLocations.length}
        isAddingLocation={isAddingLocation}
        onAddLocation={() => setShowModal(true)}
        onAddCurrentLocation={handleAddCurrentLocation}
      />

      <div className="max-w-7xl mx-auto relative">
        {isAddingLocation && <LoadingOverlay />}
        <AnimatePresence mode="wait">
          {compareLocations.length > 0 ? (
            <ComparisonGrid
              key="comparison-grid"
              locations={compareLocations}
              onAddLocation={() => setShowModal(true)}
            />
          ) : (
            <EmptyState key="empty" onAddLocation={() => setShowModal(true)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ComparisonPage;
