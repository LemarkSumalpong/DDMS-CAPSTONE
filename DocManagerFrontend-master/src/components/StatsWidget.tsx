type props = {
  title: string;
  subtitle?: string;
  stats: { label: string; value: number }[];
};

export default function StatsWidget(props: props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-80 h-64 overflow-y-scroll">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{props.title}</h2>
        {props.subtitle && (
          <p className="text-sm text-gray-500 mt-1">{props.subtitle}</p>
        )}
      </div>
      <div className="space-y-4">
        {props.stats.map((stat) => (
          <div className="flex items-center justify-between">
            <span className="font-medium">{stat.label}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
