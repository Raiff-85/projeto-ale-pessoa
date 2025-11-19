import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaginaBuscar() {
    const [termoBusca, setTermoBusca] = useState('');
    const navigate = useNavigate();

    const handleBuscar = (e) => {
        e.preventDefault();
        // Navega enviando o parâmetro 'nome'
        navigate(`/resultados?nome=${termoBusca}`);
    };

    // Nova função para listar tudo
    const handleListarTodos = () => {
        // Navega enviando um sinal 'todos=true'
        navigate(`/resultados?todos=true`);
    };

    return (
        <div>
            <nav>
                <button onClick={() => navigate('/')} className="link-btn-navegacao">
                    [Voltar para o Início]
                </button>
            </nav>
            <hr />
            <h2>Buscar Ingrediente</h2>
            
            <form onSubmit={handleBuscar}>
                <label htmlFor="busca">Nome do ingrediente:</label>
                <input 
                    type="text" 
                    id="busca"
                    placeholder="Ex: Café"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
                <button type="submit">Buscar por Nome</button>
            </form>

            {/* --- NOVO BOTÃO AQUI --- */}
            <div style={{ marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
                <p>Ou, se preferir, veja o estoque completo:</p>
                <button onClick={handleListarTodos} style={{ backgroundColor: '#28a745' }}>
                    📋 Listar Todos os Ingredientes
                </button>
            </div>
        </div>
    );
}

export default PaginaBuscar;