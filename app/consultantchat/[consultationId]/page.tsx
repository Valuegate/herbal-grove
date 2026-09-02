import UserToConsultant from "@/components/userConsultantChat/UserToConsultant";

export default async function Page({
  params,
}: {
  params: Promise<{
    consultationId: string;
  }>;
}) {
  const { consultationId } = await params;

  return (
    <UserToConsultant
      consultationId={consultationId}
    />
  );
}