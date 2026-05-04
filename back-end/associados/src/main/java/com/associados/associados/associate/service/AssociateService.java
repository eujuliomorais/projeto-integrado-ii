package com.associados.associados.associate.service;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssociateService {

    private final AssociateRepository associateRepository;
    private final UserRepository userRepository;
    

    @Transactional
    public void register(RegisterAssociateDto data) {
        User newUser = new User();
        newUser.setName(data.nomeCompleto());
        newUser.setEmail(data.email());
        newUser.setRole(RoleEnum.ASSOCIATE);
        newUser.setActive(true);
        userRepository.save(newUser);

        Address address = new Address();
        address.setCep(data.cep());
        address.setRua(data.rua());
        address.setNumero(data.numero());
        address.setBairro(data.bairro());
        address.setCidade(data.cidade());
        address.setEstado(data.estado());

        SelfDeclaration declaration = new SelfDeclaration();
        declaration.setRaca(data.raca());
        declaration.setGenero(data.genero());
        declaration.setOrientacaoSexual(data.orientacaoSexual());
        declaration.setEscolaridade(data.escolaridade());
        declaration.setRenda(data.renda());
        declaration.setDeficiencia(data.deficiencia());

        Associate associate = new Associate();
        associate.setCpf(data.cpf());
        associate.setDataNascimento(data.dataNascimento());
        associate.setCategoriaAtuacao(data.categoriaAtuacao());
        associate.setTelefone(data.telefone());
        associate.setUser(newUser);
        associate.setAddress(address);
        associate.setSelfDeclaration(declaration);

        associateRepository.save(associate);
    }
}