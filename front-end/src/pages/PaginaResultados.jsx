import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

function PaginaResultados() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [novoTermo, setNovoTermo] = useState('');
    const [listaIngredientes, setListaIngredientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroConexao, setErroConexao] = useState(null);

    const termoBusca = searchParams.get('nome');
    const listarTodos = searchParams.get('todos');
    const quantidade = searchParams.get('quantidade');

    const handleNovaBusca = (e) => {
        e.preventDefault();
        if (novoTermo.trim()) {
            navigate(`/resultados?nome=${novoTermo}`);
        }
    };

    // 🚨 NOVA FUNÇÃO: Rola a página para o topo suavemente
    const handleVoltarAoTopo = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Faz a rolagem ser animada (bonita)
        });
    };

    useEffect(() => {
        const fetchResultados = async () => {
            setCarregando(true);
            setErroConexao(null);
            setListaIngredientes([]); 
            
            let url = '';
            
            if (searchParams.get('id')) {
                url = `http://localhost:8080/api/ingredientes/${searchParams.get('id')}`;
            } else if (quantidade) {
                url = `http://localhost:8080/api/ingredientes?quantidade=${quantidade}`;
            } else if (termoBusca) {
                url = `http://localhost:8080/api/ingredientes?nome=${termoBusca}`;
                setNovoTermo(termoBusca);
            } else if (listarTodos) {
                url = `http://localhost:8080/api/ingredientes`;
            } else {
                setCarregando(false);
                return;
            }

            try {
                const resposta = await fetch(url);
                if (!resposta.ok) throw new Error("Erro na resposta da API");
                
                const dados = await resposta.json();
                setListaIngredientes(Array.isArray(dados) ? dados : [dados]);
                
            } catch (e) {
                console.error("Erro de conexão:", e);
                setErroConexao("Não foi possível conectar ao servidor.");
                setListaIngredientes([]); 
            } finally {
                setCarregando(false);
            }
        };
        
        fetchResultados();
        
    }, [searchParams, termoBusca, listarTodos, quantidade]); 

    if (carregando) return <p className="texto-carregando">Carregando resultados...</p>;

    return (
        <div>
            <nav className="nav-superior">
                <button onClick={() => navigate('/buscar')} className="btn-acao btn-cinza">
                    Voltar para a busca
                </button>
            </nav>
            
            <div className="app-card">
                
                <h2 className="app-titulo">
                    {listarTodos ? 'Estoque Completo' : 
                     quantidade ? '⚠️ Itens com Estoque Baixo' : 
                     'Resultados da Busca'}
                </h2>

                {erroConexao && (
                    <div className="mensagem-erro-conexao">
                        <strong>Erro:</strong> <br/>
                        {erroConexao}
                    </div>
                )}

                {!erroConexao && listaIngredientes.length === 0 && (
                    <p className="mensagem-alerta-amarelo">
                        Nenhum ingrediente encontrado.
                    </p>
                )}

                {!erroConexao && listaIngredientes.length > 0 && (
                    <div className="lista-container">
                        <ul>
                            {listaIngredientes.map(ingrediente => (
                                <li key={ingrediente.id} className="ingrediente-item">
                                    <p>
                                        <strong>Nome:</strong> {ingrediente.nome} 
                                        {' | '}
                                        <strong>Descrição:</strong> {ingrediente.descricao || 'Sem descrição'} 
                                        {' | '}
                                        
                                        <strong>Qtde:</strong>{' '}
                                        {ingrediente.quantidade === 0 ? (
                                            <span className="aviso-esgotado">
                                                🚨 ESGOTADO
                                            </span>
                                        ) : (
                                            <span className="quantidade-ok">{ingrediente.quantidade}</span>
                                        )}

                                        {' | '}
                                        <strong>Medida:</strong> {ingrediente.medida}
                                    </p>
                                    
                                    <div className="acoes-container">
                                        <Link to={`/editar/${ingrediente.id}`} className="link-editar">
                                            ✏️ [Editar]
                                        </Link>
                                        
                                        <Link to={`/excluir/${ingrediente.id}`} className="link-excluir">
                                            ❌ [Excluir]
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="rodape-lista">
                            <nav className="nav-superior">
                                <button onClick={() => navigate('/buscar')} className="btn-acao btn-cinza">
                                    Voltar para a busca
                                </button>
                            </nav>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default PaginaResultados;