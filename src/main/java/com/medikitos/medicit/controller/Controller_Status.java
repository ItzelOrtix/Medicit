package com.medikitos.medicit.controller;

import javax.sql.DataSource;
import java.sql.Connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class Controller_Status {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public String status() {
        try (Connection conn = dataSource.getConnection()) {
            String dbName = conn.getCatalog();
            return "Conexion exitosa a la base de datos: " + dbName;
        } catch (Exception e) {
            return "Error al conectar con la base de datos: " + e.getMessage();
        }
    }

}
