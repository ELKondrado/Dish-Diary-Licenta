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
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtGenerator jwtGenerator;

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
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterDto registerDto) {
        Map<String, String> response = new HashMap<>();
        if (userRepository.existsByUserName(registerDto.getUsername())) {
            response.put("statusUsername", "USERNAME IS TAKEN");
        }
        if(registerDto.getPassword().length() < 8) {
            response.put("statusPassword", "PASSWORD IS NOT STRONG ENOUGH");
        }
        if(!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            response.put("statusConfirmPassword", "PASSWORD DOES NOT MATCH");
        }
        if (userRepository.existsByUserNickname(registerDto.getNickname())) {
            response.put("statusNickname", "NICKNAME IS TAKEN");
        }
        if (userRepository.existsByUserEmail(registerDto.getEmail())) {
            response.put("statusEmail", "EMAIL IS TAKEN");
        }
        if (!response.containsKey("statusUsername") &&
                !response.containsKey("statusNickname") &&
                !response.containsKey("statusEmail") &&
                !response.containsKey("statusPassword")) {

            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RoleNotFoundException("Role 'USER' not found"));

            User user = new User();
            user.setUserName(registerDto.getUsername());
            user.setUserPassword(passwordEncoder.encode(registerDto.getPassword()));
            user.setUserNickname(registerDto.getNickname());
            user.setUserEmail(registerDto.getEmail());
            user.setRoles(Collections.singletonList(userRole));
            user.setTotalRecipes(0);
            user.setTotalRecipesCreated(0);
            user.setTotalRecipesAdded(0);

            userRepository.save(user);

            response.put("status", "SUCCESS");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
