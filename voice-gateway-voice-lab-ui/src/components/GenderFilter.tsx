interface Props {
  selected: 'all' | 'female' | 'male'
  onChange: (filter: 'all' | 'female' | 'male') => void
}

export function GenderFilter({ selected, onChange }: Props) {
  return (
    <div className="gender-filter" role="group" aria-label="Gender filter">
      {(['all', 'female', 'male'] as const).map((filter) => (
        <button key={filter} className={selected === filter ? 'active' : ''} onClick={() => onChange(filter)}>
          {filter === 'all' ? 'All' : filter === 'female' ? 'Female - Nive' : 'Male - Anbu'}
        </button>
      ))}
    </div>
  )
}
