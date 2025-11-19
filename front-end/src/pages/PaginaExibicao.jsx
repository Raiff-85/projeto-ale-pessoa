import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PaginaExibicao() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [ingrediente, setIngrediente] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchIngrediente = async () => {
            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`);
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setIngrediente(dados);
                } else {
                    alert("Ingrediente não encontrado.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Erro ao buscar:", error);
            } finally {
                setCarregando(false);
            }
        };
        fetchIngrediente();
    }, [id, navigate]);

    if (carregando) return <p>Carregando detalhes...</p>;
    if (!ingrediente) return <p>Ingrediente não encontrado.</p>;

    return (
        <div>
            <div className="exibicao-container">
                <h2 className="exibicao-titulo">✅ Cadastro Realizado com Sucesso!</h2>
                <p>O ingrediente foi salvo no estoque.</p>
                
                <div className="exibicao-detalhes-box">
                    <h3>Detalhes do Item:</h3>
                    <p><strong>Nome:</strong> {ingrediente.nome}</p>
                    <p><strong>Descrição:</strong> {ingrediente.descricao || 'Sem descrição'}</p>
                    <p><strong>Medida:</strong> {ingrediente.medida}</p>
                    <p><strong>Quantidade:</strong> {ingrediente.quantidade}</p>
                </div>

                <div className="exibicao-botoes">
                    {/* Botão para Cadastrar Outro */}
                    <button 
                        onClick={() => navigate('/cadastrar')} 
                        className="btn-acao btn-azul"
                    >
                        ➕ Cadastrar Novo
                    </button>

                    {/* Botão para Voltar ao Início */}
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn-acao btn-cinza"
                    >
                        🏠 Voltar ao Início
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaginaExibicao;