import ConsultantChat from "@/components/userConsultantChat/index";


export default async function Page({
  params,
}: {
  params: Promise<{
    consultationId: string;
  }>;
}) {
  const { consultationId } = await params;

  return (
    <ConsultantChat
      consultationId={consultationId}
    />
  );
}