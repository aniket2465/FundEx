
package com.fundex.service;

import com.fundex.dto.RegisterRequest;
import com.fundex.entity.User;
import com.fundex.exception.EmailAlreadyExistsException;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WalletService walletService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            WalletService walletService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.walletService = walletService;
    }

    @Transactional
    public void registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered");
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                hashedPassword
        );

        // Save user
        User savedUser = userRepository.save(user);

        // Automatically create wallet
        walletService.createWallet(savedUser);
    }




    public String login(String email, String rawPassword) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        boolean passwordMatches = passwordEncoder.matches(
                rawPassword,
                user.getPassword()
        );

        if (!passwordMatches) {
            return null;
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }


    public User getUserByEmail(String email) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return optionalUser.get();
    }


}
