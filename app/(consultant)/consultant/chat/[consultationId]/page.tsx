import ChatUsers from "@/components/Consultant/consultantChat";

interface Props {
  params: Promise<{
    consultationId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { consultationId } = await params;

  return (
    <ChatUsers
      consultationId={consultationId}
    />
  );
}