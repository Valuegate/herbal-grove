import StatCard from "./StatCard";
import {
  FileText,
  Leaf,
  Database,
  Clock3,
} from "lucide-react";

interface Props {
  darkMode: boolean;
}

export default function StatsGrid({ darkMode }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Documents"
        value={24}
        icon={<FileText size={24} />}
        darkMode={darkMode}
      />

      <StatCard
        title="Herbs"
        value={68}
        icon={<Leaf size={24} />}
        darkMode={darkMode}
      />

      <StatCard
        title="Chunks"
        value={1284}
        icon={<Database size={24} />}
        darkMode={darkMode}
      />

      <StatCard
        title="Pending"
        value={3}
        icon={<Clock3 size={24} />}
        darkMode={darkMode}
      />
    </div>
  );
}