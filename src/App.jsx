import { useState, useEffect } from 'react'
import questions from './data/questions.json'

// Cores por matéria
const subjectColors = {
  'Matemática': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', gradient: 'from-blue-500 to-blue-600' },
  'Português': { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500', gradient: 'from-purple-500 to-purple-600' },
  'Literatura': { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-500', gradient: 'from-violet-500 to-violet-600' },
  'História': { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500', gradient: 'from-orange-500 to-orange-600' },
  'Biologia': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', border: 'border-green-500', gradient: 'from-green-500 to-green-600' },
  'Química': { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600', border: 'border-red-500', gradient: 'from-red-500 to-red-600' },
  'Física': { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-500', gradient: 'from-cyan-500 to-cyan-600' },
  'Geografia': { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500', gradient: 'from-amber-500 to-amber-600' },
  'Filosofia': { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-500', gradient: 'from-pink-500 to-pink-600' },
  'Artes': { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-500', gradient: 'from-rose-500 to-rose-600' },
  'Espanhol': { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500', gradient: 'from-yellow-500 to-yellow-600' },
  'Inglês': { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500', gradient: 'from-indigo-500 to-indigo-600' },
}

const getSubjectColor = (subject) => subjectColors[subject] || { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500', gradient: 'from-gray-500 to-gray-600' }

// Ícones das matérias
const subjectIcons = {
  'Matemática': '📐',
  'Português': '📝',
  'Literatura': '📚',
  'História': '🏛️',
  'Biologia': '🧬',
  'Química': '⚗️',
  'Física': '⚡',
  'Geografia': '🌍',
  'Filosofia': '💭',
  'Artes': '🎨',
  'Espanhol': '🇪🇸',
  'Inglês': '🇬🇧',
}

function App() {
  const [currentView, setCurrentView] = useState('home') // home, questions, stats
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pas-dark-mode')
    return saved ? JSON.parse(saved) : false
  })
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pas-stats')
    return saved ? JSON.parse(saved) : { correct: 0, wrong: 0, answered: [] }
  })
  const [filters, setFilters] = useState({ year: 'all', subject: 'all' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredQuestions = questions.filter(q => {
    if (filters.year !== 'all' && q.year !== parseInt(filters.year)) return false
    if (filters.subject !== 'all' && q.subject !== filters.subject) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return q.statement?.toLowerCase().includes(query) || q.subject.toLowerCase().includes(query)
    }
    return true
  })

  const question = filteredQuestions[currentIndex]
  const years = [...new Set(questions.map(q => q.year))].sort((a, b) => b - a)
  const subjects = [...new Set(questions.map(q => q.subject))].sort()

  // Stats by subject
  const statsBySubject = subjects.map(subject => {
    const subjectQuestions = questions.filter(q => q.subject === subject)
    const answered = stats.answered.filter(a => subjectQuestions.some(q => q.id === a.id))
    const correct = answered.filter(a => a.correct).length
    return {
      subject,
      total: subjectQuestions.length,
      answered: answered.length,
      correct,
      percentage: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0
    }
  })

  useEffect(() => {
    localStorage.setItem('pas-stats', JSON.stringify(stats))
  }, [stats])

  useEffect(() => {
    localStorage.setItem('pas-dark-mode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
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
        case 'Escape': setCurrentView('home'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, showResult, currentView])

  const handleAnswer = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    const isCorrect = answer === question.correctAnswer
    setStats(s => ({ 
      ...s, 
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
      answered: [...s.answered, { id: question.id, correct: isCorrect }]
    }))
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentIndex(i => (i + 1) % filteredQuestions.length)
  }

  const prevQuestion = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentIndex(i => (i - 1 + filteredQuestions.length) % filteredQuestions.length)
  }

  const startStudy = (subject = 'all', year = 'all') => {
    setFilters({ subject, year })
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentView('questions')
  }

  const total = stats.correct + stats.wrong
  const percentage = total > 0 ? Math.round((stats.correct / total) * 100) : 0

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">PAS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg leading-tight">Estude PAS</h1>
                <p className="text-gray-400 text-xs">UnB 2026</p>
              </div>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="flex">
                <button className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-l-lg border-r border-gray-600 hover:bg-gray-600 transition-colors">
                  Todos
                </button>
                <input
                  type="text"
                  placeholder="Pesquisar questões, matérias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchQuery && startStudy()}
                  className="flex-1 px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button 
                  onClick={() => searchQuery && startStudy()}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-r-lg hover:from-emerald-500 hover:to-green-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
                <span className="text-green-400 font-semibold">{stats.correct}</span>
                <span className="text-gray-500">/</span>
                <span className="text-red-400 font-semibold">{stats.wrong}</span>
                {total > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold ${
                    percentage >= 70 ? 'bg-green-500/20 text-green-400' : 
                    percentage >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {percentage}%
                  </span>
                )}
              </div>

              {/* Dark Mode */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-700/50 border-t border-slate-600/50">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1 overflow-x-auto py-2 text-sm">
              <button 
                onClick={() => setCurrentView('home')}
                className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  currentView === 'home' 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600'
                }`}
              >
                🏠 Início
              </button>
              <button 
                onClick={() => startStudy()}
                className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  currentView === 'questions' 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600'
                }`}
              >
                📝 Questões
              </button>
              {subjects.slice(0, 6).map(subject => (
                <button 
                  key={subject}
                  onClick={() => startStudy(subject)}
                  className="px-4 py-1.5 rounded-lg whitespace-nowrap text-gray-300 hover:bg-slate-600 transition-colors"
                >
                  {subjectIcons[subject] || '📖'} {subject}
                </button>
              ))}
              <button 
                onClick={() => setCurrentView('stats')}
                className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  currentView === 'stats' 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600'
                }`}
              >
                📊 Estatísticas
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 p-2">
        {[
          { icon: '📚', label: 'Matérias', view: 'home' },
          { icon: '📝', label: 'Provas', action: () => startStudy() },
          { icon: '📊', label: 'Stats', view: 'stats' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => item.view ? setCurrentView(item.view) : item.action?.()}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className={`relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gradient-to-r from-emerald-900 to-teal-900' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} p-8 text-white`}>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Estude PAS! 🎓</h2>
                <p className="text-emerald-100 mb-4 max-w-xl">
                  Prepare-se para o PAS da UnB com questões das provas oficiais. 
                  Pratique por matéria, acompanhe seu progresso e alcance sua vaga!
                </p>
                <button 
                  onClick={() => startStudy()}
                  className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Começar a Estudar →
                </button>
              </div>
              <div className="absolute right-0 top-0 w-64 h-full opacity-10">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <path fill="currentColor" d="M47.5,-57.5C59.3,-45.8,65.2,-28.7,67.8,-11.1C70.4,6.5,69.6,24.7,61.3,38.5C53,52.3,37.1,61.8,19.8,67.5C2.5,73.3,-16.2,75.3,-32.8,69.8C-49.4,64.3,-63.8,51.3,-71.3,35.1C-78.8,18.9,-79.3,-0.5,-73.3,-17.3C-67.3,-34.1,-54.8,-48.3,-40.3,-59.3C-25.8,-70.3,-9.3,-78.1,4.8,-83.8C18.9,-89.5,35.7,-69.1,47.5,-57.5Z" transform="translate(100 100)" />
                </svg>
              </div>
            </div>

            {/* Quick Stats */}
            {total > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Questões', value: total, icon: '📝', color: 'blue' },
                  { label: 'Acertos', value: stats.correct, icon: '✅', color: 'green' },
                  { label: 'Erros', value: stats.wrong, icon: '❌', color: 'red' },
                  { label: 'Taxa', value: `${percentage}%`, icon: '📊', color: percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'red' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Study by Subject */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📚 Estudar por Matéria
                </h3>
                <button className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} hover:underline`}>
                  Ver todas →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {subjects.map(subject => {
                  const colors = getSubjectColor(subject)
                  const subjectStats = statsBySubject.find(s => s.subject === subject)
                  const count = questions.filter(q => q.subject === subject).length
                  return (
                    <button
                      key={subject}
                      onClick={() => startStudy(subject)}
                      className={`group relative p-4 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'} shadow-lg transition-all hover:scale-105`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                        {subjectIcons[subject] || '📖'}
                      </div>
                      <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {subject}
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {count} questões
                      </p>
                      {subjectStats && subjectStats.answered > 0 && (
                        <div className="mt-2">
                          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-full bg-gradient-to-r ${colors.gradient}`}
                              style={{ width: `${(subjectStats.answered / subjectStats.total) * 100}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {subjectStats.percentage}% acertos
                          </p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Study by Year */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📅 Provas Anteriores
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {years.map(year => {
                  const yearQuestions = questions.filter(q => q.year === year)
                  const yearAnswered = stats.answered.filter(a => yearQuestions.some(q => q.id === a.id))
                  const progress = yearQuestions.length > 0 ? Math.round((yearAnswered.length / yearQuestions.length) * 100) : 0
                  return (
                    <button
                      key={year}
                      onClick={() => startStudy('all', year)}
                      className={`group p-4 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'} shadow-lg transition-all hover:scale-105`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mb-3 group-hover:scale-110 transition-transform">
                        {year.toString().slice(2)}
                      </div>
                      <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        PAS {year}
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {yearQuestions.length} questões
                      </p>
                      {progress > 0 && (
                        <div className="mt-2">
                          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {progress}% concluído
                          </p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Recent Activity / Continue Studying */}
            {stats.answered.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    🔥 Continue Estudando
                  </h3>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Você já respondeu {stats.answered.length} questões!
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Continue praticando para melhorar seu desempenho.
                      </p>
                    </div>
                    <button 
                      onClick={() => startStudy()}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {currentView === 'questions' && question && (
          <div className="max-w-3xl mx-auto">
            {/* Question Navigation */}
            <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <button 
                  onClick={() => setCurrentView('home')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                >
                  ← Voltar
                </button>
                <select
                  value={filters.subject}
                  onChange={(e) => { setFilters(f => ({ ...f, subject: e.target.value })); setCurrentIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                >
                  <option value="all">Todas as matérias</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={filters.year}
                  onChange={(e) => { setFilters(f => ({ ...f, year: e.target.value })); setCurrentIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                >
                  <option value="all">Todos os anos</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentIndex + 1} de {filteredQuestions.length}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className={`rounded-2xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSubjectColor(question.subject).gradient} text-white`}>
                    {subjectIcons[question.subject]} {question.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {question.year}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    Q{question.questionNumber}
                  </span>
                  <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                    question.type === 'C' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {question.type === 'C' ? 'Certo/Errado' : 'Múltipla Escolha'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className={`text-lg leading-relaxed mb-8 whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {question.statement}
                </div>

                {/* Answers */}
                {question.type === 'C' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[{ value: 'C', label: 'CERTO', icon: '✓' }, { value: 'E', label: 'ERRADO', icon: '✗' }].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        disabled={showResult}
                        className={`py-5 text-xl font-bold rounded-xl transition-all duration-300 ${
                          showResult
                            ? opt.value === question.correctAnswer
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-[1.02]'
                              : selectedAnswer === opt.value
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                            : darkMode 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                ) : question.alternatives ? (
                  <div className="space-y-3">
                    {question.alternatives.map(alt => (
                      <button
                        key={alt.letter}
                        onClick={() => handleAnswer(alt.letter)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                          showResult
                            ? alt.letter === question.correctAnswer
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                              : selectedAnswer === alt.letter
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                : darkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-50 text-gray-400'
                            : darkMode 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                            showResult && (alt.letter === question.correctAnswer || selectedAnswer === alt.letter)
                              ? 'bg-white/20 text-white'
                              : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {alt.letter}
                          </span>
                          <span className="pt-1">{alt.text}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Result */}
                {showResult && (
                  <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                    selectedAnswer === question.correctAnswer 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedAnswer === question.correctAnswer ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {selectedAnswer === question.correctAnswer ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        selectedAnswer === question.correctAnswer ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedAnswer === question.correctAnswer ? 'Correto!' : 'Incorreto'}
                      </p>
                      {selectedAnswer !== question.correctAnswer && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Resposta: <strong>{question.type === 'C' ? (question.correctAnswer === 'C' ? 'CERTO' : 'ERRADO') : question.correctAnswer}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between`}>
                <button
                  onClick={prevQuestion}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ← Anterior
                </button>
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-600 shadow-lg"
                >
                  Próxima →
                </button>
              </div>
            </div>

            {/* Shortcuts */}
            <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Atalhos: <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>←</kbd> <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>→</kbd> navegar • 
                <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>C</kbd> <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>E</kbd> responder • 
                <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>ESC</kbd> voltar
              </p>
            </div>
          </div>
        )}

        {currentView === 'stats' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📊 Suas Estatísticas
              </h2>
              <button 
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
              >
                ← Voltar
              </button>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total', value: total, icon: '📝', gradient: 'from-blue-500 to-indigo-500' },
                { label: 'Acertos', value: stats.correct, icon: '✅', gradient: 'from-green-500 to-emerald-500' },
                { label: 'Erros', value: stats.wrong, icon: '❌', gradient: 'from-red-500 to-rose-500' },
                { label: 'Taxa', value: `${percentage}%`, icon: '🎯', gradient: 'from-purple-500 to-pink-500' },
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-3`}>
                    {stat.icon}
                  </div>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* By Subject */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Desempenho por Matéria
              </h3>
              <div className="space-y-4">
                {statsBySubject.map(stat => {
                  const colors = getSubjectColor(stat.subject)
                  return (
                    <div key={stat.subject} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{subjectIcons[stat.subject]}</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.subject}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          stat.answered === 0 ? (darkMode ? 'text-gray-500' : 'text-gray-400') :
                          stat.percentage >= 70 ? 'text-green-500' : 
                          stat.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {stat.answered > 0 ? `${stat.correct}/${stat.answered} (${stat.percentage}%)` : 'Não iniciado'}
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full bg-gradient-to-r ${colors.gradient} transition-all`}
                          style={{ width: `${stat.answered > 0 ? (stat.answered / stat.total) * 100 : 0}%` }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {stat.answered} de {stat.total} questões respondidas
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { 
                setStats({ correct: 0, wrong: 0, answered: [] })
                setCurrentView('home')
              }}
              className={`w-full py-4 rounded-xl font-medium ${
                darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              🗑️ Zerar Estatísticas
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Estude PAS - Questões do PAS UnB 1ª Etapa • Fonte: CEBRASPE
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
