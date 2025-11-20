import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">  
      <main className="conteudo-pagina">
        <Outlet /> 
      </main>

    </div>
  )
}

export default App