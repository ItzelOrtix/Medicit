package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/estado-cita")
@Tag(name = "Endpoints relacionados con estados de cita", description = "Administración de estados de cita")
public class Controller_EstadoCita {

}
