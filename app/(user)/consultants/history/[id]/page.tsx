import ConsultationHistoryDetails from "@/components/userConsultantHistory/ConsultationHistoryDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ConsultationHistoryDetailsPage({
  params,
}: Props) {
  return <ConsultationHistoryDetails params={params} />;
}