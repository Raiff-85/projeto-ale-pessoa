import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 1. IMPORTANTE: Importe o App (ele é a moldura do site)
import App from './App.jsx'

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
        // Rota "Pai" (Layout Principal)
        path: "/",
        element: <App />, 
        errorElement: <PaginaErro />,
        
        // Aqui definimos quem aparece DENTRO do <Outlet /> do App
        children: [
            {
                // index: true significa "quando o caminho for apenas /"
                index: true, 
                element: <PaginaInicial />
            },
            {
                path: "cadastrar",
                element: <PaginaCadastrar />
            },
            {
                path: "exibicao/:id",
                element: <PaginaExibicao />
            },
            {
                path: "buscar",
                element: <PaginaBuscar />
            },
            {
                path: "resultados",
                element: <PaginaResultados />
            },
            {
                path: "editar/:id",
                element: <PaginaEditar />
            },
            {
                path: "excluir/:id",
                element: <PaginaExcluir />
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);