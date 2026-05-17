package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/especialidad")
@Tag(name = "Endpoints relacionados con especialidades", description = "Administración de especialidades médicas")
public class Controller_Especialidad {

}
