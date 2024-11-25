package com.codelab.codelab.controller;

import com.codelab.codelab.dto.request.TextMessageDTO;
import org.jline.utils.AttributedStyle;
import org.jline.utils.AttributedString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.shell.Shell;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@RestController
public class WebSocketController {

    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    Shell shell;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody TextMessageDTO textMessageDTO) {
        template.convertAndSend("/topic/message", textMessageDTO);
        System.out.println("sendMessage: " + textMessageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload TextMessageDTO textMessageDTO) {
        // receive message from client
        System.out.println("receiveMessage" + textMessageDTO);
        textMessageDTO.setMessage("Hello from server!");
        template.convertAndSend("/topic/message", textMessageDTO);
    }

    @MessageMapping("/run")
    public String executeCommand(@Payload TextMessageDTO textMessageDTO) {
        try {
            String command;
            if (System.getProperty("os.name").toLowerCase().contains("win")) {
                // For Windows
                command = "cmd.exe /c dir";
            } else {
                // For Unix-like systems (Linux/macOS)
                command = "ls -l";
            }

            Process process = Runtime.getRuntime().exec(command);

            // Capture the output of the command
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            // Wait for the command to complete
            process.waitFor();
            System.out.println(output.toString());
            textMessageDTO.setMessage(output.toString());
            template.convertAndSend("/topic/message", textMessageDTO);
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred while executing command";
        }
    }

    // Run shell command and capture output
    private String runCommand(String command) {
        ProcessBuilder processBuilder = new ProcessBuilder();

        // For Windows, use cmd.exe with /c to execute the command
        processBuilder.command("cmd.exe", "/c", command);

        StringBuilder output = new StringBuilder();
        StringBuilder errorOutput = new StringBuilder(); // To capture error output
        try {
            // Start the process
            Process process = processBuilder.start();

            // Read the standard output from the command
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            // Read the error output from the command
            try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String errorLine;
                while ((errorLine = errorReader.readLine()) != null) {
                    errorOutput.append(errorLine).append("\n");
                }
            }

            // Wait for the process to finish and get the exit code
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                // If the command failed, append the error output and exit code
                output.append("\nError: Command failed with exit code ").append(exitCode);
                if (errorOutput.length() > 0) {
                    output.append("\nError Output: ").append(errorOutput.toString());
                }
            }

        } catch (IOException | InterruptedException e) {
            output.append("Error running command: ").append(e.getMessage());
        }

        return output.toString();
    }


    @SendTo("/topic/message")
    public TextMessageDTO broadcastMessage(@Payload TextMessageDTO textMessageDTO) {
        System.out.println("broadcastMessage" + textMessageDTO);
        return textMessageDTO;
    }
}
