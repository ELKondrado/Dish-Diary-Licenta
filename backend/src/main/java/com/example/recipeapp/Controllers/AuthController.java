package com.example.recipeapp.Controllers;

import com.example.recipeapp.Exceptions.RoleNotFoundException;
import com.example.recipeapp.Model.Role;
import com.example.recipeapp.Model.User;
import com.example.recipeapp.Repositories.RoleRepository;
import com.example.recipeapp.Repositories.UserRepository;
import com.example.recipeapp.Security.JwtGenerator;
import com.example.recipeapp.Dtos.LoginDto;
import com.example.recipeapp.Dtos.RegisterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/auth")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtGenerator jwtGenerator;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("token", token);
            return new ResponseEntity<>(successResponse, HttpStatus.OK);
        } catch (Exception e) {
            // Authentication failed
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterDto registerDto) {
        if (userRepository.existsByUserName(registerDto.getUsername())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Username is taken!");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RoleNotFoundException("Role 'USER' not found"));

        User user = new User();
        user.setUserName(registerDto.getUsername());
        user.setUserPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRoles(Collections.singletonList(userRole));

        userRepository.save(user);

        Map<String, String> successResponse = new HashMap<>();
        successResponse.put("message", "User registered successfully!");
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }
}
