import { useRouteError, Link } from "react-router-dom";

function PaginaErro() {
    // Captura o erro da rota
    const error = useRouteError();
    console.error(error);

    let titulo = 'Ocorreu um Erro!';
    let mensagem = 'Desculpe, algo deu errado.';
    
    // Se for um erro 404 de rota não encontrada (o mais comum)
    if (error && error.status === 404) {
        titulo = '404 - Página Não Encontrada';
        mensagem = 'Não conseguimos encontrar a página que você estava procurando.';
    }

    return (
        <div id="pagina-erro" style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1>{titulo}</h1>
            <p>{mensagem}</p>
            
            {/* Opcional: Exibe o detalhe do erro para o desenvolvedor */}
            {error && <p style={{ color: '#888' }}>Detalhe: <i>{error.statusText || error.message}</i></p>}

            <p style={{ marginTop: '30px' }}>
                <Link 
                    to="/" 
                    className="link-btn-navegacao"
                    style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}
                >
                    Clique aqui para voltar ao Início
                </Link>
            </p>
        </div>
    );
}

export default PaginaErro;