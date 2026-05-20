import { useState } from 'react'
import type { Task } from './types'

// Tipe untuk column
type ColumnType = 'todo' | 'doing' | 'done'

// Config untuk setiap column
const columnConfig: Record<
  ColumnType,
  { title: string; color: string; dot: string; badge: string }
> = {
  todo: {
    title: 'Todo',
    color: 'border-sky-200',
    dot: 'bg-sky-400',
    badge: 'bg-sky-100 text-sky-700',
  },
  doing: {
    title: 'In Progress',
    color: 'border-amber-200',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  done: {
    title: 'Done',
    color: 'border-emerald-200',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700',
  },
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
  const todoCount = getTasksByStatus('todo').length
  const doingCount = getTasksByStatus('doing').length
  const doneCount = getTasksByStatus('done').length
  const totalTasks = tasks.length
  const activeCount = totalTasks - doneCount
  const progress =
    totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100)
  const latestTasks = tasks.slice(-4).reverse()
  const todoShare =
    totalTasks === 0 ? 0 : Math.round((todoCount / totalTasks) * 100)
  const doingShare =
    totalTasks === 0 ? 0 : Math.round((doingCount / totalTasks) * 100)
  const doneShare =
    totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100)
  const focusLabel =
    progress >= 75 ? 'On track' : progress >= 40 ? 'Building' : 'Kickoff'

  return (
    <div className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.8)] backdrop-blur-2xl animate-fade-up">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/40 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-6 h-16 w-40 rounded-full bg-fuchsia-400/20 blur-2xl"
            />
            <div className="relative space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Glass
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                  Status: {focusLabel}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                  Active: {activeCount}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Todo Board
                </h1>
                <p className="mt-3 text-white/70">
                  Raden Whisnu Arya Nugraha.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Todo</span>
                    <span>{todoShare}%</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {todoCount}
                  </p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-sky-300"
                      style={{ width: `${todoShare}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>In Progress</span>
                    <span>{doingShare}%</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {doingCount}
                  </p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-300"
                      style={{ width: `${doingShare}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Done</span>
                    <span>{doneShare}%</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {doneCount}
                  </p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-300"
                      style={{ width: `${doneShare}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.8)] backdrop-blur-2xl animate-fade-up">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Progress
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {progress}%
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Focus: {focusLabel}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                    Active {activeCount}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                    Done {doneCount}
                  </span>
                </div>
              </div>
              <div className="relative h-28 w-28 shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#38bdf8 ${progress}%, rgba(255,255,255,0.12) 0)`,
                  }}
                />
                <div className="absolute inset-2 grid place-items-center rounded-full bg-white/15 text-sm font-semibold text-white shadow-sm backdrop-blur">
                  {progress}%
                </div>
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-white/60">Todo</p>
                <p className="text-lg font-semibold text-white">
                  {todoCount}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-white/60">In Progress</p>
                <p className="text-lg font-semibold text-white">
                  {doingCount}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-white/60">Done</p>
                <p className="text-lg font-semibold text-white">
                  {doneCount}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Form Input */}
        <section className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.7)] backdrop-blur-2xl animate-fade-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Quick Add</p>
              <p className="text-xs text-white/60">
                Tekan Enter untuk tambah task lebih cepat.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                Default: Todo
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1">
                Auto clear
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-linear-to-r from-white/20 via-white/5 to-white/20 p-px">
            <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addTask()}
                placeholder="Tambah task baru..."
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 shadow-sm outline-none transition focus:border-white/40 focus:ring-4 focus:ring-sky-400/30"
              />
              <button
                type="button"
                onClick={addTask}
                className="rounded-xl bg-linear-to-r from-sky-300 via-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Add task
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Board: 3 Columns */}
          <div className="rounded-3xl border border-white/40 bg-white/80 p-5 text-slate-900 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Board</p>
                <p className="text-xs text-slate-500">
                  Move tasks with the buttons.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                  View: Kanban
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                  Total: {totalTasks}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {columns.map((status, index) => {
                const config = columnConfig[status]
                const columnTasks = getTasksByStatus(status)
                const columnShare =
                  totalTasks === 0
                    ? 0
                    : Math.round((columnTasks.length / totalTasks) * 100)

                return (
                  <div
                    key={status}
                    className={`rounded-2xl border ${config.color} bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md animate-fade-up`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                          {config.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {columnTasks.length}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {columnShare}%
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 h-1 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${config.dot}`}
                        style={{ width: `${columnShare}%` }}
                      />
                    </div>

                    <div className="space-y-3 min-h-35">
                      {columnTasks.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">
                          No tasks yet
                        </p>
                      ) : (
                        columnTasks.map((task) => (
                          <div
                            key={task.id}
                            className="group relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300"
                          >
                            <span
                              aria-hidden="true"
                              className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${config.dot}`}
                            />
                            <div className="flex items-center justify-between gap-2 pl-2">
                              <p className="text-sm text-slate-800">
                                {task.title}
                              </p>
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${config.badge}`}
                              >
                                {config.title}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 pl-2 text-xs opacity-80 transition group-hover:opacity-100 group-focus-within:opacity-100">
                              {status !== 'todo' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    moveTask(
                                      task.id,
                                      status === 'doing' ? 'todo' : 'doing'
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                >
                                  Back
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
                                  className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                >
                                  Next
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="ml-auto rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                              >
                                Delete
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

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/40 bg-white/80 p-4 text-slate-900 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Latest tasks
                  </p>
                  <p className="text-xs text-slate-500">Recent activity</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                  {latestTasks.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {latestTasks.length === 0 ? (
                  <p className="text-sm text-slate-400">No recent tasks.</p>
                ) : (
                  latestTasks.map((task) => {
                    const config = columnConfig[task.status]

                    return (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={`h-2 w-2 rounded-full ${config.dot}`}
                            />
                            <p className="text-sm text-slate-700 truncate">
                              {task.title}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${config.badge}`}
                          >
                            {config.title}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-white/40 bg-white/80 p-4 text-slate-900 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Focus metrics
                  </p>
                  <p className="text-xs text-slate-500">
                    Keep your day balanced
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
                  {focusLabel}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Active tasks</span>
                  <span className="font-semibold text-slate-900">
                    {activeCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completion</span>
                  <span className="font-semibold text-slate-900">
                    {progress}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next milestone</span>
                  <span className="font-semibold text-slate-900">
                    {Math.min(100, progress + 10)}%
                  </span>
                </div>
              </div>
              <div className="mt-5 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-slate-900 to-slate-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default App
