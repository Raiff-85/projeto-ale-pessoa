import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function PaginaExcluir() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ingrediente, setIngrediente] = useState(null);
    const [excluido, setExcluido] = useState(false); 

    useEffect(() => {
        const fetchIngrediente = async () => {
            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`);
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setIngrediente(dados);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Erro:", error);
                navigate('/');
            }
        };
        fetchIngrediente();
    }, [id, navigate]);

    const handleExcluir = async () => {
        try {
            const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                setExcluido(true);
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    };

    if (!ingrediente) return <p className="texto-carregando">Carregando...</p>;

    return (
        <div className="app-container">
            
            <div className="app-card">
                
                <Link to="/">
                    <img 
                        src="/assets/ale-pessoa.png" 
                        alt="Confeitaria Alê Pessoa" 
                        className="logo-interno" 
                    />
                </Link>
                
                {excluido ? (
                    // --- TELA DE SUCESSO (Limpa e Sem CSS Inline) ---
                    <div className="conteudo-sucesso">
                        {/* Classe 'titulo-perigo' substitui o style color */}
                        <h2 className="app-titulo titulo-perigo">
                            Item Excluído!
                        </h2>
                        
                        {/* Classe 'mensagem-feedback-exclusao' substitui o style background/color/border */}
                        <p className="mensagem-feedback-exclusao">
                            O ingrediente <strong>{ingrediente.nome}</strong> foi removido do sistema.
                        </p>
                        
                        <button onClick={() => navigate('/')} className="btn-acao btn-cinza">
                            Voltar para o Início
                        </button>
                    </div>

                ) : (
                    // --- TELA DE CONFIRMAÇÃO (Padrão) ---
                    <>
                        <nav className="nav-superior">
                            <button onClick={() => navigate(-1)} className="btn-acao btn-cinza">
                                Voltar
                            </button>
                        </nav>

                        {/* MUDANÇA AQUI: Adicionado o ID para ficar coerente */}
                        <h2 className="app-titulo">Excluir Ingrediente (ID: {id})</h2>

                        <div className="detalhes-box">
                            <p><strong>Nome:</strong> {ingrediente.nome}</p>
                            <p><strong>Descrição:</strong> {ingrediente.descricao}</p>
                            <p><strong>Quantidade:</strong> {ingrediente.quantidade} {ingrediente.medida}</p>
                        </div>

                        {/* Classe 'box-aviso-perigo' substitui o style inline */}
                        <div className="box-aviso-perigo">
                            <p>Tem certeza que deseja excluir este item?</p>
                            <p><strong>Esta ação não poderá ser desfeita.</strong></p>
                        </div>

                        {/* Classe 'acoes-centralizadas' substitui justifyContent */}
                        <div className="acoes-container acoes-centralizadas">
                            <button onClick={handleExcluir} className="btn-acao btn-perigo">
                                Sim, Excluir Definitivamente
                            </button>

                            <button onClick={() => navigate(-1)} className="btn-acao btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PaginaExcluir;