const Table = ({ users }) => {
  return (
    <div className="relative overflow-x-auto shadow-2xl rounded-[40px] bg-[#211e38]">
      <table className="w-full text-sm text-left rtl:text-right text-[#c0b7e8]">
        <thead className="text-xs uppercase bg-[#302c42] text-white tracking-widest">
          <tr>
            <th scope="col" className="px-8 py-6 font-bold">Name</th>
            <th scope="col" className="px-8 py-6 font-bold">Username</th>
            <th scope="col" className="px-8 py-6 font-bold">Email</th>
            <th scope="col" className="px-8 py-6 font-bold">Company</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-transparent border-b border-[#302c42] hover:bg-[#302c42]/50 transition-colors">
              <th scope="row" className="px-8 py-5 font-medium text-white whitespace-nowrap">
                {user.name}
              </th>
              <td className="px-8 py-5">{user.username}</td>
              <td className="px-8 py-5">{user.email}</td>
              <td className="px-8 py-5">{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
