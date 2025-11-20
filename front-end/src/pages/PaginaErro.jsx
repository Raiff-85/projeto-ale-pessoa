import { useRouteError, Link } from "react-router-dom";

function PaginaErro() {
    const error = useRouteError();
    console.error(error);

    let titulo = 'Ocorreu um Erro!';
    let mensagem = 'Desculpe, algo deu errado.';

    if (error && error.status === 404) {
        titulo = '404 - Página Não Encontrada';
        mensagem = 'Não conseguimos encontrar a página que você estava procurando.';
    }

    return (
        <div id="pagina-erro" className="pagina-erro">
            <h1 className="erro-titulo">{titulo}</h1>
            <p className="erro-mensagem">{mensagem}</p>

            {error && (
                <p className="erro-detalhe">
                    Detalhe: <i>{error.statusText || error.message}</i>
                </p>
            )}

            <p className="erro-voltar-container">
                <Link to="/" className="btn-voltar">
                    Clique aqui para voltar ao Início
                </Link>
            </p>
        </div>
    );
}

export default PaginaErro;
