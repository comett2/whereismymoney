import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ExpensesChart({ expenses }: { expenses: Expense[] }) {
    // grupowanie po kategorii
    const grouped = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
    }, {} as Record<string, number>)

    const data = Object.entries(grouped).map(([category, total]) => ({
        name: category,
        value: total,
    }))

    const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6", "#0ea5e9"]

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Wydatki według kategorii</h2>
            {data.length === 0 ? (
                <p className="text-gray-500 text-sm">Brak danych do wyświetlenia</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}