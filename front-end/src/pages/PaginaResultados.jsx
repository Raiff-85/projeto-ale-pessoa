import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

function PaginaResultados() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [listaIngredientes, setListaIngredientes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchResultados = async () => {
            setCarregando(true);
            let url = '';

            const id = searchParams.get('id');
            const nome = searchParams.get('nome');
            // Captura o parâmetro 'todos'
            const todos = searchParams.get('todos'); 

            if (id) {
                // Busca por ID
                url = `http://localhost:8080/api/ingredientes/${id}`;
            } else if (nome) {
                // Busca por Nome
                url = `http://localhost:8080/api/ingredientes?nome=${nome}`;
            } else if (todos) {
                // 🚨 NOVO: Se for 'todos', chama a API sem parâmetros para vir o findAll()
                url = `http://localhost:8080/api/ingredientes`;
            } else {
                setCarregando(false);
                return;
            }

            try {
                const resposta = await fetch(url);
                if (!resposta.ok) throw new Error("Falha na busca");
                const dados = await resposta.json();
                setListaIngredientes(Array.isArray(dados) ? dados : [dados]);
            } catch (e) {
                console.error("Erro:", e);
                setListaIngredientes([]);
            } finally {
                setCarregando(false);
            }
        };
        
        fetchResultados();
    }, [searchParams]); // O useEffect roda sempre que os parâmetros mudam

    if (carregando) return <p>Carregando resultados...</p>;

    return (
        <div>
            <nav>
                <button onClick={() => navigate('/')} className="link-btn-navegacao">
                    [Voltar para o Início]
                </button>
                {/* Botão extra para voltar para a Busca, caso queira pesquisar de novo */}
                {' '}
                <button onClick={() => navigate('/buscar')} className="link-btn-navegacao">
                    [Voltar para Busca]
                </button>
            </nav>
            <hr />
            
            {/* Título dinâmico */}
            <h2>{searchParams.get('todos') ? 'Todos os Ingredientes' : 'Resultados da Busca'}</h2>

            {listaIngredientes.length === 0 && <p>Nenhum ingrediente encontrado.</p>}

            <ul>
                {listaIngredientes.map(ingrediente => (
                    <li key={ingrediente.id} className="ingrediente-item">
                        <p>
                            <strong>Nome:</strong> {ingrediente.nome} 
                            {' | '}
                            <strong>Descrição:</strong> {ingrediente.descricao || 'Sem descrição'} 
                            {' | '}
                            <strong>Quantidade/Medida:</strong> {ingrediente.quantidade} {ingrediente.medida}
                        </p>
                        <Link to={`/editar/${ingrediente.id}`}>[Editar]</Link>
                        {' '}
                        <Link to={`/excluir/${ingrediente.id}`}>[Excluir]</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PaginaResultados;