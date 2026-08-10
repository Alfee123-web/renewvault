export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 animate-mesh-sweep opacity-40"></div>
      <div
        className="absolute inset-0 animate-pan-grid opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 0L0 0L0 36' fill='none' stroke='%234338ca' stroke-opacity='0.2' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="animate-float-a absolute top-[10vh] right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--accent)]/10 blur-[150px]" />
      <div className="animate-float-b absolute top-[50vh] left-0 h-[420px] w-[420px] -translate-x-1/3 rounded-full bg-[var(--secondary)]/12 blur-[150px]" />
      <div className="animate-float-c absolute top-[80vh] right-[10%] h-[300px] w-[300px] rounded-full bg-[var(--violet-glow)]/8 blur-[140px]" />
      <div className="meteor-trail meteor-1" />
      <div className="meteor-trail meteor-2" />
      <div className="meteor-trail meteor-3" />
    </div>
  );
}