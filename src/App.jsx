import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
import About from './pages/About'

function StoryRouteWrapper() {
  const location = useLocation();
  return <Story key={location.pathname} />;
}
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:slug" element={<StoryRouteWrapper />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App;