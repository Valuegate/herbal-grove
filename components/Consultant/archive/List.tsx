import ArchiveCard from "./Card";

const archive = [
  {
    id: "1",
    initials: "JD",
    name: "John Doe",
    diagnosis: "Hypertension",
    date: "24 Jul 2026",
    duration: "28 mins",
    status: "Completed" as const,
  },
  {
    id: "2",
    initials: "MO",
    name: "Mary Obi",
    diagnosis: "Diabetes",
    date: "22 Jul 2026",
    duration: "18 mins",
    status: "Completed" as const,
  },
  {
    id: "3",
    initials: "AO",
    name: "Aisha Okafor",
    diagnosis: "Migraine",
    date: "20 Jul 2026",
    duration: "33 mins",
    status: "Completed" as const,
  },
];

export default function ArchiveList() {
  return (
    <div className="space-y-5">
      {archive.map((item) => (
        <ArchiveCard key={item.id} {...item} />
      ))}
    </div>
  );
}