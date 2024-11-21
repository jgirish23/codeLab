package com.codelab.codelab.controller;

import com.codelab.codelab.service.ICodeLab;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CodeLabController {

    @Autowired
    ICodeLab codeLab;

    @GetMapping("/")
    public List<String> home() {
        System.out.println("codeIde called..");
//        String projectTy = codeLab.show(projectType);
        List<String> li = new ArrayList<>();
        li.add("sdifalhnk");
        li.add("fsad");
        return li;
    }

    @GetMapping("/codeLab/{projectType}")
    public ResponseEntity<List<String>> codeIde(@PathVariable String projectType) {
        System.out.println("codeIde called..");
        String projectTy = codeLab.show(projectType);
        List<String> li = new ArrayList<>();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        li.add("sdifalhnk");
        li.add("fsad");
        return new ResponseEntity<>(li,headers,HttpStatus.OK);
    }
}
