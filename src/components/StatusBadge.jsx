function StatusBadge({ status, label }) {
  const colors = {
    online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    offline: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }

  const colorClass = colors[status] || colors.offline

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label || status}
    </span>
  )
}

export default StatusBadge
