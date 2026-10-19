export interface Consultation {
  initials: string;
  name: string;
  id: string;
  age: number;
  diagnosis: string;
  time: string;
  location: string;
  status: "ACTIVE SESSION" | "PENDING";
}