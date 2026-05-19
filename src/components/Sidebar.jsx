import FilterBar from './FilterBar'
import HotspotList from './HotspotList'
import HotspotOverlay from './HotspotOverlay'
import { useAppStore } from '../store/useAppStore' // Adjust path if needed

export default function Sidebar() {
  const hotspots = useAppStore((s) => s.hotspots);
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const setSelectedHotspotId = useAppStore((s) => s.setSelectedHotspotId);

  // Find the full hotspot object to pass to the overlay
  const selectedHotspotObj = hotspots.find((h) => h.id === selectedHotspotId);

  return (
    <div
      style={{
        width: '25%',
        minWidth: '300px',
        height: '100%',
        background: '#ffffff',
        borderRight: '1px solid #ddd',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5
      }}
    >
      <FilterBar />
      <HotspotList />

      {selectedHotspotObj && (
        <HotspotOverlay
          hotspot={selectedHotspotObj}
          onClose={() => setSelectedHotspotId(null)}
        />
      )}
    </div>
  )
}