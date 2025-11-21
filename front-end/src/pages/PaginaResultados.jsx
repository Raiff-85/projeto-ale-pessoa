import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

function PaginaResultados() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Estados
    const [listaIngredientes, setListaIngredientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroConexao, setErroConexao] = useState(null);

    // Parâmetros da URL
    const termoBusca = searchParams.get('nome');
    const listarTodos = searchParams.get('todos');
    const quantidade = searchParams.get('quantidade');

    useEffect(() => {
        const fetchResultados = async () => {
            setCarregando(true);
            setErroConexao(null);
            setListaIngredientes([]); 
            
            let url = '';
            
            // Define qual URL chamar na API
            if (searchParams.get('id')) {
                url = `http://localhost:8080/api/ingredientes/${searchParams.get('id')}`;
            } else if (quantidade) {
                url = `http://localhost:8080/api/ingredientes?quantidade=${quantidade}`;
            } else if (termoBusca) {
                url = `http://localhost:8080/api/ingredientes?nome=${termoBusca}`;
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
                
                // Garante que sempre trabalhamos com uma lista (array)
                const lista = Array.isArray(dados) ? dados : [dados];

                // --- LÓGICA DE ORDENAÇÃO INTELIGENTE ---
                
                if (quantidade) {
                    // CASO 1: Se o usuário clicou em "Ver Estoque Baixo"
                    // Ordena por número (crescente): 0, 1, 2...
                    lista.sort((a, b) => a.quantidade - b.quantidade);
                } else {
                    // CASO 2: "Listar Todos" ou "Busca por Nome"
                    // Ordena por ordem alfabética (A -> Z)
                    // localeCompare garante que acentos sejam respeitados (ex: Açúcar vem perto de Abacaxi)
                    lista.sort((a, b) => a.nome.localeCompare(b.nome));
                }

                setListaIngredientes(lista);
                
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
            <div className="app-card">
                
                {/* Logo no Topo */}
                <Link to="/">
                    <img 
                        src="/assets/ale-pessoa.png" 
                        alt="Confeitaria Alê Pessoa" 
                        className="logo-interno" 
                    />
                </Link>

                {/* Botão Voltar */}
                <nav className="nav-superior">
                    <button onClick={() => navigate('/buscar')} className="btn-acao btn-cinza">
                        Voltar para a busca
                    </button>
                </nav>

                {/* Título Dinâmico */}
                <h1 className="app-titulo">
                    {listarTodos ? 'Estoque Completo' : 
                     quantidade ? 'Itens com Estoque Baixo' : 
                     'Resultados da Busca'}
                </h1>

                {/* Mensagem de Erro de Conexão */}
                {erroConexao && (
                    <div className="mensagem-erro-conexao">
                        <strong>Erro:</strong> <br/>
                        {erroConexao}
                    </div>
                )}

                {/* Mensagem de Nenhum Item Encontrado */}
                {!erroConexao && listaIngredientes.length === 0 && (
                    <p className="mensagem-alerta-amarelo">
                        Nenhum ingrediente encontrado.
                    </p>
                )}

                {/* Lista de Resultados */}
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
                                                ESGOTADO
                                            </span>
                                        ) : (
                                            <span className="quantidade-ok">{ingrediente.quantidade}</span>
                                        )}

                                        {' | '}
                                        <strong>Medida:</strong> {ingrediente.medida}
                                    </p>
                                    
                                    <div className="acoes-container">
                                        <Link to={`/editar/${ingrediente.id}`} className="link-editar">
                                            Editar
                                        </Link>
                                        
                                        <Link to={`/excluir/${ingrediente.id}`} className="link-excluir">
                                            Excluir
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