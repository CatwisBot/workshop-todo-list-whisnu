import { useState } from 'react'
import type { Task } from './types'

// Tipe untuk column
type ColumnType = 'todo' | 'doing' | 'done'

// Config untuk setiap column
const columnConfig: Record<
  ColumnType,
  { title: string; color: string; dot: string }
> = {
  todo: { title: 'Todo', color: 'border-sky-200', dot: 'bg-sky-500' },
  doing: { title: 'In Progress', color: 'border-amber-200', dot: 'bg-amber-500' },
  done: { title: 'Done', color: 'border-emerald-200', dot: 'bg-emerald-500' },
}

function App() {
  // State: daftar semua task
  const [tasks, setTasks] = useState<Task[]>([])
  // State: isi input field
  const [inputValue, setInputValue] = useState('')

  const addTask = () => {
    if (inputValue.trim() === '') {
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title: inputValue.trim(),
      status: 'todo',
    }

    setTasks([...tasks, newTask])
    setInputValue('')
  }

  // Fungsi pindahkan task ke status berikutnya
  const moveTask = (taskId: number, newStatus: ColumnType) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // Fungsi hapus task
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Filter tasks per column
  const getTasksByStatus = (status: ColumnType) => {
    return tasks.filter((task) => task.status === status)
  }

  const columns: ColumnType[] = ['todo', 'doing', 'done']

  return (
    <div className="min-h-screen px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-500">
              FOCUS BOARD
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Todo Board
            </h1>
            <p className="mt-2 text-slate-600">
              Raden Whisnu Arya Nugraha.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
              Total: {tasks.length}
            </span>
          </div>
        </header>

        {/* Form Input */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur animate-fade-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addTask()}
              placeholder="Tambah task baru..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
            />
            <button
              type="button"
              onClick={addTask}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Tambah
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {columns.map((status) => {
            const config = columnConfig[status]
            const count = getTasksByStatus(status).length

            return (
              <div
                key={status}
                className={`rounded-xl border ${config.color} bg-white/70 px-4 py-3 shadow-sm`}
              >
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                  <span className="font-medium text-slate-700">
                    {config.title}
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {count}
                </p>
              </div>
            )
          })}
        </div>

        {/* Board: 3 Columns */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {columns.map((status, index) => {
            const config = columnConfig[status]
            const columnTasks = getTasksByStatus(status)

            return (
              <div
                key={status}
                className={`rounded-2xl border ${config.color} bg-white/80 p-4 shadow-sm backdrop-blur animate-fade-up`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                      {config.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="space-y-3 min-h-[120px]">
                  {columnTasks.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">
                      No tasks yet
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300"
                      >
                        <p className="text-sm text-slate-800">{task.title}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {status !== 'todo' && (
                            <button
                              type="button"
                              onClick={() =>
                                moveTask(
                                  task.id,
                                  status === 'doing' ? 'todo' : 'doing'
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-slate-300"
                            >
                              ← Back
                            </button>
                          )}
                          {status !== 'done' && (
                            <button
                              type="button"
                              onClick={() =>
                                moveTask(
                                  task.id,
                                  status === 'todo' ? 'doing' : 'done'
                                )
                              }
                              className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-white transition hover:bg-slate-800"
                            >
                              Next →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="ml-auto rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-100"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
