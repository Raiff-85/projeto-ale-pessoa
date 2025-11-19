package com.raiff.alepessoaapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Entity
public class Ingrediente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O campo 'nome' não pode estar vazio ou em branco.")
    @Size(min = 3, message = "O nome deve ter pelo menos 3 caracteres.")
    @Size(max = 50, message = "O nome deve ter no máximo 255 caracteres.")
    private String nome;

    @Size(max = 50, message = "A descrição deve ter no máximo 50 caracteres")
    private String descricao;

    @NotBlank(message = "A 'medida' não pode estar vazia.")
    @Column(name = "medida_Kg_ou_L")
    private String medida;

    @NotNull(message = "A quantidade não pode estar vazia.")
    @Min(value = 1, message = "A quantidade deve ser maior que zero.")
    private Integer quantidade;
}
