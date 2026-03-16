"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Circle, Trash2, ListTodo } from "lucide-react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- API CALLS ---
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Ingat: Ubah localhost ke IP komputermu jika ingin tes di HP!
      const res = await fetch("http://localhost:5000/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.success) setTodos(result.data);
    } catch (error) {
      console.error("Gagal mengambil todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });

      if (res.ok) {
        setNewTodoTitle("");
        fetchTodos(); // Refresh data setelah berhasil ditambah
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const token = localStorage.getItem("token");

      // Optimistic Update: Ubah UI duluan biar terasa cepat, baru tembak API
      setTodos(
        todos.map((t) =>
          t.id === todoId ? { ...t, isCompleted: !t.isCompleted } : t,
        ),
      );

      const res = await fetch(`http://localhost:5000/todos/${todoId}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) fetchTodos(); // Kembalikan ke asal jika API gagal
    } catch (error) {
      console.error("Gagal update todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const token = localStorage.getItem("token");

      // Hapus dari UI duluan
      setTodos(todos.filter((t) => t.id !== todoId));

      const res = await fetch(`http://localhost:5000/todos/${todoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) fetchTodos(); // Kembalikan jika gagal
    } catch (error) {
      console.error("Gagal hapus todo:", error);
    }
  };

  // Hitung progres
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progressPercent =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative max-w-4xl mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl border border-fuchsia-500/30">
              <ListTodo size={24} />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              Tugas Prioritas
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Selesaikan satu per satu, jangan ditumpuk.
          </p>
        </div>

        {/* Progres Bar Mini */}
        <div className="w-full md:w-48 text-right">
          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            {completedCount} dari {todos.length} Selesai
          </p>
          <div className="w-full bg-slate-950 h-2.5 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* --- INPUT TODO BARU --- */}
      <form onSubmit={handleAddTodo} className="relative group">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Apa yang ingin kamu selesaikan hari ini?"
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-6 pr-16 py-5 text-gray-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all shadow-lg"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newTodoTitle.trim()}
          className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-slate-950 rounded-xl hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all disabled:opacity-50 disabled:hover:shadow-none">
          <Plus size={20} strokeWidth={3} />
        </button>
      </form>

      {/* --- DAFTAR TODO --- */}
      {isLoading ? (
        <div className="text-center text-fuchsia-500 py-10">
          Memuat daftar tugas...
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
          Wah, tidak ada tugas tersisa. Waktunya bersantai! ☕
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                todo.isCompleted
                  ? "bg-slate-950/50 border-slate-800/50 opacity-60"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}>
              <div
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => handleToggleTodo(todo.id)}>
                <button
                  className={`flex-shrink-0 transition-colors ${todo.isCompleted ? "text-fuchsia-500" : "text-slate-500 group-hover:text-cyan-400"}`}>
                  {todo.isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>
                <span
                  className={`text-lg transition-all duration-300 ${todo.isCompleted ? "text-slate-500 line-through" : "text-gray-200"}`}>
                  {todo.title}
                </span>
              </div>

              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-400 transition-all duration-300 transform hover:scale-110"
                title="Hapus tugas">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
