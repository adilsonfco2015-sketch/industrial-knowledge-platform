const technologies = ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL'];

export default function AboutSystem() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-xl font-bold text-cyan-300">IK</div>
    <p className="mt-6 text-xs font-bold tracking-[0.15em] text-cyan-700">SOBRE O SISTEMA</p>
    <h2 className="mt-2 text-2xl font-bold text-slate-900">Industrial Knowledge Platform</h2>
    <p className="mt-2 text-sm font-semibold text-slate-500">AFDSILVA INDUSTRIAL SYSTEMS · Versão 2.4</p>
    <p className="mt-6 max-w-2xl leading-7 text-slate-600">Plataforma corporativa para registrar, investigar e compartilhar lições aprendidas industriais, consolidando conhecimento técnico e ações preventivas.</p>
    <h3 className="mt-8 text-sm font-bold text-slate-800">Tecnologias utilizadas</h3>
    <div className="mt-3 flex flex-wrap gap-2">{technologies.map((technology) => <span key={technology} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{technology}</span>)}</div>
    <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"><p className="font-bold text-slate-800">Changelog</p><p className="mt-2 text-sm text-slate-500">Estrutura preparada para registrar versões e evoluções futuras.</p><p className="mt-3 text-sm text-slate-600">2.4 · Consolidação e acabamento profissional.</p></section>
  </section>;
}
