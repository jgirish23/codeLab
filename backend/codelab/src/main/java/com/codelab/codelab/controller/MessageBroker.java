package com.codelab.codelab.controller;

import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MessageBroker {

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/broadcast")
    public void broadcastMessage(@Payload String message) {
        System.out.println("message:");
        System.out.println(message);
        messagingTemplate.convertAndSend("/queue/reply", "You have a message from someone: " + message);
//        return "You have received a message: " + message;
    }
}
