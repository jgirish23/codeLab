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
    private Integer cnt = 0;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public TerminalController() throws IOException {
        // Initialize terminal process
        Map<String, String> env = new HashMap<>();
        env.put("TERM","xterm-256color");
        ptyProcess = PtyProcess.exec(new String[]{"/bin/bash", "-i", "-c", "stty raw -echo; exec bash"}, env, null);
        processWriter = new BufferedWriter(new OutputStreamWriter(ptyProcess.getOutputStream()));
        processReader = new BufferedReader(new InputStreamReader(ptyProcess.getInputStream()));

        // Start a thread to read terminal output
        new Thread(() -> {
            String line;
            try {
                log.info("Thread started:");
                while ((line = processReader.readLine()) != null ) {
                    log.info("Thread line: " + line);
                    cnt++;
                    if(cnt>3)messagingTemplate.convertAndSend("/queue/reply", line);
                }
                log.info("Thread ended:");
            } catch (IOException e) {
                log.error("Error in output reading thread: ", e);
                e.printStackTrace();
            }
        }).start();
        processWriter.write( "\n");
        processWriter.flush();

    }

    @MessageMapping("/execute")
    public void handleCommand(String command) throws IOException {
        try {
            log.info("command: " + command);
            cnt=0;
            processWriter.write("echo FLOW_STARTED\n");
            processWriter.write(command + "\n");
            processWriter.write("echo FLOW_IS_COMPLETE\n");
            processWriter.flush();
        } catch (IOException e) {
            log.error("Error writing command to process: ", e);
        }
    }

    @MessageMapping("/hostname")
    public void handleHostNameCommand() throws IOException {
        try {
            log.info("command: " + "echo '$(whoami)@$(hostname)'");
            processWriter.write("echo '$(whoami)@$(hostname)'" + "\n");
            processWriter.flush();
        } catch (IOException e) {
            log.error("Error writing command to process: ", e);
        }
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
