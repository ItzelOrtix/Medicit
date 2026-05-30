package com.medikitos.medicit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/notificacion")
@Tag(name = "Endpoints relacionados con notificaciones", description = "Administración de notificaciones de citas")
public class Controller_Notificacion {

}
