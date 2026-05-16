package com.medikitos.medicit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.repository.Repo_Paciente;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Paciente {
    @Autowired
    private Repo_Paciente repoPaciente;
    
}
