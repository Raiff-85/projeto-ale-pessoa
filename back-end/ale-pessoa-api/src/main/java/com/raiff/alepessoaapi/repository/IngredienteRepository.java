package com.raiff.alepessoaapi.repository;

import com.raiff.alepessoaapi.entity.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface IngredienteRepository extends JpaRepository <Ingrediente, Long> {

    List<Ingrediente> findByNomeContainingIgnoreCase(String nome);
}
