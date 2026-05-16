package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/paciente")
@Tag(name = "Endpoints relacionados con pacientes", description = "Administración de pacientes")
public class Controller_Paciente {

}
