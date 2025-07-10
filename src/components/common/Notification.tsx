import { useApp } from "../../contexts/AppContext";

export default function Notification() {
  const { notifications, removeNotification } = useApp();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded shadow-md cursor-pointer ${
            n.type === "success"
              ? "bg-green-500 text-white"
              : n.type === "error"
              ? "bg-red-500 text-white"
              : n.type === "warning"
              ? "bg-yellow-400 text-black"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => removeNotification(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
