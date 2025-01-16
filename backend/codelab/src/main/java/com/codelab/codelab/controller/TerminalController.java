package com.codelab.codelab.controller;

import com.pty4j.PtyProcess;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
public class TerminalController {

    private PtyProcess ptyProcess;
    private BufferedWriter processWriter;
    private BufferedReader processReader;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public TerminalController() throws IOException {
        // Initialize terminal process
        Map<String, String> env = new HashMap<>();
        env.put("TERM","xterm-256color");
//        ptyProcess = PtyProcess.exec(new String[]{"/bin/bash", "-i"}, env, null);
        ptyProcess = PtyProcess.exec(new String[]{"/bin/bash", "-i", "-c", "stty raw -echo; exec bash"}, env, null);
//        ptyProcess = PtyProcess.exec(new String[]{"sudo", "-u", "root", "/bin/bash", "-i"}, env, "/home/darkway/Documents");

        processWriter = new BufferedWriter(new OutputStreamWriter(ptyProcess.getOutputStream()));
        processReader = new BufferedReader(new InputStreamReader(ptyProcess.getInputStream()));

        // Start a thread to read terminal output
        new Thread(() -> {
            String line;
            try {
                log.info("Thread started:");
                while ((line = processReader.readLine()) != null ) {
                    log.info("Thread line: " + line);
                    messagingTemplate.convertAndSend("/queue/reply", line );
                    Thread.sleep(1000);
                }
                log.info("Thread ended:");
            } catch (IOException | InterruptedException e) {
                log.error("Error in output reading thread: ", e);
                e.printStackTrace();
            }
        }).start();
    }

    @MessageMapping("/execute")
    public void handleCommand(String command) throws IOException {
        try {
            log.info("command: " + command);
            processWriter.write(command + "\n");
            processWriter.flush();
        } catch (IOException e) {
            log.error("Error writing command to process: ", e);
        }
//        messagingTemplate.convertAndSend("/queue/reply", command);
    }

    // Cleanup resources on shutdown
    public void destroy() throws IOException {
        if (ptyProcess != null) {
            ptyProcess.destroy();
        }
        if (processWriter != null) {
            processWriter.close();
        }
        if (processReader != null) {
            processReader.close();
        }
    }
}
