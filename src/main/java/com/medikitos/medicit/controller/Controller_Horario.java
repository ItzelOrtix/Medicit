package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/horarios")
@Tag(name = "Endpoints relacionados con horarios", description = "Administración de horarios de médicos")
public class Controller_Horario {

}
