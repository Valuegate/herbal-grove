import UsersTable from "@/components/Admin/users/CreateUserForm";

export default function UsersPage() {
  return (
    <main className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Invite Consultants
          </h1>

          <p className="text-gray-500">
            Invite consultants to join your team.
          </p>
        </div>

      </div>

      <UsersTable />

    </main>
  );
}