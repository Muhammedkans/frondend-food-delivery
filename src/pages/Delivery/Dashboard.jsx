import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import deliveryApi from "../../api/deliveryApi";
import LiveTracking from "./LiveTracking";
import DeliveryMap from "../../components/Maps/DeliveryMap";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    activeOrders: 0,
    completedOrders: 0,
    earnings: 0,
    todayEarnings: 0,
    rating: 5,
    isOnline: false,
  });
  const [insights, setInsights] = useState({
    acceptanceRate: 0,
    completionRate: 0,
    avgDeliveryTime: 0,
    streakDays: 0,
    pendingPayout: 0,
    payoutThreshold: 500,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await deliveryApi.getDashboard();
      if (!res?.data?.success) {
        toast.error("Failed to load dashboard");
        return;
      }

      const data = res.data.data || {};
      const summaryData = data.summary || {};
      setSummary({
        activeOrders: summaryData.activeOrders || 0,
        completedOrders: summaryData.completedOrders || 0,
        earnings: summaryData.earnings || 0,
        todayEarnings: summaryData.todayEarnings || 0,
        rating: summaryData.rating || 5,
        isOnline: Boolean(summaryData.isOnline),
      });
      setInsights({
        acceptanceRate: data.insights?.acceptanceRate ?? 0,
        completionRate: data.insights?.completionRate ?? 0,
        avgDeliveryTime: data.insights?.avgDeliveryTime ?? 0,
        streakDays: data.insights?.streakDays ?? 0,
        pendingPayout: data.insights?.pendingPayout ?? 0,
        payoutThreshold: data.insights?.payoutThreshold ?? 500,
      });
      setWeeklyData(data.weeklyEarnings || []);
      setActiveOrders(data.orders || []);
      setIsOnline(Boolean(summaryData.isOnline));
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleOnline = async () => {
    try {
      const res = await deliveryApi.toggleOnlineStatus();
      if (res?.data?.success) {
        setIsOnline(res.data.isOnline);
        setSummary((prev) => ({ ...prev, isOnline: res.data.isOnline }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Toggle Online Error:", error);
      toast.error("Could not change online status");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await deliveryApi.updateStatus(orderId, status);
      toast.success(`Order ${status}`);
      fetchDashboard();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Could not update status");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeOrders.length > 0) {
      setSelectedOrder(activeOrders[0]);
    } else {
      setSelectedOrder(null);
    }
  }, [activeOrders]);

  const activeOrderId = selectedOrder?._id ?? null;
  const totalWeeklyEarnings = useMemo(
    () => weeklyData.reduce((acc, day) => acc + (day.earnings || 0), 0),
    [weeklyData]
  );

  if (loading) {
    return <p className="text-neonGreen text-xl p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-linear-to-b from-[#05070f] via-[#0a1024] to-[#05070f] text-gray-100">
      <LiveTracking isOnline={isOnline} orderId={activeOrderId} />

      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Delivery control center
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Hi Captain, ready for the next round?
          </h1>
        </div>

        <button
          onClick={toggleOnline}
          className={`px-6 py-3 rounded-2xl font-semibold tracking-wide transition shadow-neon ${
            isOnline
              ? "bg-linear-to-r from-emerald-400 to-lime-400 text-black"
              : "bg-linear-to-r from-blue-500 to-indigo-500 text-white"
          }`}
        >
          {isOnline ? "You are Online" : "Go Online"}
        </button>
      </header>

      <SummaryGrid summary={summary} weeklyTotal={totalWeeklyEarnings} />

      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 space-y-6">
          <WeeklyPerformanceChart data={weeklyData} />
          <OrdersPanel
            orders={activeOrders}
            onSelect={setSelectedOrder}
            selectedId={selectedOrder?._id}
            onStatusChange={handleStatusChange}
          />
        </div>
        <div className="space-y-6">
          <PerformanceInsights insights={insights} />
          <DeliveryMap order={selectedOrder} />
        </div>
      </div>
    </div>
  );
};

const SummaryGrid = ({ summary, weeklyTotal }) => {
  const cards = [
    {
      title: "Active Orders",
      value: summary.activeOrders,
      hint: "Live drops",
    },
    {
      title: "Completed",
      value: summary.completedOrders,
      hint: "All time",
    },
    {
      title: "Earnings",
      value: `₹${summary.earnings.toLocaleString()}`,
      hint: "Wallet balance",
    },
    {
      title: "Today",
      value: `₹${summary.todayEarnings.toLocaleString()}`,
      hint: "Today's payout",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg shadow-lg shadow-black/30"
        >
          <p className="text-sm uppercase tracking-widest text-gray-400">
            {card.title}
          </p>
          <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-gray-500 mt-2">{card.hint}</p>
        </article>
      ))}
      <article className="rounded-3xl border border-emerald-400/30 bg-linear-to-br from-emerald-500/10 to-lime-400/10 p-5">
        <p className="text-sm uppercase tracking-widest text-emerald-200">
          Weekly payout
        </p>
        <p className="mt-3 text-2xl font-extrabold text-emerald-300">
          ₹{weeklyTotal.toLocaleString()}
        </p>
        <p className="text-xs text-emerald-200/70 mt-2">Based on last 7 days</p>
      </article>
    </section>
  );
};

const WeeklyPerformanceChart = ({ data }) => (
  <section className="rounded-3xl border border-white/10 bg-[#0d1224] p-6 shadow-2xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Weekly earnings
        </p>
        <p className="text-3xl font-bold text-white mt-2">
          ₹{data.reduce((acc, day) => acc + (day.earnings || 0), 0).toLocaleString()}
        </p>
      </div>
      <span className="text-emerald-400 text-sm font-semibold">
        + Live velocity
      </span>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="label" stroke="#9ca3af" />
          <YAxis
            stroke="#9ca3af"
            tickFormatter={(value) => `₹${value}`}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            formatter={(value) => [`₹${value}`, "Earnings"]}
          />
          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#34d399"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#earningsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);

const PerformanceInsights = ({ insights }) => {
  const cards = [
    {
      label: "Acceptance rate",
      value: `${insights.acceptanceRate}%`,
      helper: "Keep it above 95% to unlock priority orders.",
      accent: "text-emerald-300",
    },
    {
      label: "Completion rate",
      value: `${insights.completionRate}%`,
      helper: "Cancel less than 3% to stay in elite tier.",
      accent: "text-sky-300",
    },
    {
      label: "Avg delivery time",
      value: `${insights.avgDeliveryTime} mins`,
      helper: "Optimized routes save fuel + boost tips.",
      accent: "text-amber-300",
    },
    {
      label: "Streak days",
      value: `${insights.streakDays}🔥`,
      helper: "Daily streak unlocks booster incentive.",
      accent: "text-pink-300",
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1224] p-5 space-y-4 shadow-2xl">
      <header>
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Performance insights
        </p>
        <p className="text-2xl font-bold text-white mt-2">
          Keep pushing. You’re in the top 10%.
        </p>
      </header>

      <div className="grid gap-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl bg-white/5 border border-white/10 p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              {card.label}
            </p>
            <p className={`text-2xl font-bold mt-2 ${card.accent}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.helper}</p>
          </article>
        ))}
      </div>

      <footer className="rounded-2xl bg-linear-to-r from-emerald-500/10 to-lime-500/10 border border-emerald-400/20 p-4 text-sm text-emerald-100">
        Payout pending: ₹{insights.pendingPayout.toLocaleString()} / ₹
        {insights.payoutThreshold.toLocaleString()}
      </footer>
    </section>
  );
};

const OrdersPanel = ({ orders, onSelect, selectedId, onStatusChange }) => {
  if (orders.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-gray-400">
        No active orders at the moment. Rest up and stay hydrated.
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1224] p-6 shadow-2xl">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Active orders
          </p>
          <p className="text-2xl font-bold text-white">
            {orders.length} on deck
          </p>
        </div>
        <p className="text-xs text-gray-500">Tap a card to focus & navigate</p>
      </header>

      <div className="space-y-4 max-h-112 overflow-y-auto pr-2">
        {orders.map((order) => (
          <article
            key={order._id}
            onClick={() => onSelect(order)}
            className={`cursor-pointer rounded-2xl border p-4 transition hover:border-emerald-400 ${
              selectedId === order._id
                ? "border-emerald-400 bg-emerald-400/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                #{order._id.slice(-6)}
              </h3>
              <span className="text-sm text-gray-400">
                ETA {order.deliveryTimeEstimate || 30} min
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">
              {order.restaurant?.name} → {order.customer?.name}
            </p>
            <p className="text-xs text-gray-500">
              {order.address?.slice(0, 64) || "Address hidden"}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-emerald-300">
                ₹{(order.total || 0).toLocaleString()}
              </span>
              <div className="flex gap-2">
                {["Accepted", "Ready for Pickup", "Preparing"].includes(
                  order.status
                ) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(order._id, "Picked Up");
                    }}
                    className="px-3 py-1 rounded-xl text-sm font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/40"
                  >
                    Picked up
                  </button>
                )}
                {order.status === "On the Way" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(order._id, "Delivered");
                    }}
                    className="px-3 py-1 rounded-xl text-sm font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/40"
                  >
                    Delivered
                  </button>
                )}
              </div>
            </div>
            {order.timeline?.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Last update: {order.timeline[order.timeline.length - 1].status}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;








