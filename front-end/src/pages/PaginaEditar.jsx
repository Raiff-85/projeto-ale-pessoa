import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PaginaEditar() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estados do Formulário e do Carregamento
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [medida, setMedida] = useState('');
    const [quantidade, setQuantidade] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // 1. Busca os dados do ingrediente para preencher o formulário
    useEffect(() => {
        if (!id || isNaN(Number(id))) {
             setIsLoading(false);
             setMensagem({ texto: 'ID de ingrediente inválido.', tipo: 'erro' });
             setTimeout(() => navigate('/'), 2000);
             return;
        }

        const buscarIngrediente = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                    signal: controller.signal
                });
                
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setNome(dados.nome);
                    setDescricao(dados.descricao);
                    setMedida(dados.medida);
                    setQuantidade(dados.quantidade);
                } else if (resposta.status === 404) {
                    setMensagem({ texto: 'Ingrediente não encontrado.', tipo: 'erro' });
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setMensagem({ texto: `Erro ao buscar: ${resposta.status}`, tipo: 'erro' });
                }
            } catch (erro) {
                setMensagem({ texto: 'Erro ao conectar com a API para carregar dados.', tipo: 'erro' });
            } finally {
                setIsLoading(false);
                clearTimeout(timeoutId);
            }
        };

        buscarIngrediente();
    }, [id, navigate]);

    const handleQuantidadeChange = (e) => {
        let valor = e.target.value;
        if (valor === '') setQuantidade('');
        else if (Number(valor) < 0) setQuantidade(0);
        else setQuantidade(valor);
    };

    // 2. Lógica de Submissão do Formulário (PUT)
    const handleSubmit = async (evento) => {
        evento.preventDefault(); 
        setMensagem({ texto: '', tipo: '' }); 

        const ingredienteAtualizado = { nome, descricao, medida, quantidade: Number(quantidade) };
        
        try {
            const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredienteAtualizado),
            });

            if (resposta.ok) {
                setMensagem({ texto: 'Ingrediente editado com sucesso! Redirecionando...', tipo: 'sucesso' });
                
                // REDIRECIONAMENTO PARA A PÁGINA DE RESULTADOS
                setTimeout(() => {
                  // MUDANÇA: Passamos o estado 'modo: edicao' para a página de exibição saber o que mostrar
                  navigate(`/exibicao/${id}`, { state: { modo: 'edicao' } });
              }, 1500); 
            } else {
                setMensagem({ texto: 'Falha ao editar o ingrediente.', tipo: 'erro' });
            }
        } catch (erro) {
            setMensagem({ texto: 'Não foi possível conectar à API.', tipo: 'erro' });
        }
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <nav>
                <button 
                    onClick={() => navigate('/buscar')} 
                    className="link-btn-navegacao"
                >
                    [Voltar para a Busca]
                </button>
            </nav>
            
            <div className="app-card">
                <h2 className="app-titulo">Editar Ingrediente (ID: {id})</h2>
                
                {mensagem.texto && (
                    <div 
                        className={mensagem.tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso'}
                    >
                        {mensagem.texto}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grupo">
                        <label htmlFor="nome" className="form-label">Nome:</label>
                        <input type="text" id="nome" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} maxLength="50" />
                    </div>
                    
                    <div className="form-grupo">
                        <label htmlFor="descricao" className="form-label">Descrição:</label>
                        <input type="text" id="descricao" className="form-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength="50" />
                    </div>
                    
                    <div className="form-grupo">
                        <label htmlFor="medida" className="form-label">Medida (Kg ou L):</label>
                        <input type="text" id="medida" className="form-input" value={medida} onChange={(e) => setMedida(e.target.value)} maxLength="50" />
                    </div>
                    
                    <div className="form-grupo">
                        <label htmlFor="quantidade" className="form-label">Quantidade:</label>
                        <input type="number" id="quantidade" className="form-input" value={quantidade} onChange={handleQuantidadeChange} step="1" />
                    </div>
                    
                    <button type="submit" className="btn-acao btn-verde btn-full">Salvar Alterações</button>
                </form>
            </div>
        </div>
    );
}

export default PaginaEditar;