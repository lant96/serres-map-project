import { useState } from "react";

export default function Tabs({ tabs, accentColor = "#ff4d4d" }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);

  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div>
      <div style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              style={{
                ...styles.tabButton,
                color: isActive ? accentColor : "#999",
                fontWeight: isActive ? 600 : 400,
                borderBottomColor: isActive ? accentColor : "transparent",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={styles.tabContent}>
        {activeTab?.content}
      </div>
    </div>
  );
}

const styles = {
  tabRow: {
    display: "flex",
    gap: 18,
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    marginBottom: 14,
  },
  tabButton: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "0 0 10px",
    fontSize: 13,
    cursor: "pointer",
    transition: "color 0.15s ease, border-color 0.15s ease",
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
};