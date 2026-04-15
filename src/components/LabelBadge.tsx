export default function LabelBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: color + '14',
        color: color,
        boxShadow: `inset 0 0 0 1px ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  )
}
