export default function SearchFilters({
  search,
  setSearch,
  sectorFilter,
  setSectorFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 flex flex-col xl:flex-row gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por problema, máquina, setor ou causa raiz..."
        className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
      />

      <select
        value={sectorFilter}
        onChange={(e) => setSectorFilter(e.target.value)}
        className="border border-slate-200 rounded-2xl px-4 py-3 text-slate-600"
      >
        <option>Todos</option>
        <option>Pintura</option>
        <option>Laboratório de Cor</option>
        <option>Produção</option>
        <option>Injetoras</option>
        <option>Manutenção</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-slate-200 rounded-2xl px-4 py-3 text-slate-600"
      >
        <option>Todos</option>
        <option>Resolvido</option>
        <option>Em análise</option>
      </select>
    </div>
  );
}