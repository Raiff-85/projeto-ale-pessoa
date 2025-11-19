import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaginaCadastrar() {
    const navigate = useNavigate();
    
    // Estados individuais para o formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [medida, setMedida] = useState('');
    const [quantidade, setQuantidade] = useState(0); 

    // Declaração dos estados de mensagem e erros
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [erros, setErros] = useState([]); // Array para armazenar múltiplos erros

    // Função para tratar valores negativos/nulos no campo Quantidade
    const handleQuantidadeChange = (e) => {
        let valor = e.target.value;
        
        // Permite que o campo fique vazio (melhor UX para limpar)
        if (valor === '') {
            setQuantidade('');
        } 
        // Se for um número, mas menor que zero, força para zero
        else if (Number(valor) < 0) {
            setQuantidade(0);
        }
        // Caso contrário, atualiza o valor normalmente
        else {
            setQuantidade(valor);
        }
    };


    const handleSubmit = async (evento) => {
        evento.preventDefault(); 
        
        // --- 1. VALIDAÇÃO DE FRONT-END (Múltiplos Erros) ---
        const novosErros = [];
        setMensagem({ texto: '', tipo: '' }); 
        setErros([]); 
        
        // Validação de campos vazios (Strings)
        if (!nome || !medida) {
            novosErros.push("O Nome e/ou Medida (Kg ou L) não podem estar vazios.");
        }
        
        // Validação numérica (Quantidade > 0)
        if (Number(quantidade) <= 0) {
            novosErros.push("A Quantidade deve ser um número maior que zero.");
        }
        
        if (novosErros.length > 0) {
            setErros(novosErros); 
            return; 
        }
        
        // --- 2. PREPARAÇÃO DO ENVIO ---
        const ingrediente = { nome, descricao, medida, quantidade: Number(quantidade) };
    
        // --- 3. TRATAMENTO DE API (try/catch) ---
        try {
            const resposta = await fetch('http://localhost:8080/api/ingredientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingrediente),
            });
    
            if (resposta.ok) {
                const novoIngrediente = await resposta.json();      
                navigate(`/exibicao/${novoIngrediente.id}`);
                
            } else if (resposta.status === 400) {
                const errosBackend = await resposta.json(); 
                const listaErros = Object.values(errosBackend); 
                setErros(listaErros); 
                
            } else {
                setMensagem({ texto: `Falha ao cadastrar. Código: ${resposta.status}.`, tipo: 'erro' });
            }
        } catch (erro) {
            console.error("Erro na conexão:", erro);
            setMensagem({ texto: 'Não foi possível conectar à API. Verifique se o servidor está rodando.', tipo: 'erro' });
        }
    };

    return (
        <div>
            <nav>
                <button onClick={() => navigate('/')} className="link-btn-navegacao">
                    [Voltar para o Início]
                </button>
            </nav>
            <hr />
            <h2>Cadastrar Novo Ingrediente</h2>

            {/* 1. EXIBIÇÃO DE MENSAGENS DE SUCESSO/FALHA DE CONEXÃO */}
            {mensagem.texto && (
                <div 
                    className={mensagem.tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso'}
                >
                    {mensagem.texto}
                </div>
            )}
            
            {/* 2. EXIBIÇÃO DO ARRAY DE ERROS (Front-end e Erros 400 do Back-end) */}
            {erros.length > 0 && (
                <div className="mensagem-erro-lista">
                    <p>**Não foi possível cadastrar! Verifique os campos:**</p>
                    <ul>
                        {erros.map((erro, index) => (
                            <li key={index}>{erro}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* noValidate para desativar o balão de erro nativo do navegador */}
            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input 
                        type="text" 
                        id="nome" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        maxLength="50" 
                    />
                </div>
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <input 
                        type="text" 
                        id="descricao" 
                        value={descricao} 
                        onChange={(e) => setDescricao(e.target.value)} 
                        maxLength="50" 
                    />
                </div>
                <div>
                    <label htmlFor="medida">Medida (Kg ou L):</label>
                    <input 
                        type="text" 
                        id="medida" 
                        value={medida} 
                        onChange={(e) => setMedida(e.target.value)} 
                        maxLength="50" 
                    />
                </div>
                <div>
                    <label htmlFor="quantidade">Quantidade:</label>
                    <input 
                        type="number" 
                        id="quantidade" 
                        value={quantidade} 
                        onChange={handleQuantidadeChange} 
                        // ADICIONADO: Bloqueia a digitação do sinal de menos
                        onKeyDown={(e) => {
                            if (e.key === '-') {
                                e.preventDefault(); 
                            }
                        }}
                        step="1"
                    />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default PaginaCadastrar;