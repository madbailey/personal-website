import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
import About from './pages/About'


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:slug" element={<Story />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App;