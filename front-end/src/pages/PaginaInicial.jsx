import { Link } from 'react-router-dom';

function PaginaInicial() {
  return (
    <div>
      <h1>Alê Pessoa</h1>
      <h3>Sistema de Gerenciamento de Ingredientes</h3>
      <p>Selecione uma opção para começar:</p>
      
      <nav>
        <Link to="/cadastrar">
          <button type="button">Cadastrar Novo Item</button>
        </Link>
        
        <br />
        <br />

        <Link to="/buscar">
          <button type="button">Buscar</button>
        </Link>
      </nav>
    </div>
  );
}

export default PaginaInicial;