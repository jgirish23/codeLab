package com.codelab.codelab.controller;

import com.codelab.codelab.dto.request.TextMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        System.out.println("receiveMessage" + textMessageDTO);
        textMessageDTO.setMessage("Hello from server!");
        template.convertAndSend("/topic/message", textMessageDTO);
    }



    @SendTo("/topic/message")
    public TextMessageDTO broadcastMessage(@Payload TextMessageDTO textMessageDTO) {
        System.out.println("broadcastMessage" + textMessageDTO);
        return textMessageDTO;
    }
}
