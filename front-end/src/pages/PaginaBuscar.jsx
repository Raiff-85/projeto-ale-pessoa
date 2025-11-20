import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PaginaBuscar() {
    const navigate = useNavigate();
    const [termoBusca, setTermoBusca] = useState('');

    // Estados de verificação de conexão
    const [verificandoConexao, setVerificandoConexao] = useState(true);
    const [erroConexaoInicial, setErroConexaoInicial] = useState(null);

    // 1. Teste de conexão ao abrir a página
    useEffect(() => {
        const testarConexao = async () => {
            // Configura timeout rápido de 200ms
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                // Tenta pingar a API
                await fetch('http://localhost:8080/api/ingredientes', { 
                    signal: controller.signal 
                });
                // Se der certo, libera o formulário
                setVerificandoConexao(false);
            } catch (e) {
                console.error("Servidor offline:", e);
                setErroConexaoInicial("Não foi possível conectar ao servidor. O Back-end parece estar desligado.");
                setVerificandoConexao(false);
            } finally {
                clearTimeout(timeoutId);
            }
        };
        testarConexao();
    }, []);

    const handleBuscar = (e) => {
        e.preventDefault();
        navigate(`/resultados?nome=${termoBusca}`);
    };

    const handleListarTodos = () => {
        navigate(`/resultados?todos=true`);
    };

    return (
        <div>
            <div className="app-card">
                <Link to="/">
                    <img 
                        src="/assets/ale-pessoa.png" 
                        alt="Confeitaria Alê Pessoa" 
                        className="logo-interno" 
                    />
                </Link>
                <nav className="nav-superior">
                    <button onClick={() => navigate('/')} className="btn-acao btn-cinza">
                        Voltar para o Início
                    </button>
                </nav>
                <h1 className="app-titulo">Buscar Ingrediente</h1>
                
                {verificandoConexao ? (
                    null 
                ) : erroConexaoInicial ? (
                    <div className="mensagem-erro-conexao">
                        <strong>Erro Crítico:</strong> <br/>
                        {erroConexaoInicial}
                        <br/><br/>
                        <small>Verifique se o Java (Spring Boot) está rodando.</small>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleBuscar}>
                            <div className="form-grupo">
                                <input 
                                    type="text" 
                                    id="busca"
                                    className="form-input"
                                    placeholder="Digite aqui"
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn-acao btn-azul btn-full">
                                Buscar por Nome
                            </button>
                        </form>

                        {/* AQUI ESTÃO OS DOIS BOTÕES EXTRAS */}
                        <div className="separador-lista">
                            <p className="texto-secundario">
                                Ou visualize o estoque completo:
                            </p>
                            
                            {/* Botão 1: Listar Todos (Verde) */}
                            <button 
                                onClick={handleListarTodos} 
                                className="btn-acao btn-verde btn-full"
                            >
                                Listar Todos os Ingredientes
                            </button>

                            {/* Botão 2: Ver Estoque Baixo (Laranja) */}
                            <button 
                                onClick={() => navigate('/resultados?quantidade=5')} 
                                className="btn-acao btn-laranja btn-full" 
                            >
                                Ver Estoque Baixo (Repor)
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PaginaBuscar;