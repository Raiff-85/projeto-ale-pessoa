import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaginaInicial() {
    const navigate = useNavigate();

    // 1. Estados de Conexão (Fail Fast)
    const [verificandoConexao, setVerificandoConexao] = useState(true);
    const [erroConexaoInicial, setErroConexaoInicial] = useState(null);

    useEffect(() => {
        const testarConexao = async () => {
            // Configura timeout de 200ms
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                // Ping rápido (HEAD)
                await fetch('http://localhost:8080/api/ingredientes', { 
                    method: 'HEAD', 
                    signal: controller.signal 
                });
                setVerificandoConexao(false);
            } catch (e) {
                console.error("Servidor offline:", e);
                setErroConexaoInicial("O Sistema está indisponível no momento (Back-end Offline).");
                setVerificandoConexao(false);
            } finally {
                clearTimeout(timeoutId);
            }
        };
        testarConexao();
    }, []);

    return (
        <div className="app-card">
            <h1 className="app-titulo">Ale Pessoa</h1>
            <h2 className="home-subtitulo">
                Sistema de Gerenciamento de Ingredientes
            </h2>

            {/* LÓGICA VISUAL */}
            {verificandoConexao ? (
                null
            ) : erroConexaoInicial ? (
                <div className="mensagem-erro-conexao">
                    <strong>Sistema Fora do Ar:</strong> <br/>
                    {erroConexaoInicial}
                    <br/><br/>
                    <small>Verifique o Docker / Servidor Java.</small>
                </div>
            ) : (
                <>
                    <p className="texto-instrucao">
                        Selecione uma opção para começar:
                    </p>

                    <div className="home-menu-botoes">
                        <button 
                            onClick={() => navigate('/cadastrar')} 
                            className="btn-acao btn-verde btn-home"
                        >
                            Cadastrar Novo Item
                        </button>

                        <button 
                            onClick={() => navigate('/buscar')} 
                            className="btn-acao btn-azul btn-home"
                        >
                            Buscar no Estoque
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PaginaInicial;