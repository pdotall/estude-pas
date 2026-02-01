import { useState, useEffect } from 'react'
import questions from './data/questions.json'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pas-dark-mode')
    return saved ? JSON.parse(saved) : false
  })
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pas-stats')
    return saved ? JSON.parse(saved) : { correct: 0, wrong: 0, answered: [] }
  })
  const [filters, setFilters] = useState({ year: 'all', subject: 'all' })
  const [showStats, setShowStats] = useState(false)
  const [studyMode, setStudyMode] = useState('practice') // practice, exam

  const filteredQuestions = questions.filter(q => {
    if (filters.year !== 'all' && q.year !== parseInt(filters.year)) return false
    if (filters.subject !== 'all' && q.subject !== filters.subject) return false
    return true
  })

  const question = filteredQuestions[currentIndex]
  const years = [...new Set(questions.map(q => q.year))].sort((a, b) => b - a)
  const subjects = [...new Set(questions.map(q => q.subject))].sort()

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
      
      switch(e.key) {
        case 'ArrowRight':
          nextQuestion()
          break
        case 'ArrowLeft':
          prevQuestion()
          break
        case 'c':
        case 'C':
          if (question?.type === 'C' && !showResult) handleAnswer('C')
          break
        case 'e':
        case 'E':
          if (question?.type === 'C' && !showResult) handleAnswer('E')
          break
        case 'a':
        case 'A':
          if (question?.type === 'A' && !showResult) handleAnswer('A')
          break
        case 'b':
        case 'B':
          if (question?.type === 'A' && !showResult) handleAnswer('B')
          break
        case 'd':
        case 'D':
          if (question?.type === 'A' && !showResult) handleAnswer('D')
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, showResult])

  const handleAnswer = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === question.correctAnswer

    if (isCorrect) {
      setStats(s => ({ 
        ...s, 
        correct: s.correct + 1,
        answered: [...s.answered, { id: question.id, correct: true }]
      }))
    } else {
      setStats(s => ({ 
        ...s, 
        wrong: s.wrong + 1,
        answered: [...s.answered, { id: question.id, correct: false }]
      }))
    }
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

  const resetStats = () => {
    setStats({ correct: 0, wrong: 0, answered: [] })
  }

  const goToQuestion = (index) => {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentIndex(index)
  }

  const total = stats.correct + stats.wrong
  const percentage = total > 0 ? Math.round((stats.correct / total) * 100) : 0

  // Stats by subject
  const statsBySubject = subjects.map(subject => {
    const subjectQuestions = questions.filter(q => q.subject === subject)
    const answered = stats.answered.filter(a => 
      subjectQuestions.some(q => q.id === a.id)
    )
    const correct = answered.filter(a => a.correct).length
    return {
      subject,
      total: subjectQuestions.length,
      answered: answered.length,
      correct,
      percentage: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0
    }
  })

  if (!question) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-500">Nenhuma questão encontrada com esses filtros.</p>
          <button 
            onClick={() => setFilters({ year: 'all', subject: 'all' })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">PAS</span>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Estude PAS</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>UnB - 1ª Etapa</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Stats Button */}
              <button 
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Estatísticas"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title={darkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-4 mt-3 pb-1">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {stats.correct}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {stats.wrong}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${(currentIndex + 1) / filteredQuestions.length * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentIndex + 1}/{filteredQuestions.length}
              </span>
            </div>

            {total > 0 && (
              <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                percentage >= 70 
                  ? darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                  : percentage >= 50 
                    ? darkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : darkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-700'
              }`}>
                {percentage}%
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowStats(false)}>
          <div 
            className={`w-full max-w-lg max-h-[80vh] overflow-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`sticky top-0 p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Suas Estatísticas</h2>
                <button 
                  onClick={() => setShowStats(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Overall Stats */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Desempenho Geral</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.correct}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acertos</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{stats.wrong}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Erros</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{percentage}%</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taxa</div>
                  </div>
                </div>
              </div>

              {/* Stats by Subject */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Por Matéria</h3>
                <div className="space-y-2">
                  {statsBySubject.filter(s => s.answered > 0).map(stat => (
                    <div key={stat.subject} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.subject}</span>
                        <span className={`text-sm ${
                          stat.percentage >= 70 
                            ? darkMode ? 'text-green-400' : 'text-green-600'
                            : stat.percentage >= 50 
                              ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                              : darkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {stat.correct}/{stat.answered} ({stat.percentage}%)
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full transition-all ${
                            stat.percentage >= 70 ? 'bg-green-500' : stat.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {statsBySubject.filter(s => s.answered > 0).length === 0 && (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Responda algumas questões para ver suas estatísticas
                    </p>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => { resetStats(); setShowStats(false); }}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  darkMode ? 'bg-red-900/50 text-red-400 hover:bg-red-900' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                Zerar Estatísticas
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className={`flex flex-wrap gap-3 mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
          <div className="flex-1 min-w-[140px]">
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ano</label>
            <select
              value={filters.year}
              onChange={(e) => { setFilters(f => ({ ...f, year: e.target.value })); setCurrentIndex(0); setSelectedAnswer(null); setShowResult(false); }}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="all">Todos os anos</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <div className="flex-1 min-w-[140px]">
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Matéria</label>
            <select
              value={filters.subject}
              onChange={(e) => { setFilters(f => ({ ...f, subject: e.target.value })); setCurrentIndex(0); setSelectedAnswer(null); setShowResult(false); }}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="all">Todas as matérias</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Question Navigator */}
          <div className="w-full pt-2">
            <div className="flex flex-wrap gap-1">
              {filteredQuestions.slice(0, 20).map((q, i) => {
                const wasAnswered = stats.answered.find(a => a.id === q.id)
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                      i === currentIndex
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : wasAnswered
                          ? wasAnswered.correct
                            ? darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                            : darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                          : darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
              {filteredQuestions.length > 20 && (
                <span className={`w-8 h-8 flex items-center justify-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  +{filteredQuestions.length - 20}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Card Header */}
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  {question.year}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  darkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'
                }`}>
                  {question.subject}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Questão {question.questionNumber}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                question.type === 'C' 
                  ? darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'
                  : darkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {question.type === 'C' ? 'Certo/Errado' : 'Múltipla Escolha'}
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            {question.imageUrl ? (
              <img 
                src={question.imageUrl} 
                alt={`Questão ${question.questionNumber}`}
                className="w-full rounded-xl mb-6 border border-gray-200"
              />
            ) : (
              <div className={`text-lg leading-relaxed mb-8 whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {question.statement}
              </div>
            )}

            {/* Answer Options */}
            {question.type === 'C' ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'C', label: 'CERTO', icon: '✓', color: 'green' },
                  { value: 'E', label: 'ERRADO', icon: '✗', color: 'red' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={showResult}
                    className={`relative py-6 text-xl font-bold rounded-xl transition-all duration-300 ${
                      showResult
                        ? opt.value === question.correctAnswer
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                          : selectedAnswer === opt.value
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                            : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                    } border-2 ${
                      showResult && opt.value === question.correctAnswer
                        ? 'border-green-400'
                        : showResult && selectedAnswer === opt.value && opt.value !== question.correctAnswer
                          ? 'border-red-400'
                          : darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className={`text-2xl ${opt.color === 'green' ? 'text-green-500' : 'text-red-500'}`}>{opt.icon}</span>
                      {opt.label}
                    </span>
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
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                          : selectedAnswer === alt.letter
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                            : darkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-50 text-gray-400'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.01]'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.01]'
                    } border-2 ${
                      showResult && alt.letter === question.correctAnswer
                        ? 'border-green-400'
                        : showResult && selectedAnswer === alt.letter && alt.letter !== question.correctAnswer
                          ? 'border-red-400'
                          : darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        showResult && alt.letter === question.correctAnswer
                          ? 'bg-white/20 text-white'
                          : showResult && selectedAnswer === alt.letter
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

            {/* Result Feedback */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                selectedAnswer === question.correctAnswer 
                  ? darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'
                  : darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedAnswer === question.correctAnswer 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}>
                  {selectedAnswer === question.correctAnswer ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${
                    selectedAnswer === question.correctAnswer 
                      ? darkMode ? 'text-green-400' : 'text-green-700'
                      : darkMode ? 'text-red-400' : 'text-red-700'
                  }`}>
                    {selectedAnswer === question.correctAnswer ? 'Resposta correta!' : 'Resposta incorreta'}
                  </p>
                  {selectedAnswer !== question.correctAnswer && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      A resposta certa é: <strong>{question.type === 'C' ? (question.correctAnswer === 'C' ? 'CERTO' : 'ERRADO') : question.correctAnswer}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer - Navigation */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex justify-between items-center">
              <button
                onClick={prevQuestion}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Próxima
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
          <p className={`text-xs text-center font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Atalhos de teclado</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>←</kbd>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>→</kbd>
              Navegar
            </span>
            <span className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>C</kbd>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>E</kbd>
              Certo/Errado
            </span>
            <span className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>A</kbd>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>B</kbd>
              <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>D</kbd>
              Alternativas
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-6 border-t ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Estude PAS - Questões do PAS UnB 1ª Etapa
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
            Fonte: CEBRASPE - Provas oficiais
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
