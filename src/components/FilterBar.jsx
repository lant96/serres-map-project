import { useAppStore } from '../store/useAppStore' // Adjust path if needed

const filters = ['all', 'buildings', 'images', 'publications']

export default function FilterBar() {
  const activeFilter = useAppStore((s) => s.activeFilter);
  const setActiveFilter = useAppStore((s) => s.setActiveFilter);

  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid #ddd',
        background: '#fafafa',
      }}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          style={{
            flex: 1,
            padding: '14px 10px',
            border: 'none',
            background: activeFilter === filter ? '#222' : 'transparent',
            color: activeFilter === filter ? '#fff' : '#333',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}