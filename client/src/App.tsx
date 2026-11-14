import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './Layout.tsx'
import Home from './pages/Home.tsx'
import Calendar from './pages/Calendar.tsx'
import Join from './pages/Join.tsx'
import NotFound from './pages/NotFound.tsx'

function HashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(hash.slice(1))
    if (el) {
      el.scrollIntoView()
      el.focus({ preventScroll: true })
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <HashScroll />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
