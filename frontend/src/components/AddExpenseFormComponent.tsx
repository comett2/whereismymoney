import { useState } from "react"

export function AddExpenseFormComponent({ onAdded }: { onAdded: () => void }) {
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await fetch("http://localhost:8080/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category,
                    amount: parseFloat(amount),
                    date: new Date().toISOString().split("T")[0]
                }),
            })
            setCategory("")
            setAmount("")
            onAdded() // odśwież listę po dodaniu
        } catch (err) {
            console.error("Błąd podczas dodawania wydatku:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Dodaj wydatek</h2>
            <div className="flex gap-3 mb-3">
                <input
                    type="text"
                    placeholder="Kategoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded p-2 flex-1"
                    required
                />
                <input
                    type="number"
                    placeholder="Kwota"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded p-2 w-32"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? "Dodawanie..." : "Dodaj"}
            </button>
        </form>
    )
}