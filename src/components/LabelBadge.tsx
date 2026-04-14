export default function LabelBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: color + '20', color, borderColor: color + '40', borderWidth: 1 }}
    >
      {name}
    </span>
  )
}
