interface ActivityCardProps {
  darkMode: boolean;
}

export default function ActivityHistoryCard({ darkMode }: ActivityCardProps) {
  return (
    <section className="space-y-4">
      <h3 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
        Activity History
      </h3>
      <div className={`
        rounded-2xl p-6 text-center border transition-all duration-300
        ${darkMode ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-white border-gray-100'}
      `}>
        <p className={`text-sm italic ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
          No recent activity
        </p>
      </div>
    </section>
  );
}
