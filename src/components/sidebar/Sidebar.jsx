import FilterBar from "./FilterBar";
import HotspotList from "./HotspotList";
import "../../app/styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar-inner">

      <div className="sidebar-section">
        <FilterBar />
      </div>

      <div className="sidebar-scroll">
        <HotspotList />
      </div>

    </div>
  );
}