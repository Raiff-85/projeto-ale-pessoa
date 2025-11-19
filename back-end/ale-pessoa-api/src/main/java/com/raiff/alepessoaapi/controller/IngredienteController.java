package com.raiff.alepessoaapi.controller;

import com.raiff.alepessoaapi.entity.Ingrediente;
import com.raiff.alepessoaapi.repository.IngredienteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ingredientes")
@CrossOrigin(origins = "http://localhost:5173", originPatterns = "http://192.168.3.55:5173")
public class IngredienteController {
    @Autowired
    private IngredienteRepository repository;

    @PostMapping
    public Ingrediente cadastrar(@RequestBody @Valid Ingrediente ingrediente){
        return repository.save(ingrediente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok) // Se encontrar o ID, retorna 200 OK
                .orElse(ResponseEntity.notFound().build()); // Se não encontrar, retorna 404
    }

    @GetMapping
    public List<Ingrediente> buscar(@RequestParam(required = false) String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return repository.findAll();
        } else {
            return repository.findByNomeContainingIgnoreCase(nome);
        }
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Ingrediente> editar(@Valid @PathVariable Long id, @RequestBody Ingrediente ingrediente){
        return repository.findById(id)
                .map(ingredienteExistente -> {
                    ingredienteExistente.setNome(ingrediente.getNome());
                    ingredienteExistente.setDescricao(ingrediente.getDescricao());
                    ingredienteExistente.setMedida(ingrediente.getMedida());
                    ingredienteExistente.setQuantidade(ingrediente.getQuantidade());

                    return ResponseEntity.ok().body(repository.save(ingredienteExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping( value = "/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        if(!repository.existsById(id)){
            return ResponseEntity.notFound().build();
        } else {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
    }
}
