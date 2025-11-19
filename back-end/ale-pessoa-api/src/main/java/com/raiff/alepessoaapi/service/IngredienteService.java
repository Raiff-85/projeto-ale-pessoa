package com.raiff.alepessoaapi.service;

import com.raiff.alepessoaapi.entity.Ingrediente;
import com.raiff.alepessoaapi.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<Ingrediente> buscarPorNome(String nome) {
        return ingredienteRepository.findByNomeContainingIgnoreCase(nome);
    }
}