package com.codelab.codelab.service;

import org.springframework.stereotype.Service;

@Service
public class ICodeLab implements CodeLab{

    @Override
    public String show(String projectName) {
        return projectName + "is the type of project template";
    }
}
