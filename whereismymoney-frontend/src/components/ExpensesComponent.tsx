import {useEffect, useState} from "react";
import {AddExpenseFormComponent} from "@/components/AddExpenseFormComponent";
import {ExpensesChart} from "@/components/ExpensesChartComponent";

export function ExpensesComponent() {
    const [expenses, setExpenses] = useState<Expense[]>([])

    useEffect(() => {
        fetch("http://localhost:8080/api/expenses")
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(err => console.error("Błąd podczas pobierania:", err))
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Na pewno chcesz usunąć ten wydatek?")) return

        try {
            await fetch(`http://localhost:8080/api/expenses/${id}`, {
                method: "DELETE",
            })

            // Odśwież listę po usunięciu
            setExpenses(expenses.filter(e => e.id !== id))
        } catch (err) {
            console.error("Błąd podczas usuwania:", err)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Wydatki</h1>


            <AddExpenseFormComponent onAdded={() => {
                fetch("http://localhost:8080/api/expenses")
                    .then(res => res.json())
                    .then(data => setExpenses(data))
            }} />

            <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-3 py-2 text-left">Kategoria</th>
                    <th className="border px-3 py-2 text-left">Kwota</th>
                    <th className="border px-3 py-2 text-left">Data</th>
                </tr>
                </thead>
                <tbody>
                {expenses.map(exp => (
                    <tr key={exp.id} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-3 py-2">{exp.category}</td>
                        <td className="border px-3 py-2">{exp.amount} zł</td>
                        <td className="border px-3 py-2">{exp.date}</td>
                        <td className="border px-3 py-2 text-right">
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {expenses.length === 0 && (
                <p className="text-gray-500 mt-4">Brak wydatków w bazie.</p>
            )}

            <ExpensesChart expenses={expenses} />
        </div>
    )
}