import { useState, useEffect, useMemo } from 'react'
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  ClipboardList,
  Flame,
  Tag,
  Edit2,
  Check,
  X,
  Clock,
  Compass,
  Target,
  BookOpen,
  Activity,
  HelpCircle,
} from 'lucide-react'
import type { Task, PriorityType, CategoryType } from './types'

type ColumnType = 'todo' | 'doing' | 'done'

const columnConfig: Record<
  ColumnType,
  { title: string; borderGlow: string; dot: string; textAccent: string; bgAccent: string }
> = {
  todo: {
    title: 'Tugas Baru',
    borderGlow: 'hover:border-sky-400/35 border-sky-500/10',
    dot: 'bg-sky-400',
    textAccent: 'text-sky-300',
    bgAccent: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  },
  doing: {
    title: 'Sedang Dikerjakan',
    borderGlow: 'hover:border-amber-400/35 border-amber-500/10',
    dot: 'bg-amber-400',
    textAccent: 'text-amber-300',
    bgAccent: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  },
  done: {
    title: 'Selesai',
    borderGlow: 'hover:border-emerald-400/35 border-emerald-500/10',
    dot: 'bg-emerald-400',
    textAccent: 'text-emerald-300',
    bgAccent: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  },
}

const columnIcons: Record<ColumnType, React.ReactNode> = {
  todo: <ClipboardList className="h-5 w-5 text-sky-400" aria-hidden="true" />,
  doing: <Flame className="h-5 w-5 text-amber-400 animate-pulse" aria-hidden="true" />,
  done: <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />,
}

const categoryColors: Record<CategoryType, string> = {
  Work: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-300',
  Personal: 'bg-pink-400/10 border-pink-400/20 text-pink-300',
  Urgent: 'bg-rose-400/10 border-rose-400/20 text-rose-300',
  Project: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
  Other: 'bg-slate-400/10 border-slate-400/20 text-slate-300',
}

const priorityDetails: Record<PriorityType, { label: string; bg: string; text: string; dot: string }> = {
  high: {
    label: 'High Priority',
    bg: 'bg-rose-500/10 border border-rose-500/20',
    text: 'text-rose-300',
    dot: 'bg-rose-500',
  },
  medium: {
    label: 'Medium Priority',
    bg: 'bg-amber-500/10 border border-amber-500/20',
    text: 'text-amber-300',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low Priority',
    bg: 'bg-emerald-500/10 border border-emerald-500/20',
    text: 'text-emerald-300',
    dot: 'bg-emerald-500',
  },
}

const PRODUCTIVITY_TIPS = [
  {
    title: 'The 2-Minute Rule',
    desc: 'Jika suatu tugas butuh waktu kurang dari 2 menit, lakukan segera tanpa menundanya.',
    icon: <Target className="w-5 h-5 text-pink-400" />,
  },
  {
    title: 'Eat the Frog First',
    desc: 'Selesaikan tugas paling berat atau penting terlebih dahulu di pagi hari saat fokus terbaik.',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
  },
  {
    title: 'Ruthless Prioritization',
    desc: 'Fokus pada dampak. Kelompokkan tugas ke skala prioritas demi melindungi energi harian.',
    icon: <Sparkles className="w-5 h-5 text-sky-400" />,
  },
  {
    title: 'Time Blocking',
    desc: 'Alokasikan blok waktu khusus di kalender untuk kerja terfokus guna menghindari distraksi.',
    icon: <Compass className="w-5 h-5 text-indigo-400" />,
  },
]

// Default empty tasks
const defaultTasks: Task[] = []

function App() {
  // Sync state with local storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todo_board_tasks_premium')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed parsing tasks from localstorage, using defaults.', e)
      }
    }
    return defaultTasks
  })

  // Quick Add Inputs
  const [inputValue, setInputValue] = useState('')
  const [priorityValue, setPriorityValue] = useState<PriorityType>('low')
  const [categoryValue, setCategoryValue] = useState<CategoryType>('Work')

  // Search, Filters & Sorting Toolbar States
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  // Card Inline Edit Mode
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<PriorityType>('low')
  const [editCategory, setEditCategory] = useState<CategoryType>('Work')

  // Productivity Tip rotation
  const [tipIndex, setTipIndex] = useState(0)

  // Generate randomized particles/bubbles that rise continuously
  const bubbles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      size: Math.random() * 12 + 6, // 6px to 18px size
      left: Math.random() * 100, // 0% to 100% of screen width
      duration: Math.random() * 10 + 8, // 8s to 18s duration
      delay: Math.random() * 14, // staggered starting delays up to 14s
      sway: Math.random() * 50 - 25, // horizontal sway from -25px to 25px
    }))
  }, [])

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('todo_board_tasks_premium', JSON.stringify(tasks))
  }, [tasks])

  // Handle rotating tips
  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % PRODUCTIVITY_TIPS.length)
  }

  // Handlers
  const addTask = () => {
    if (inputValue.trim() === '') return

    const newTask: Task = {
      id: Date.now(),
      title: inputValue.trim(),
      status: 'todo',
      priority: priorityValue,
      category: categoryValue,
      createdAt: Date.now(),
    }

    setTasks([...tasks, newTask])
    setInputValue('')
    setPriorityValue('low')
    setCategoryValue('Work')
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (editingTaskId === taskId) {
      setEditingTaskId(null)
    }
  }

  const moveTask = (taskId: number, direction: 'back' | 'next') => {
    const statuses: ColumnType[] = ['todo', 'doing', 'done']
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const currentIndex = statuses.indexOf(task.status)
          let nextIndex = currentIndex
          if (direction === 'next' && currentIndex < 2) {
            nextIndex = currentIndex + 1
          } else if (direction === 'back' && currentIndex > 0) {
            nextIndex = currentIndex - 1
          }
          return { ...task, status: statuses[nextIndex] }
        }
        return task
      })
    )
  }

  // Inline Edit logic
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditCategory(task.category)
  }

  const saveEditing = () => {
    if (!editTitle.trim()) return

    setTasks(
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title: editTitle.trim(),
              priority: editPriority,
              category: editCategory,
            }
          : task
      )
    )
    setEditingTaskId(null)
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
  }

  // Metrics (Zero Redundancy - calculated once for the circular ring and column shares)
  const totalTasks = tasks.length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100)

  // Filtered & Sorted Tasks
  const processedTasks = useMemo(() => {
    let result = [...tasks]

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query)
      )
    }

    // Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter)
    }

    // Priority Filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter)
    }

    // Sort Logic
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt - a.createdAt
      }
      if (sortBy === 'oldest') {
        return a.createdAt - b.createdAt
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 }
        return priorityWeight[b.priority] - priorityWeight[a.priority]
      }
      return 0
    })

    return result
  }, [tasks, searchQuery, categoryFilter, priorityFilter, sortBy])

  // Get task array per status from processed list
  const getTasksByStatus = (status: ColumnType) => {
    return processedTasks.filter((t) => t.status === status)
  }

  // Relative Time utility
  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins}m yang lalu`
    if (diffHours < 24) return `${diffHours}j yang lalu`

    const date = new Date(timestamp)
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
  }

  // Circular Progress parameters
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  // Latest added tasks (up to 3) for the activity log (no duplicated statistics!)
  const latestAdded = [...tasks]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 text-slate-100 z-10 relative">
      {/* Gelembung Udara / Rising Water Bubbles Background Animation */}
      <div className="bubbles-container" aria-hidden="true">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--sway-distance': `${b.sway}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
        
        {/* HEADER PANEL - Premium Welcoming, Unified Statistics */}
        <header className="grid gap-6 md:grid-cols-[1fr,360px] animate-fade-up">
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-40">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-8 h-20 w-44 rounded-full bg-indigo-500/10 blur-2xl"
            />
            
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-400/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-sky-300">
                  <Sparkles className="h-3 w-3 animate-spin-slow" />
                  Premium Space Workspace
                </span>
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-slate-300 text-[11px]">
                  Raden Whisnu Arya Nugraha
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-sky-400 via-indigo-300 to-pink-300">
                Todo Board Workspace
              </h1>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Kelola produktivitas harian Anda.
              </p>
            </div>
          </div>

          {/* Unified Completion Rate Widget (Single location for statistics) */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tingkat Penyelesaian</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">{progressPercentage}%</h2>
              <p className="text-xs text-slate-400 leading-tight">
                {doneCount} dari {totalTasks} tugas diselesaikan dengan sukses.
              </p>
              <div className="text-[11px] text-sky-300 font-medium">
                {progressPercentage >= 80
                  ? 'Luar biasa! Target hampir terpenuhi!'
                  : progressPercentage >= 50
                  ? 'Kerja bagus, teruskan momentum!'
                  : totalTasks === 0
                  ? 'Belum ada tugas di papan kerja.'
                  : 'Mari selesaikan beberapa tugas!'}
              </div>
            </div>
            
            <div className="relative shrink-0 flex items-center justify-center w-24 h-24">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-sky-400 transition-all duration-700 ease-out"
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute font-semibold text-sm text-white flex flex-col items-center">
                <span>{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </header>

        {/* QUICK ADD PANEL - Aesthetic Glass Inputs */}
        <section className="glass-panel rounded-3xl p-5 shadow-lg animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Tambah Tugas Baru</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Apa yang ingin Anda selesaikan hari ini?"
              className="glass-input rounded-2xl flex-1 w-full px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
            />
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Priority Selection */}
              <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 items-center">
                <span className="text-xs px-2 text-slate-500 font-medium">Prioritas:</span>
                {(['low', 'medium', 'high'] as PriorityType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityValue(p)}
                    className={`text-xs px-3 py-1 rounded-xl font-semibold capitalize transition cursor-pointer ${
                      priorityValue === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Category Dropdown */}
              <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 items-center">
                <Tag className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                <select
                  value={categoryValue}
                  onChange={(e) => setCategoryValue(e.target.value as CategoryType)}
                  className="bg-transparent text-xs text-slate-300 font-semibold px-2 py-1 outline-none cursor-pointer"
                >
                  {(['Work', 'Personal', 'Urgent', 'Project', 'Other'] as CategoryType[]).map((c) => (
                    <option key={c} value={c} className="bg-slate-950 text-slate-300">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={addTask}
                disabled={!inputValue.trim()}
                className={`inline-flex items-center gap-1.5 rounded-2xl bg-linear-to-r from-sky-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition active:translate-y-0.5 hover:scale-[1.02] cursor-pointer ${
                  !inputValue.trim() ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:shadow-sky-400/20'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTERS TOOLBAR */}
        <section className="glass-panel rounded-2xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between shadow-md animate-fade-up" style={{ animationDelay: '150ms' }}>
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul atau detail..."
              className="glass-input w-full rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-semibold outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950">Semua</option>
                {(['Work', 'Personal', 'Urgent', 'Project', 'Other'] as CategoryType[]).map((c) => (
                  <option key={c} value={c} className="bg-slate-950">{c}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Prioritas:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-semibold outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950">Semua</option>
                {(['low', 'medium', 'high'] as PriorityType[]).map((p) => (
                  <option key={p} value={p} className="bg-slate-950 capitalize">{p}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-semibold outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-950">Terbaru</option>
                <option value="oldest" className="bg-slate-950">Terlama</option>
                <option value="alphabetical" className="bg-slate-950">Abjad A-Z</option>
                <option value="priority" className="bg-slate-950">Prioritas Termahal</option>
              </select>
            </div>
          </div>
        </section>

        {/* BOARD AND SIDEBAR CONTAINER */}
        <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
          
          {/* BOARD: 3 COLUMNS */}
          <div className="glass-panel rounded-3xl p-5 shadow-xl animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(['todo', 'doing', 'done'] as ColumnType[]).map((colName) => {
                const config = columnConfig[colName]
                const colTasks = getTasksByStatus(colName)
                
                // Single source of column ratio
                const colShare = totalTasks === 0 ? 0 : Math.round((colTasks.length / totalTasks) * 100)

                return (
                  <div
                    key={colName}
                    className="flex flex-col rounded-2xl bg-slate-950/20 border border-white/5 p-3 min-h-90"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        {columnIcons[colName]}
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                          {config.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${config.bgAccent}`}>
                        {colTasks.length} ({colShare}%)
                      </span>
                    </div>

                    {/* Task Cards Container */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-137.5 pr-1">
                      {colTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <HelpCircle className="w-8 h-8 text-slate-700 mb-2" />
                          <p className="text-xs text-slate-500 font-medium">Belum ada tugas</p>
                        </div>
                      ) : (
                        colTasks.map((task) => {
                          const priorityInfo = priorityDetails[task.priority]
                          const categoryColor = categoryColors[task.category]
                          const isEditing = editingTaskId === task.id
                          const isDone = task.status === 'done'

                          return (
                            <div
                              key={task.id}
                              onDoubleClick={() => !isEditing && startEditing(task)}
                              className={`group relative glass-card rounded-2xl p-3.5 transition-all duration-300 border-l-[3.5px] cursor-pointer ${
                                isDone ? 'border-l-emerald-400 opacity-75' : 
                                task.priority === 'high' ? 'border-l-rose-400 shadow-[0_4px_16px_rgba(244,63,94,0.05)]' :
                                task.priority === 'medium' ? 'border-l-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.05)]' :
                                'border-l-sky-400'
                              } ${isEditing ? 'ring-2 ring-indigo-400/50 scale-[1.01]' : ''}`}
                              title="Double click untuk edit langsung"
                            >
                              {/* EDITING INTERFACE */}
                              {isEditing ? (
                                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                      <Edit2 className="w-2.5 h-2.5" /> EDITING
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={saveEditing}
                                        className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/35 transition cursor-pointer"
                                        title="Simpan Perubahan"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/35 transition cursor-pointer"
                                        title="Batal"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Judul tugas..."
                                    className="glass-input w-full rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                                  />

                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Prioritas</span>
                                      <select
                                        value={editPriority}
                                        onChange={(e) => setEditPriority(e.target.value as PriorityType)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-semibold cursor-pointer outline-none"
                                      >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[9px] text-slate-500 uppercase font-bold">Kategori</span>
                                      <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value as CategoryType)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-semibold cursor-pointer outline-none"
                                      >
                                        {(['Work', 'Personal', 'Urgent', 'Project', 'Other'] as CategoryType[]).map((cat) => (
                                          <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* DISPLAY INTERFACE */
                                <>
                                  {/* Title & Badge */}
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={`text-xs font-bold leading-snug tracking-wide text-white group-hover:text-sky-300 transition ${isDone ? 'line-through text-slate-400' : ''}`}>
                                      {task.title}
                                    </h4>
                                    <span className={`shrink-0 text-[9px] font-bold rounded-lg border px-1.5 py-0.5 ${categoryColor}`}>
                                      {task.category}
                                    </span>
                                  </div>

                                  {/* Metadata Row */}
                                  <div className="mt-3 flex flex-wrap gap-2 items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-400">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      <span>{formatRelativeTime(task.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
                                      <span className={`font-semibold ${priorityInfo.text}`}>{priorityInfo.label}</span>
                                    </div>
                                  </div>

                                  {/* Actions Hover Overlays */}
                                  <div className="mt-3 flex gap-1.5 items-center justify-end text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                                    {colName !== 'todo' && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          moveTask(task.id, 'back')
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1 text-[10px] text-slate-200 transition cursor-pointer"
                                        title="Pindah ke kolom sebelumnya"
                                      >
                                        <ChevronLeft className="h-3 w-3" />
                                        <span>Kembali</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        startEditing(task)
                                      }}
                                      className="p-1 rounded-lg border border-white/10 bg-white/5 hover:bg-sky-400/20 hover:text-sky-300 hover:border-sky-400/20 text-slate-300 transition cursor-pointer"
                                      title="Edit Tugas"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>

                                    {colName !== 'done' && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          moveTask(task.id, 'next')
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-sky-400 to-indigo-500 hover:brightness-110 px-2.5 py-1 text-[10px] font-bold text-white transition cursor-pointer"
                                        title="Pindah ke kolom selanjutnya"
                                      >
                                        <span>Lanjut</span>
                                        <ChevronRight className="h-3 w-3" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteTask(task.id)
                                      }}
                                      className="p-1 rounded-lg border border-rose-500/10 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/30 text-rose-300 transition ml-1 cursor-pointer"
                                      title="Hapus Tugas"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SIDEBAR: ACTIVITY FEED & SPARK TIP CARD */}
          <aside className="space-y-4 animate-fade-up" style={{ animationDelay: '250ms' }}>
            
            {/* SLEEK HISTORY/ACTIVITY FEED */}
            <div className="glass-panel rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-sky-400" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                      Tugas Terbaru
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400">Log aktivitas penambahan</p>
                </div>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-400 font-bold">
                  {latestAdded.length} tugas
                </span>
              </div>

              <div className="space-y-3">
                {latestAdded.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4 font-medium">Belum ada aktivitas.</p>
                ) : (
                  latestAdded.map((task) => {
                    const isDone = task.status === 'done'
                    return (
                      <div
                        key={task.id}
                        className="rounded-xl bg-slate-950/20 border border-white/5 px-3 py-2 flex items-start justify-between gap-2.5 transition hover:bg-slate-950/30"
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${columnConfig[task.status].dot}`} />
                          )}
                          <div className="space-y-0.5 min-w-0">
                            <p className={`text-xs font-semibold text-slate-200 truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </p>
                            <p className="text-[9px] text-slate-500 flex items-center gap-1 font-medium">
                              <span>{task.category}</span>
                              <span>•</span>
                              <span>{formatRelativeTime(task.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                        
                        <span className={`text-[8px] font-extrabold uppercase rounded px-1.5 py-0.5 border shrink-0 ${
                          task.status === 'todo'
                            ? 'bg-sky-400/10 border-sky-400/20 text-sky-400'
                            : task.status === 'doing'
                            ? 'bg-amber-400/10 border-amber-400/20 text-amber-400'
                            : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                        }`}>
                          {task.status === 'todo' ? 'New' : task.status === 'doing' ? 'Work' : 'Done'}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* PRODUCTIVITY SPARK TIP CARD (Replaces redundant chart widget) */}
            <div className="glass-panel rounded-3xl p-5 shadow-lg bg-linear-to-br from-indigo-500/10 via-transparent to-pink-500/5 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl"
              />
              
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-pink-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Productivity Spark</h4>
              </div>

              {/* Tip Rotation Box */}
              <div className="min-h-21.25 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    {PRODUCTIVITY_TIPS[tipIndex].icon}
                    <span className="text-xs font-bold text-slate-200">{PRODUCTIVITY_TIPS[tipIndex].title}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                    {PRODUCTIVITY_TIPS[tipIndex].desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TIPS {tipIndex + 1}/{PRODUCTIVITY_TIPS.length}</span>
                  <button
                    onClick={nextTip}
                    className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Lanjut Tips</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </aside>
        </section>

      </div>
    </div>
  )
}

export default App
