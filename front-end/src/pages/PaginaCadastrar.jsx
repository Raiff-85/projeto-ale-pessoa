import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaginaCadastrar() {
    const navigate = useNavigate();
    
    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [medida, setMedida] = useState('');
    const [quantidade, setQuantidade] = useState(0); 

    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [erros, setErros] = useState([]); 

    // 1. Estados de Controle de Conexão (Inicia BLOQUEADO)
    const [verificandoConexao, setVerificandoConexao] = useState(true);
    const [erroConexaoInicial, setErroConexaoInicial] = useState(null);

    // 2. Teste de Conexão "Fail Fast" (200ms)
    useEffect(() => {
        const testarConexao = async () => {
            // Configura o cancelamento automático em 200ms
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200);

            try {
                // Tenta conectar (HEAD é mais leve)
                await fetch('http://localhost:8080/api/ingredientes', { 
                    method: 'HEAD', 
                    signal: controller.signal 
                });
                
                // Sucesso: Libera o formulário
                setVerificandoConexao(false);
                
            } catch (e) {
                console.error("Servidor offline ou timeout:", e);
                // Falha: Define erro e libera para mostrar a mensagem vermelha
                setErroConexaoInicial("Não foi possível conectar ao servidor.");
                setVerificandoConexao(false);
            } finally {
                clearTimeout(timeoutId);
            }
        };
        testarConexao();
    }, []);

    const handleQuantidadeChange = (e) => {
        let valor = e.target.value;
        if (valor === '') setQuantidade('');
        else if (Number(valor) < 0) setQuantidade(0);
        else setQuantidade(valor);
    };

    const handleSubmit = async (evento) => {
        evento.preventDefault(); 
        
        const novosErros = [];
        setMensagem({ texto: '', tipo: '' }); 
        setErros([]); 
        
        if (!nome || !medida) novosErros.push("O Nome e/ou Medida (Kg ou L) não podem estar vazios.");
        if (Number(quantidade) <= 0) novosErros.push("A Quantidade deve ser um número maior que zero.");
        
        if (novosErros.length > 0) {
            setErros(novosErros); 
            return; 
        }
        
        const ingrediente = { nome, descricao, medida, quantidade: Number(quantidade) };
    
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
                setErros(Object.values(errosBackend)); 
            } else {
                setMensagem({ texto: `Falha ao cadastrar. Código: ${resposta.status}.`, tipo: 'erro' });
            }
        } catch (erro) {
            setMensagem({ texto: 'A conexão caiu ao tentar salvar.', tipo: 'erro' });
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
                <h2 className="app-titulo">Cadastrar Novo Ingrediente</h2>

                {/* LÓGICA DE EXIBIÇÃO (Sem piscar) */}
                
                {verificandoConexao ? (
                    /* 1. Enquanto testa (max 200ms): VAZIO (Card em branco) */
                    null
                ) : erroConexaoInicial ? (
                    /* 2. Erro Confirmado: MENSAGEM VERMELHA */
                    <div className="mensagem-erro-conexao">
                        🚨 <strong>Erro Crítico:</strong> <br/>
                        {erroConexaoInicial}
                    </div>
                ) : (
                    /* 3. Conexão OK: FORMULÁRIO */
                    <>
                        {mensagem.texto && mensagem.tipo === 'erro' && (
                            <div className="mensagem-erro">{mensagem.texto}</div>
                        )}
                        
                        {erros.length > 0 && (
                            <div className="mensagem-erro-lista">
                                <p><strong>Verifique os erros:</strong></p>
                                <ul>{erros.map((erro, i) => <li key={i}>{erro}</li>)}</ul>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
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
                                <input type="number" id="quantidade" className="form-input" value={quantidade} onChange={handleQuantidadeChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} step="1" />
                            </div>
                            
                            <button type="submit" className="btn-acao btn-azul btn-full">Cadastrar</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default PaginaCadastrar;