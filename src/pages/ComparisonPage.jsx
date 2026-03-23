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

const ComparisonPage = () => {
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
        notifyInfo("Đang lấy thông tin thời tiết vị trí hiện tại...");
        locationToAdd = await fetchGeolocationWeather(position);
      }

      if (locationToAdd) {
        const isAlreadyAdded = compareLocations.some(
          (loc) =>
            loc.originalLatitude === locationToAdd.latitude &&
            loc.originalLongitude === locationToAdd.longitude
        );

        if (isAlreadyAdded) {
          notifyError("Vị trí hiện tại đã có trong danh sách so sánh.");
        } else {
          await addCompareLocation(locationToAdd);
        }
      } else {
        notifyError("Không thể lấy dữ liệu vị trí hiện tại.");
      }
    } catch (error) {
      notifyError(
        error.message || "Không thể thêm vị trí hiện tại vào so sánh."
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
