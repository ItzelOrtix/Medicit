package com.medikitos.medicit.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.entity.Credencial;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.web}")
    private long expirationWeb;

    public String generateToken(Credencial credencial) {
        return Jwts.builder()
                .subject(credencial.getCorreo())
                .claim("id", credencial.getId())
                .claim("rol", credencial.getRol().getNombre())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationWeb))
                .signWith(getKey())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public long getExpirationWeb() {
        return expirationWeb;
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

}
