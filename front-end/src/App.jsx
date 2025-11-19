import { Outlet, Link } from 'react-router-dom';

function App() {

  // O <Outlet /> é o "portal" onde o React
  // vai renderizar a página correta (Listagem ou Cadastro)
  return (
    <div>
      <nav>
        <h1>Gerenciamento de Ingredientes</h1>
        {/* Isto cria os links de navegação */}
        <Link to="/">[Buscar ingrediente]</Link>
        <Link to="/cadastrar">[Cadastrar Novo]</Link>
      </nav>
      <hr />
      
      {/* O "Portal" das páginas */}
      <Outlet /> 
    </div>
  )
}

export default App