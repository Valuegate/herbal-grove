import ConsultantBooking from "@/components/marketing/ConsultantBooking";

interface Props {
  params: Promise<{ id: string }>;
}
export default function ConsultantBookingPage({ params }: Props) {
  return <ConsultantBooking params={params} />;
}