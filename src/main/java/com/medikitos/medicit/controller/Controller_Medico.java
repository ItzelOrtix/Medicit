package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/medico")
@Tag(name = "Endpoints relacionados con médicos", description = "Administración de médicos")
public class Controller_Medico {

}
