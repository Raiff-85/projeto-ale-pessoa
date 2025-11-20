import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

function PaginaExibicao() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const [ingrediente, setIngrediente] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const modoEdicao = location.state?.modo === 'edicao';
    const origem = location.state?.origem;

    const handleVoltar = () => {
        if (origem === 'cadastrar') {
            navigate('/cadastrar');
        } else {
            navigate('/buscar');
        }
    };

    const textoBotaoVoltar = origem === 'cadastrar' 
        ? 'Voltar para Cadastro' 
        : 'Voltar para a busca';

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
                navigate('/');
            } finally {
                setCarregando(false);
                clearTimeout(timeoutId);
            }
        };
        fetchIngrediente();
    }, [id, navigate]);

    if (carregando) return <p className="texto-carregando">Carregando detalhes...</p>;
    if (!ingrediente) return null;

    return (
        <div>
            <div className="app-card">
                
                {/* Logo Interna */}
                <Link to="/">
                    <img 
                        src="/assets/ale-pessoa.png" 
                        alt="Confeitaria Alê Pessoa" 
                        className="logo-interno" 
                    />
                </Link>

                {/* Botão Voltar */}
                <nav className="nav-superior">
                    <button onClick={handleVoltar} className="btn-acao btn-cinza">
                        {textoBotaoVoltar}
                    </button>
                </nav>

                {modoEdicao ? (
                    // AQUI: Usamos a nova classe 'titulo-destaque'
                    <h2 className="app-titulo titulo-destaque">
                        Item Atualizado
                    </h2>
                ) : (
                    <h2 className="app-titulo">
                        {origem === 'cadastrar' ? 'Cadastro Realizado com Sucesso!' : 'Detalhes do Ingrediente'}
                    </h2>
                )}

                <div className="detalhes-box">
                    <p><strong>Nome:</strong> {ingrediente.nome}</p>
                    <p><strong>Descrição:</strong> {ingrediente.descricao || 'Sem descrição'}</p>
                    <p><strong>Medida:</strong> {ingrediente.medida}</p>
                    <p><strong>Quantidade:</strong> {ingrediente.quantidade}</p>
                </div>

                {/* Botão Extra (SEM STYLE INLINE) */}
                {!modoEdicao && (
                    // AQUI: Usamos a nova classe 'area-botao-extra'
                    <div className="area-botao-extra">
                        <button 
                            onClick={() => navigate('/cadastrar')} 
                            className="btn-acao btn-verde"
                        >
                            Cadastrar Novo Item
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PaginaExibicao;