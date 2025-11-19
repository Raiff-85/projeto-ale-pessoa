import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import PaginaInicial from './pages/PaginaInicial.jsx'
import PaginaCadastrar from './pages/PaginaCadastrar.jsx'
import PaginaBuscar from './pages/PaginaBuscar.jsx'
import PaginaEditar from './pages/PaginaEditar.jsx'
import PaginaExcluir from './pages/PaginaExcluir.jsx'
import PaginaResultados from './pages/PaginaResultados.jsx'
import PaginaExibicao from './pages/PaginaExibicao.jsx';
import PaginaErro from './pages/PaginaErro.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <PaginaInicial />,
        // ADIÇÃO: Configura o PaginaErro para capturar 404 (rotas não encontradas)
        // e outros erros que possam ocorrer no carregamento
        errorElement: <PaginaErro />, 
    },
    { path: "/cadastrar", element: <PaginaCadastrar /> },
    // ATUALIZADO: Rota de exibição
    { path: "/exibicao/:id", element: <PaginaExibicao /> },

    { path: "/buscar", element: <PaginaBuscar /> },
    
    // A NOVA ROTA "ECONÔMICA"
    { path: "/resultados", element: <PaginaResultados /> },
    
    // A rota /detalhe foi EXCLUÍDA
    
    { path: "/editar/:id", element: < PaginaEditar /> },
    { path: "/excluir/:id", element: < PaginaExcluir /> }
]);

// Renderizar o mapa
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);