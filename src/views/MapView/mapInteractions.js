export function createMapInteractions({
  map,
  hotspotsRef,
  setSelection,
}) 
  {
    function onBuildingClick(e) {
      const gisId = e.features?.[0]?.properties?.gis_id;
      if (!gisId) return;

      const hotspots = hotspotsRef.current;

      const matchedHotspot = hotspots.find(
        (h) => String(h.gis_id) === String(gisId)
      );

      if (matchedHotspot) {
        setSelection("hotspot", matchedHotspot.id);
      } else {
        // fallback: still select building
        setSelection("building", gisId);
      }
    }

    function onMapClick(e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["buildings-layer"],
      });

      if (features.length === 0) {
        setSelection("clear");
      }
    }

    function onMouseEnter() {
      map.getCanvas().style.cursor = "pointer";
    }

    function onMouseLeave() {
      map.getCanvas().style.cursor = "";
    }

  return {
    onBuildingClick,
    onMapClick,
    onMouseEnter,
    onMouseLeave,
  };
}