import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function PaginaExibicao() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); // Para ler o estado (de onde viemos)
    
    const [ingrediente, setIngrediente] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Verifica se estamos no modo 'edicao' (vinda do editar) ou 'cadastro' (padrão)
    const modoEdicao = location.state?.modo === 'edicao';

    useEffect(() => {
        const fetchIngrediente = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                    signal: controller.signal
                });
                
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setIngrediente(dados);
                } else {
                    alert("Ingrediente não encontrado.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Erro ao buscar:", error);
                // Se der erro, volta para o início
                navigate('/');
            } finally {
                setCarregando(false);
                clearTimeout(timeoutId);
            }
        };
        fetchIngrediente();
    }, [id, navigate]);

    if (carregando) return <p style={{textAlign:'center', marginTop:'20px'}}>Carregando detalhes...</p>;
    if (!ingrediente) return null;

    return (
        <div>
            <nav className="nav-superior">
                <button onClick={() => navigate('/buscar')} className="btn-acao btn-cinza">
                    Voltar para a busca
                </button>
            </nav>

            <div className="app-card">
                {/* TÍTULO DINÂMICO */}
                {modoEdicao ? (
                    <h2 className="app-titulo" style={{ color: '#007bff' }}>
                        ✏️ Item Atualizado
                    </h2>
                ) : (
                    <h2 className="app-titulo">
                        ✅ Cadastro Realizado!
                    </h2>
                )}

                <div className="detalhes-box">
                    <p><strong>Nome:</strong> {ingrediente.nome}</p>
                    <p><strong>Descrição:</strong> {ingrediente.descricao || 'Sem descrição'}</p>
                    <p><strong>Medida:</strong> {ingrediente.medida}</p>
                    <p><strong>Quantidade:</strong> {ingrediente.quantidade}</p>
                </div>

                <div className="exibicao-botoes">
                    
                    {/* LÓGICA DO BOTÃO: Só mostra "Cadastrar Novo" se NÃO for edição */}
                    {!modoEdicao && (
                        <button 
                            onClick={() => navigate('/cadastrar')} 
                            className="btn-acao btn-verde"
                        >
                            ➕ Cadastrar Novo
                        </button>
                    )}

                    <button onClick={() => navigate('/buscar')} className="btn-acao btn-cinza">
                        Voltar para a busca
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaginaExibicao;