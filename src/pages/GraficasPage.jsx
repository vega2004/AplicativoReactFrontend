import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Data generators ───────────────────────────────────────────────
const timeSlots = ["18:00-20:00", "20:00-22:00", "22:00-00:00", "00:00-02:00", "02:00-04:00", "04:00-06:00"];
const ipLabels  = ["192.168.1.1", "10.0.0.1", "172.16.0.1", "192.168.0.1", "10.10.0.1", "172.20.0.1", "192.168.2.1"];
const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const rnd = (min, max, dec = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const genTemperature = () =>
  timeSlots.map((t) => ({ time: t, temp: rnd(18.5, 24) }));

const genHumedad = () =>
  timeSlots.map((t) => ({ time: t, humedad: rnd(30, 95) }));

const genRegistros = () =>
  ipLabels.map((ip) => ({ ip: ip.slice(-5), value: rnd(5000, 30000, 0) }));

const genPaquetes = () =>
  dayLabels.map((d) => ({ day: d, paquetes: rnd(1, 10, 0), valor: rnd(80, 300, 1) }));

// ─── Custom Tooltips ────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label, primaryKey, primaryLabel }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-[#0d1b2e] border border-[#1e3a5f] rounded-lg p-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{primaryLabel}</p>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-sm bg-[#22d3ee] inline-block" />
        <span className="text-white font-semibold">{val}</span>
      </div>
      {label && <p className="text-gray-500 mt-1">{primaryKey}: {label}</p>}
    </div>
  );
};

// ─── Sidebar ────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "registros", label: "Registros",  icon: "≡" },
    { id: "graficas",  label: "Gráficas",   icon: "↗" },
    { id: "dispositivos", label: "Dispositivos", icon: "⊡", hasArrow: true },
  ];
  return (
    <aside className="w-64 min-h-screen bg-[#0b1523] border-r border-[#1a2d45] flex flex-col py-6 px-4 gap-2 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#3b82f6] flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
          ⚡
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Sensor Monitor</p>
          <p className="text-gray-500 text-xs">ESP32 IoT</p>
        </div>
      </div>
      {/* Nav */}
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left
            ${active === item.id
              ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/30 font-semibold"
              : "text-gray-400 hover:text-white hover:bg-[#1a2d45]"}`}
        >
          <span className="text-lg w-5 text-center">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.hasArrow && <span className="text-gray-500 text-xs">▾</span>}
        </button>
      ))}
    </aside>
  );
};

// ─── Chart Card ─────────────────────────────────────────────────────
const ChartCard = ({ title, glow, children }) => (
  <div
    className={`rounded-2xl p-4 flex flex-col gap-3 bg-[#0d1b2e] border transition-all duration-300
      ${glow
        ? "border-[#22d3ee] shadow-[0_0_24px_4px_rgba(34,211,238,0.25)]"
        : "border-[#1a2d45]"}`}
  >
    <h3 className="text-white font-semibold text-sm text-center">{title}</h3>
    <div className="h-52">{children}</div>
  </div>
);

// ─── Main Dashboard ─────────────────────────────────────────────────
export default function SensorMonitor() {
  const [active, setActive]         = useState("graficas");
  const [tempData,  setTempData]    = useState(genTemperature);
  const [humData,   setHumData]     = useState(genHumedad);
  const [regData,   setRegData]     = useState(genRegistros);
  const [paqData,   setPaqData]     = useState(genPaquetes);
  const [loading,   setLoading]     = useState(false);

  // Live feed – slide window every 3 s
  useEffect(() => {
    const id = setInterval(() => {
      const newTime = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

      setTempData((prev) => {
        const next = [...prev.slice(1), { time: newTime, temp: rnd(18.5, 24) }];
        return next;
      });
      setHumData((prev) => [...prev.slice(1), { time: newTime, humedad: rnd(30, 95) }]);
      setRegData(genRegistros);
      setPaqData(genPaquetes);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setTempData(genTemperature());
      setHumData(genHumedad());
      setRegData(genRegistros());
      setPaqData(genPaquetes());
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#060e1a] font-sans">
      <Sidebar active={active} setActive={setActive} />

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold tracking-tight">Gráficas</h1>
            <p className="text-gray-400 text-sm mt-1">
              Visualización de temperatura, humedad y actividad por dispositivo.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
              bg-[#2563eb] shadow-[0_0_18px_3px_rgba(37,99,235,0.5)]
              hover:bg-[#1d4ed8] active:scale-95 transition-all duration-150
              ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>↺</span>
            )}
            Actualizar
          </button>
        </div>

        {/* 2x2 Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}
        >
          {/* ① Temperatura */}
          <ChartCard title="Temperatura por tiempo" glow>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="60%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis domain={[18, 25]} tickFormatter={(v) => `${v}°C`} tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip
                  content={<DarkTooltip primaryLabel="Temperatura °C" primaryKey="Hora" />}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#tempGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#22d3ee", stroke: "#fff", strokeWidth: 1.5 }}
                  style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ② Humedad */}
          <ChartCard title="Humedad por tiempo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={humData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip
                  content={<DarkTooltip primaryLabel="Humedad %" primaryKey="Hora" />}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 6 }}
                  formatter={() => "Humedad %"}
                />
                <Bar dataKey="humedad" name="Humedad %" fill="#22d3ee" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ③ Registros por IP */}
          <ChartCard title="Registros por IP">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                <XAxis dataKey="ip" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-[#0d1b2e] border border-[#1e3a5f] rounded-lg p-2 text-xs shadow-xl">
                        <p className="text-gray-400">Tooltips: {payload[0]?.value?.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-2 h-2 rounded-sm bg-[#3b82f6] inline-block" />
                          <span className="text-white font-semibold">IP: {payload[0]?.payload?.ip}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ④ Paquetes por día */}
          <ChartCard title="Paquetes por día">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paqData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-[#0d1b2e] border border-[#1e3a5f] rounded-lg p-2 text-xs shadow-xl">
                        <p className="text-gray-400">Tooltips: {payload[0]?.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-2 h-2 rounded-sm bg-[#3b82f6] inline-block" />
                          <span className="text-white font-semibold">Paquetes: {payload[1]?.value}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="valor"    fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="paquetes"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#fff" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_6px_#22d3ee]" />
          <span className="text-gray-500 text-xs">Actualizando en tiempo real cada 3 segundos</span>
        </div>
      </main>
    </div>
  );
}