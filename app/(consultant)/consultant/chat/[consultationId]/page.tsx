import ConsultantToUser from "@/components/Consultant/consultantChat/ConsultantToUser";

interface Props {
  params: Promise<{
  consultationId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { consultationId } = await params;

  return (
    <ConsultantToUser
      consultationId={consultationId}
    />
  );
}