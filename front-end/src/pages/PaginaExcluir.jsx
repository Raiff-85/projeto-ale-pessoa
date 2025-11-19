import { useState, useEffect } from 'react'; // NOVO: Importamos useState
import { useParams, useNavigate } from 'react-router-dom';

function PaginaExcluir() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado para mensagens (sucesso, erro ou confirmação)
    const [mensagem, setMensagem] = useState({ 
        texto: `Tem certeza que deseja excluir o ingrediente ID ${id}?`, 
        tipo: 'confirmacao' // Novo tipo para indicar que precisa de confirmação
    });

    const [processando, setProcessando] = useState(false); // Estado para controlar o loading/exclusão

    // Função que executa a exclusão na API
    const executarExclusao = async () => {
        setProcessando(true);
        setMensagem({ texto: `Excluindo ingrediente ID ${id}...`, tipo: 'info' });

        try {
            const url = `http://localhost:8080/api/ingredientes/${id}`;
            const resposta = await fetch(url, {
                method: 'DELETE', 
            });

            if (resposta.status === 204) {
                // Sucesso: Redireciona para o início após 2 segundos
                setMensagem({ texto: `Ingrediente ID ${id} excluído com sucesso! Redirecionando...`, tipo: 'sucesso' });
                setTimeout(() => {
                    navigate('/'); 
                }, 2000);
            } else if (resposta.status === 404) {
                setMensagem({ texto: "Erro: Ingrediente não encontrado ou já excluído.", tipo: 'erro' });
                // Volta para a página anterior após erro
                setTimeout(() => navigate(-1), 3000);
            } else {
                setMensagem({ texto: `Erro na exclusão. Código: ${resposta.status}`, tipo: 'erro' });
                // Volta para a página anterior após erro
                setTimeout(() => navigate(-1), 3000);
            }
        } catch (e) {
            setMensagem({ texto: `Erro ao conectar com a API: ${e.message}`, tipo: 'erro' });
            // Volta para a página anterior após erro
            setTimeout(() => navigate(-1), 3000);
        } finally {
            setProcessando(false);
        }
    };

    // Função para tratar o cancelamento
    const cancelarExclusao = () => {
        setMensagem({ texto: "Exclusão cancelada. Voltando...", tipo: 'aviso' });
        setTimeout(() => {
            navigate(-1); // Volta para a página anterior
        }, 1500);
    };

    // Redireciona se não tiver ID
    useEffect(() => {
        if (!id) {
            navigate('/');
        }
    }, [id, navigate]);
    
    // Conteúdo da Página
    return (
        <div>
            <h2>Confirmar Exclusão</h2>
            <hr />

            {/* Exibição da Mensagem (usando classes para estilo limpo) */}
            <div className={`mensagem-${mensagem.tipo}`}>
                <p><strong>{mensagem.texto}</strong></p>
            </div>
            
            {/* Botões de Ação, visíveis apenas em 'confirmacao' */}
            {mensagem.tipo === 'confirmacao' && !processando && (
                <div style={{ marginTop: '20px' }}>
                    <button 
                        onClick={executarExclusao} 
                        className="btn-perigo" 
                        style={{ marginRight: '10px' }} // CSS inline temporário, mas o ideal é usar classes
                    >
                        Sim, Excluir Definitivamente
                    </button>
                    <button 
                        onClick={cancelarExclusao} 
                        className="btn-cancelar"
                    >
                        Não, Cancelar
                    </button>
                </div>
            )}
            
            {/* Mensagem de processamento caso os botões tenham sumido */}
            {(processando || mensagem.tipo === 'info') && (
                <p>Processando, aguarde...</p>
            )}
        </div>
    );
}

export default PaginaExcluir;