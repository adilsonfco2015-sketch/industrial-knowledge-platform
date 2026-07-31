export default function RoadmapCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Roadmap do Sistema
      </h3>

      <div className="space-y-4">
        {[
          'Login multiusuário',
          'Banco PostgreSQL',
          'API Node.js',
          'Dashboard Power BI',
          'QR Code por máquina',
          'IA para busca inteligente',
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4"
          >
            <div className="w-3 h-3 rounded-full bg-slate-900"></div>

            <p className="text-slate-700 font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}