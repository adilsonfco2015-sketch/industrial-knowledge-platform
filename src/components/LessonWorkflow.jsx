export const workflowSteps = ['Aberta', 'Em Investigação', 'Plano de Ação', 'Em Implementação', 'Aguardando Validação', 'Encerrada'];

export default function LessonWorkflow({ status }) {
  const current = Math.max(0, workflowSteps.indexOf(status));
  return <div className="flex min-w-max items-center gap-0 overflow-x-auto pb-1">{workflowSteps.map((step, index) => <div key={step} className="flex items-center"><div className={`flex items-center gap-2 text-xs font-semibold ${index <= current ? 'text-cyan-700' : 'text-slate-400'}`}><span className={`grid h-6 w-6 place-items-center rounded-full ${index <= current ? 'bg-cyan-600 text-white' : 'bg-slate-100'}`}>{index + 1}</span><span>{step}</span></div>{index < workflowSteps.length - 1 && <div className={`mx-2 h-px w-6 sm:w-9 ${index < current ? 'bg-cyan-500' : 'bg-slate-200'}`} />}</div>)}</div>;
}
