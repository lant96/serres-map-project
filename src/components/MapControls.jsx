export default function MapControls({ toggleLayer }) {
  return (
    <div className="map-controls">
      <label>
        <input
          type="checkbox"
          defaultChecked
          onChange={(e) =>
            toggleLayer("serres-blocks-fill", e.target.checked)
          }
        />
        Serres Blocks
      </label>

      <label>
        <input
          type="checkbox"
          defaultChecked
          onChange={(e) =>
            toggleLayer("buildings-outline", e.target.checked)
          }
        />
        Buildings Merarhias
      </label>

      <label>
        <input
          type="checkbox"
          defaultChecked
          onChange={(e) =>
            toggleLayer("market-outline", e.target.checked)
          }
        />
        Ottoman Market
      </label>

      <label>
        <input
          type="checkbox"
          defaultChecked
          onChange={(e) =>
            toggleLayer("hotspots-layer", e.target.checked)
          }
        />
        Hotspots
      </label>
    </div>
  );
}