import { useState, useEffect, useMemo } from 'react'
import questions from './data/questions.json'

const subjectColors = {
  'Matemática': { color: '#3b82f6', light: '#dbeafe' },
  'Português': { color: '#8b5cf6', light: '#ede9fe' },
  'Literatura': { color: '#a855f7', light: '#f3e8ff' },
  'História': { color: '#f97316', light: '#ffedd5' },
  'Biologia': { color: '#22c55e', light: '#dcfce7' },
  'Química': { color: '#ef4444', light: '#fee2e2' },
  'Física': { color: '#06b6d4', light: '#cffafe' },
  'Geografia': { color: '#eab308', light: '#fef9c3' },
  'Filosofia': { color: '#ec4899', light: '#fce7f3' },
  'Artes': { color: '#f43f5e', light: '#ffe4e6' },
  'Espanhol': { color: '#fbbf24', light: '#fef3c7' },
  'Inglês': { color: '#6366f1', light: '#e0e7ff' },
  'Francês': { color: '#0ea5e9', light: '#e0f2fe' },
}

const getSubjectColor = (subject) => subjectColors[subject] || { color: '#6b7280', light: '#f3f4f6' }

// Circular progress component
const CircularProgress = ({ value, size = 120, strokeWidth = 8, color = '#10b981', trackColor = 'rgba(0,0,0,0.1)' }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pas-dark-mode')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pas-stats')
    return saved ? JSON.parse(saved) : { correct: 0, wrong: 0, answered: [] }
  })
  const [filters, setFilters] = useState({ year: 'all', subject: 'all' })
  const [hoveredSubject, setHoveredSubject] = useState(null)

  const filteredQuestions = useMemo(() => questions.filter(q => {
    if (filters.year !== 'all' && q.year !== parseInt(filters.year)) return false
    if (filters.subject !== 'all' && q.subject !== filters.subject) return false
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      return (
        q.statement?.toLowerCase().includes(query) || 
        q.subject.toLowerCase().includes(query) ||
        q.alternatives?.some(a => a.text.toLowerCase().includes(query))
      )
    }
    return true
  }), [filters, searchQuery])

  const question = filteredQuestions[currentIndex]
  const years = [...new Set(questions.map(q => q.year))].sort((a, b) => b - a)
  const subjects = [...new Set(questions.map(q => q.subject))].sort()

  const statsBySubject = useMemo(() => subjects.map(subject => {
    const subjectQuestions = questions.filter(q => q.subject === subject)
    const answered = stats.answered.filter(a => subjectQuestions.some(q => q.id === a.id))
    const correct = answered.filter(a => a.correct).length
    return { subject, total: subjectQuestions.length, answered: answered.length, correct, percentage: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0 }
  }), [stats.answered])

  useEffect(() => { localStorage.setItem('pas-stats', JSON.stringify(stats)) }, [stats])
  useEffect(() => {
    const saved = localStorage.getItem('pas-dark-mode')
    if (saved === null) {
      localStorage.setItem('pas-dark-mode', JSON.stringify(true))
    } else {
      localStorage.setItem('pas-dark-mode', JSON.stringify(darkMode))
    }
    document.documentElement.style.backgroundColor = darkMode ? '#050505' : '#f8f5f0'
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    if (themeMeta) {
      themeMeta.setAttribute('content', darkMode ? '#050505' : '#f8f5f0')
    }
  }, [darkMode])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (imageModalOpen) setImageModalOpen(false)
        else if (currentView === 'questions') setCurrentView('home')
        return
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      if (currentView !== 'questions') return
      switch(e.key) {
        case 'ArrowRight': nextQuestion(); break
        case 'ArrowLeft': prevQuestion(); break
        case 'c': case 'C': if (question?.type === 'C' && !showResult) handleAnswer('C'); break
        case 'e': case 'E': if (question?.type === 'C' && !showResult) handleAnswer('E'); break
        case 'a': case 'A': if (question?.type === 'A' && !showResult) handleAnswer('A'); break
        case 'b': case 'B': if (question?.type === 'A' && !showResult) handleAnswer('B'); break
        case 'd': case 'D': if (question?.type === 'A' && !showResult) handleAnswer('D'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, showResult, currentView, imageModalOpen])

  const handleAnswer = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    const isCorrect = answer === question.correctAnswer
    setStats(s => ({ ...s, correct: s.correct + (isCorrect ? 1 : 0), wrong: s.wrong + (isCorrect ? 0 : 1), answered: [...s.answered, { id: question.id, correct: isCorrect }] }))
  }

  const nextQuestion = () => { setSelectedAnswer(null); setShowResult(false); setCurrentIndex(i => (i + 1) % filteredQuestions.length) }
  const prevQuestion = () => { setSelectedAnswer(null); setShowResult(false); setCurrentIndex(i => (i - 1 + filteredQuestions.length) % filteredQuestions.length) }
  
  const startStudy = (subject = 'all', year = 'all') => {
    setFilters({ subject, year })
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setSearchQuery('')
    setCurrentView('questions')
  }

  const total = stats.correct + stats.wrong
  const percentage = total > 0 ? Math.round((stats.correct / total) * 100) : 0
  const currentSubjectColor = question ? getSubjectColor(question.subject) : null

  // Theme
  const t = {
    bg: darkMode ? 'bg-[#050505]' : 'bg-[#f8f5f0]',
    text: darkMode ? 'text-white' : 'text-stone-800',
    textMuted: darkMode ? 'text-white/40' : 'text-stone-500',
    textSubtle: darkMode ? 'text-white/60' : 'text-stone-600',
    card: darkMode ? 'bg-white/[0.03] border-white/5' : 'bg-white border-stone-200/80 shadow-sm',
    cardHover: darkMode ? 'hover:bg-white/[0.06] hover:border-white/10' : 'hover:bg-white hover:border-stone-300 hover:shadow-md',
    input: darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-white border-stone-200 text-stone-800 placeholder:text-stone-400',
    divider: darkMode ? 'border-white/5' : 'border-stone-200',
    progressTrack: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
  }

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} overflow-hidden transition-colors duration-500`}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
            {hoveredSubject && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-700" style={{ backgroundColor: `${getSubjectColor(hoveredSubject).color}15` }} />
            )}
          </>
        ) : (
          <>
            <div className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)' }} />
            {hoveredSubject && currentView === 'home' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[100px] transition-all duration-500" style={{ background: `radial-gradient(circle, ${getSubjectColor(hoveredSubject).color}25 0%, transparent 60%)` }} />
            )}
            {currentView === 'questions' && currentSubjectColor && (
              <div className="absolute top-0 left-0 right-0 h-[500px] transition-all duration-500" style={{ background: `linear-gradient(180deg, ${currentSubjectColor.color}15 0%, transparent 100%)` }} />
            )}
          </>
        )}
      </div>

      <div className="relative z-10 min-h-screen">
        {currentView === 'home' && (
          <div className="min-h-screen p-6 lg:p-10 flex flex-col">
            <div className="w-full max-w-6xl mx-auto flex flex-col flex-1">
              {/* Top Bar */}
              <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base ${darkMode ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-500/30' : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'}`}>P</div>
                  <div>
                    <h1 className={`text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-stone-800'}`}>Estude PAS</h1>
                    <p className={`text-xs ${t.textMuted}`}>UnB • 1ª Etapa</p>
                  </div>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${darkMode ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-stone-200 hover:bg-stone-50 shadow-sm'}`}>
                  {darkMode ? <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  : <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                </button>
              </header>

              {/* Hero */}
              <section className={`relative mb-10 p-8 rounded-3xl border overflow-hidden ${darkMode ? 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border-white/10' : 'bg-gradient-to-br from-emerald-100 via-teal-50 to-white border-emerald-200/60 shadow-xl shadow-emerald-500/10'}`}>
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)' }} />
                <div className="relative grid gap-6 md:grid-cols-[1.4fr_0.6fr] items-center">
                  <div>
                    <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3 ${darkMode ? 'text-white' : 'text-stone-800'}`}>
                      Domine o <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent">PAS da UnB</span>
                    </h2>
                    <p className={`text-sm sm:text-base mb-5 ${t.textMuted}`}>Questões reais das provas anteriores. Pratique por matéria, acompanhe seu progresso e conquiste sua vaga.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => startStudy()} className={`group inline-flex items-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all ${darkMode ? 'bg-white text-emerald-600 hover:bg-emerald-400 hover:text-white shadow-xl' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'}`}>
                        Começar agora
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                      {total > 0 && (
                        <button onClick={() => setCurrentView('stats')} className={`px-4 py-3 text-sm font-medium rounded-xl border ${darkMode ? 'border-white/20 text-white/70 hover:text-white hover:bg-white/10' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                          Ver estatísticas
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-emerald-200/60'}`}>
                    <p className={`text-xs mb-3 ${t.textMuted}`}>Resumo rápido</p>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <CircularProgress value={percentage} size={72} strokeWidth={6} color={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'} trackColor={t.progressTrack} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold">{percentage}%</span>
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-stone-800'}`}>{total} respondidas</p>
                        <p className={`text-xs ${t.textMuted}`}>{subjects.length} matérias • {years[0]} prova</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cards Grid */}
              <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 grid-flow-dense content-start">
              {/* Stats Card - featured */}
              {total > 0 && (
                <button onClick={() => setCurrentView('stats')} className={`col-span-2 sm:col-span-3 md:col-span-2 lg:col-span-2 md:row-span-2 p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.01] ${darkMode ? 'bg-gradient-to-br from-emerald-500/25 via-teal-500/15 to-cyan-500/10 border-emerald-400/40 hover:border-emerald-300/70' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300 hover:border-emerald-400 shadow-xl shadow-emerald-500/15'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={`text-xs font-semibold tracking-wide ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>SEU PROGRESSO</p>
                    <span className={`text-xs font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>Ver detalhes →</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <CircularProgress value={percentage} size={78} strokeWidth={7} color={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'} trackColor={darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-bold">{percentage}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-500">{stats.correct}</span>
                        <span className={`text-xs ${t.textMuted}`}>certas</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-500">{stats.wrong}</span>
                        <span className={`text-xs ${t.textMuted}`}>erradas</span>
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Subject Cards */}
              {subjects.map((subject) => {
                const { color } = getSubjectColor(subject)
                const subjectStats = statsBySubject.find(s => s.subject === subject)
                const count = questions.filter(q => q.subject === subject).length
                const progress = subjectStats ? (subjectStats.answered / subjectStats.total) * 100 : 0
                return (
                  <button key={subject} onClick={() => startStudy(subject)} onMouseEnter={() => setHoveredSubject(subject)} onMouseLeave={() => setHoveredSubject(null)}
                    className={`p-3 rounded-xl border transition-all duration-300 text-left group hover:scale-[1.02] ${darkMode ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10' : 'bg-white/80 backdrop-blur border-stone-200 hover:border-stone-300 hover:shadow-lg'}`}
                    style={!darkMode ? { boxShadow: `0 4px 20px -5px ${color}30` } : {}}>
                    <div className="w-2.5 h-2.5 rounded-full mb-2 group-hover:scale-125 transition-transform" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }} />
                    <h3 className={`font-medium text-xs mb-0.5 truncate ${darkMode ? 'text-white/90' : 'text-stone-800'}`}>{subject}</h3>
                    <p className={`text-[10px] ${t.textMuted}`}>{count} questões</p>
                    {progress > 0 && (
                      <div className={`mt-2 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-stone-200'}`}>
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Year Cards */}
              {years.map(year => (
                <button key={year} onClick={() => startStudy('all', year)} className={`p-3 rounded-xl border transition-all duration-300 text-left group hover:scale-[1.02] ${darkMode ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:border-indigo-400/40' : 'bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur border-indigo-200 hover:border-indigo-300 hover:shadow-lg'}`}>
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{year}</span>
                  <p className={`text-[10px] mt-0.5 ${t.textMuted}`}>{questions.filter(q => q.year === year).length} questões</p>
                </button>
              ))}
            </section>

            <footer className="mt-auto pt-6 pb-4 text-center">
              <p className={`text-xs ${darkMode ? 'text-white/20' : 'text-stone-400'}`}>PAS UnB 1ª Etapa · CEBRASPE · Feito por Diogo e Lucas 🗿🗿</p>
            </footer>
            </div>
          </div>
        )}

        {currentView === 'questions' && (
          <div className="h-screen flex flex-col">
            {/* Header */}
            <header className={`flex items-center gap-3 p-3 border-b ${t.divider}`}>
              <button onClick={() => setCurrentView('home')} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Search */}
              <div className="flex-1 max-w-md relative">
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Buscar: vírus, revolução, Bach..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0) }}
                  className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${t.input}`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textMuted} hover:${t.text}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              <select value={filters.subject} onChange={(e) => { setFilters(f => ({ ...f, subject: e.target.value })); setCurrentIndex(0) }} className={`px-3 py-2 rounded-lg text-sm border ${t.input}`}>
                <option value="all">Todas</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.year} onChange={(e) => { setFilters(f => ({ ...f, year: e.target.value })); setCurrentIndex(0) }} className={`px-3 py-2 rounded-lg text-sm border ${t.input}`}>
                <option value="all">Todos</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border ${t.card} ${t.cardHover}`}>
                {darkMode ? <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                : <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>

              <div className={`text-sm ${t.textMuted} min-w-[60px] text-right`}>
                <span className={`font-medium ${t.text}`}>{currentIndex + 1}</span>/{filteredQuestions.length}
              </div>
            </header>

            {/* Progress */}
            <div className={`h-1 ${darkMode ? 'bg-white/5' : 'bg-stone-200'}`}>
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }} />
            </div>

            {/* Question */}
            {question ? (
              <main className="flex-1 overflow-auto p-4 lg:p-6">
                <div className="max-w-3xl mx-auto">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: currentSubjectColor?.color, boxShadow: darkMode ? `0 2px 12px ${currentSubjectColor?.color}50` : `0 2px 8px ${currentSubjectColor?.color}30` }}>{question.subject}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-white/10 text-white/60' : 'bg-stone-100 text-stone-600'}`}>{question.year} · Q{question.questionNumber}</span>
                    <span className={`ml-auto text-xs ${t.textMuted}`}>{question.type === 'C' ? 'Certo ou Errado' : 'Múltipla escolha'}</span>
                  </div>

                  {/* Image */}
                  {question.hasImage && question.imageUrl && (
                    <div onClick={() => setImageModalOpen(true)} className={`mb-4 rounded-xl overflow-hidden border cursor-zoom-in transition-colors hover:border-emerald-500/50 ${darkMode ? 'border-white/10' : 'border-stone-200'}`}>
                      <img src={question.imageUrl} alt="Referência" className="w-full h-auto max-h-48 object-contain bg-white" />
                    </div>
                  )}

                  {/* Statement */}
                  <p className={`text-base lg:text-lg leading-relaxed whitespace-pre-line mb-6 ${darkMode ? 'text-white/90' : 'text-stone-800'}`}>{question.statement}</p>

                  {/* Answers */}
                  {question.type === 'C' ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[{ value: 'C', label: 'Certo' }, { value: 'E', label: 'Errado' }].map(opt => (
                        <button key={opt.value} onClick={() => handleAnswer(opt.value)} disabled={showResult}
                          className={`relative py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                            showResult
                              ? opt.value === question.correctAnswer
                                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-[1.02]'
                                : selectedAnswer === opt.value
                                  ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                  : darkMode ? 'bg-white/5 text-white/20' : 'bg-stone-100 text-stone-300'
                              : darkMode 
                                ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-[1.01] border border-white/10 hover:border-white/20'
                                : 'bg-white text-stone-800 hover:bg-stone-50 border-2 border-stone-200 hover:border-emerald-400 hover:shadow-lg shadow-md'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  ) : question.alternatives ? (
                    <div className="space-y-2">
                      {question.alternatives.map(alt => (
                        <button key={alt.letter} onClick={() => handleAnswer(alt.letter)} disabled={showResult}
                          className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 ${
                            showResult
                              ? alt.letter === question.correctAnswer
                                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30'
                                : selectedAnswer === alt.letter
                                  ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                  : darkMode ? 'bg-white/5 text-white/20' : 'bg-stone-100 text-stone-300'
                              : darkMode 
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20'
                                : 'bg-white text-stone-800 hover:bg-stone-50 border-2 border-stone-200 hover:border-emerald-400 hover:shadow-md shadow-sm'
                          }`}>
                          <span className="flex items-start gap-3">
                            <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${showResult && (alt.letter === question.correctAnswer || selectedAnswer === alt.letter) ? 'bg-white/20' : darkMode ? 'bg-white/10' : 'bg-stone-100'}`}>{alt.letter}</span>
                            <span className="pt-0.5 text-sm">{alt.text}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {/* Result */}
                  {showResult && (
                    <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${selectedAnswer === question.correctAnswer ? darkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200' : darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white ${selectedAnswer === question.correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {selectedAnswer === question.correctAnswer ? '✓' : '✗'}
                      </div>
                      <div>
                        <p className={`font-semibold ${selectedAnswer === question.correctAnswer ? 'text-emerald-500' : 'text-red-500'}`}>
                          {selectedAnswer === question.correctAnswer ? 'Correto!' : 'Incorreto'}
                        </p>
                        {selectedAnswer !== question.correctAnswer && <p className={`text-sm ${t.textMuted}`}>Gabarito: {question.type === 'C' ? (question.correctAnswer === 'C' ? 'Certo' : 'Errado') : question.correctAnswer}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </main>
            ) : (
              <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-lg ${t.textMuted}`}>Nenhuma questão encontrada</p>
                  <button onClick={() => { setSearchQuery(''); setFilters({ year: 'all', subject: 'all' }) }} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg">Limpar filtros</button>
                </div>
              </main>
            )}

            {/* Footer */}
            {question && (
              <footer className={`p-3 border-t ${t.divider}`}>
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <button onClick={prevQuestion} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="hidden sm:inline text-sm">Anterior</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, filteredQuestions.length))].map((_, i) => {
                      const idx = Math.max(0, Math.min(currentIndex - 2, filteredQuestions.length - 5)) + i
                      return (
                        <button key={idx} onClick={() => { setCurrentIndex(idx); setSelectedAnswer(null); setShowResult(false) }}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${idx === currentIndex ? darkMode ? 'bg-white text-black' : 'bg-emerald-500 text-white' : darkMode ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}>{idx + 1}</button>
                      )
                    })}
                  </div>

                  <button onClick={nextQuestion} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${darkMode ? 'bg-white text-black hover:bg-emerald-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'}`}>
                    <span className="hidden sm:inline text-sm">Próxima</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </footer>
            )}
          </div>
        )}

        {currentView === 'stats' && (
          <div className="min-h-screen p-4 lg:p-8">
            <header className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentView('home')} className={`flex items-center gap-2 transition-colors ${t.textMuted}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                Voltar
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-9 h-9 rounded-xl border flex items-center justify-center ${t.card} ${t.cardHover}`}>
                {darkMode ? <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                : <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
            </header>

            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-1">Estatísticas</h1>
              <p className={`mb-8 ${t.textMuted}`}>Seu desempenho</p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-gradient-to-br from-white/[0.07] to-transparent border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{total}</p>
                  <p className={`text-xs mt-1 ${t.textMuted}`}>respondidas</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-3xl font-bold text-emerald-500">{stats.correct}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-emerald-400/60' : 'text-emerald-600'}`}>corretas</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-3xl font-bold text-red-500">{stats.wrong}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-red-400/60' : 'text-red-600'}`}>erradas</p>
                </div>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <CircularProgress value={percentage} size={160} strokeWidth={12} color={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'} trackColor={t.progressTrack} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{percentage}%</span>
                    <span className={`text-xs ${t.textMuted}`}>acertos</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold mb-3">Por matéria</h2>
                {statsBySubject.map(stat => {
                  const { color } = getSubjectColor(stat.subject)
                  return (
                    <div key={stat.subject} className={`p-3 rounded-xl border ${t.card} ${t.cardHover}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-medium text-sm">{stat.subject}</span>
                        </div>
                        <span className={`text-xs font-medium ${stat.answered === 0 ? t.textMuted : stat.percentage >= 70 ? 'text-emerald-500' : stat.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {stat.answered > 0 ? `${stat.percentage}%` : '—'}
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-stone-200'}`}>
                        <div className="h-full rounded-full" style={{ width: `${stat.answered > 0 ? (stat.answered / stat.total) * 100 : 0}%`, backgroundColor: color }} />
                      </div>
                      <p className={`text-[10px] mt-1.5 ${t.textMuted}`}>{stat.correct}/{stat.answered} · {stat.answered}/{stat.total}</p>
                    </div>
                  )
                })}
              </div>

              <button onClick={() => { if (confirm('Zerar estatísticas?')) { setStats({ correct: 0, wrong: 0, answered: [] }); setCurrentView('home') } }}
                className={`w-full mt-6 py-3 rounded-xl border font-medium text-sm ${darkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}>
                Zerar estatísticas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {imageModalOpen && question?.imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setImageModalOpen(false)}>
          <button onClick={() => setImageModalOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={question.imageUrl} alt="Ampliada" className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default App
