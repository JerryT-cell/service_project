package com.briko;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée de l'application backend Briko.
 * Démarre Spring Boot et laisse la détection des composants parcourir com.briko.
 * Aucune règle métier ne doit être ajoutée dans cette classe.
 */
@SpringBootApplication
public class BrikoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrikoApplication.class, args);
	}

}
