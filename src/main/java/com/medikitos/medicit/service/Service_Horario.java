package com.medikitos.medicit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.repository.Repo_Horario;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Horario {

    @Autowired
    private Repo_Horario repoHorario;

}
