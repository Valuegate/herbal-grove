import ArchiveList from "@/components/Consultant/archive/List";
import ArchiveSearch from "@/components/Consultant/archive/Search";
import ArchiveStats from "@/components/Consultant/archive/Stats";

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <ArchiveStats />
      <ArchiveSearch />
      <ArchiveList />
    </div>
  );
}