package com.codelab.codelab.controller;

import com.codelab.codelab.dto.request.TextMessageDTO;
import com.pty4j.PtyProcess;
import com.pty4j.PtyProcessBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.util.Arrays;

@RestController
public class WebSocketController {

    @Autowired
    SimpMessagingTemplate template;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody TextMessageDTO textMessageDTO) {
        template.convertAndSend("/topic/message", textMessageDTO);
        System.out.println("sendMessage: " + textMessageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload TextMessageDTO textMessageDTO) {
        // receive message from client
        System.out.println("receiveMessage: " + textMessageDTO);
        textMessageDTO.setMessage("Hello from server!");
        template.convertAndSend("/topic/message", textMessageDTO);
    }

    private PtyProcessBuilder processBuilder;
    String command;
    String[] commandArgs;

    public WebSocketController(){

        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            // For Windows: Execute via cmd.exe /c
            command = "cmd.exe";
            commandArgs = new String[]{"cmd.exe", "/c", "dir"};
        } else {
            // For Unix-like systems (Linux/macOS)
            command = "/bin/bash";
            commandArgs = new String[]{"/bin/bash", "-c","ls"};
        }

        // Use PtyProcessBuilder to start the process with command and arguments
        processBuilder = new PtyProcessBuilder(commandArgs);
        File logFile = new File("terminal_log.txt");
        processBuilder.setLogFile(logFile);
    }

    @MessageMapping("/run")
    public String executeCommand(@Payload TextMessageDTO textMessageDTO) {
        try {
//            String command;
//            String[] commandArgs;
//            if (System.getProperty("os.name").toLowerCase().contains("win")) {
//                // For Windows: Execute via cmd.exe /c
//                command = "cmd.exe";
//                commandArgs = new String[]{"cmd.exe", "/c", textMessageDTO.getMessage()};
//            } else {
//                // For Unix-like systems (Linux/macOS)
//                command = "/bin/bash";
//                commandArgs = new String[]{"/bin/bash", "-c", textMessageDTO.getMessage()};
//            }
//
//            // Use PtyProcessBuilder to start the process with command and arguments
//            PtyProcessBuilder processBuilder = new PtyProcessBuilder(commandArgs);

            // Set up log file to capture terminal output
//            File logFile = new File("terminal_log.txt");
//            processBuilder.setLogFile(logFile);

            // Set up a console for real-time terminal interaction (if needed)
//            processBuilder.setConsole(true);

            processBuilder.setCommand(new String[]{"cmd.exe", "/c", textMessageDTO.getMessage()});
            // Start the process using pty4j
            PtyProcess process = processBuilder.start();

            // Capture the output of the command
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\r\n");
            }

            // Capture error output, if any
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errorOutput = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line).append("\r\n");
            }

            // Wait for the process to complete
//            process.waitFor();

            // Handle error if there is any
            if (process.exitValue() != 0) {
                output.append("\nError: Command failed with exit code " + process.exitValue());
                if (errorOutput.length() > 0) {
                    output.append("\nError Output: ").append(errorOutput.toString());
                }
            }

            // Send the output to the WebSocket
            textMessageDTO.setMessage(output.toString());
            template.convertAndSend("/topic/message", textMessageDTO);

            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            textMessageDTO.setMessage("Invalid command!!");
            template.convertAndSend("/topic/message", textMessageDTO);
            return "Error occurred while executing command";
        }
    }
}
