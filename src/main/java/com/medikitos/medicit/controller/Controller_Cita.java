package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/cita")
@Tag(name = "Endpoints relacionados con citas", description = "Administración de citas médicas")
public class Controller_Cita {

}
