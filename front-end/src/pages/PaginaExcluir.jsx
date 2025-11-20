import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PaginaExcluir() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dados do ingrediente a ser excluído
    const [ingrediente, setIngrediente] = useState(null);

    // Estados de Conexão (Fail Fast)
    const [verificandoConexao, setVerificandoConexao] = useState(true);
    const [erroConexaoInicial, setErroConexaoInicial] = useState(null);

    // Ao abrir, tenta buscar o ingrediente para confirmar qual é
    useEffect(() => {
        const buscarIngrediente = async () => {
            const controller = new AbortController();
            // Timeout agressivo de 200ms
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                    signal: controller.signal
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    setIngrediente(dados);
                    setVerificandoConexao(false);
                } else {
                    alert("Ingrediente não encontrado ou já excluído.");
                    navigate('/');
                }
            } catch (e) {
                console.error("Erro ao buscar:", e);
                setErroConexaoInicial("Não foi possível carregar os dados para exclusão. Servidor Offline.");
                setVerificandoConexao(false);
            } finally {
                clearTimeout(timeoutId);
            }
        };
        buscarIngrediente();
    }, [id, navigate]);

    const handleConfirmarExclusao = async () => {
        try {
            const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Ingrediente excluído com sucesso!");
                navigate('/');
            } else {
                alert("Erro ao excluir. Tente novamente.");
            }
        } catch (error) {
            alert("Erro de conexão ao tentar excluir.");
        }
    };

    return (
        <div>
            <nav className="nav-superior">
                <button onClick={() => navigate('/')} className="btn-acao btn-cinza">
                    🏠 Voltar para o Início
                </button>
            </nav>

            <div className="app-card">
                <h2 className="app-titulo">Excluir Ingrediente</h2>

                {/* LÓGICA DE EXIBIÇÃO BLINDADA */}
                {verificandoConexao ? (
                    null
                ) : erroConexaoInicial ? (
                    <div className="mensagem-erro-conexao">
                        🚨 <strong>Erro Crítico:</strong> <br/>
                        {erroConexaoInicial}
                        <br/><br/>
                        <small>Verifique se o Back-end está rodando.</small>
                    </div>
                ) : (
                    /* Só mostra a confirmação se carregou o ingrediente com sucesso */
                    ingrediente && (
                        <div>
                            <div className="mensagem-confirmacao">
                                <p className="mensagem-aviso">
                                    ⚠️ Tem certeza que deseja excluir este item?
                                </p>
                                <p>Esta ação não poderá ser desfeita.</p>
                            </div>

                            <div className="exibicao-detalhes-box">
                                <p><strong>Nome:</strong> {ingrediente.nome}</p>
                                <p><strong>Descrição:</strong> {ingrediente.descricao}</p>
                                <p><strong>Quantidade:</strong> {ingrediente.quantidade} {ingrediente.medida}</p>
                            </div>

                            <div className="exibicao-botoes">
                                <button 
                                    onClick={handleConfirmarExclusao} 
                                    className="btn-perigo"
                                >
                                    🗑️ Sim, Excluir Definitivamente
                                </button>

                                <button 
                                    onClick={() => navigate('/buscar')} 
                                    className="btn-cancelar"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default PaginaExcluir;