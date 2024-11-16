package com.codelab.codelab.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class home {


    @GetMapping("/")
    public List<String> homePage() {
        List<String> li = new ArrayList<>();
        li.add("sdifalhnk");
        li.add("fsad");
        return li;
    }
}
