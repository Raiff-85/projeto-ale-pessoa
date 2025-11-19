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
            try {
                const resposta = await fetch(`http://localhost:8080/api/ingredientes/${id}`);
                
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
            }
        };

        buscarIngrediente();
    }, [id, navigate]);

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
                  navigate(`/resultados?id=${id}`, { state: { from: '/editar' } });
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
                {/* BOTÃO LIMPO: Usa a classe link-btn-navegacao */}
                <button 
                    onClick={() => navigate('/buscar')} // Volta para a página de busca
                    className="link-btn-navegacao"
                >
                    [Voltar para a Busca]
                </button>
            </nav>
            <hr />
            <h2>Editar Ingrediente (ID: {id})</h2>
            
            {/* MENSAGEM LIMPA: Usa classes mensagem-erro/mensagem-sucesso */}
            {mensagem.texto && (
                <div 
                    className={mensagem.tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso'}
                >
                    {mensagem.texto}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                {/* ... (restante dos campos do formulário) ... */}
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <input type="text" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="medida">Medida (Kg ou L):</label>
                    <input type="text" id="medida" value={medida} onChange={(e) => setMedida(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                </div>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
}

export default PaginaEditar;