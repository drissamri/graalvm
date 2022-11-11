package com.drissamri.micronaut;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;

import java.util.Collections;
import java.util.Map;

@Controller("/artists")

public class HomeController {

    @Post
    public Map<String, Object> index() {
        return Collections.singletonMap("message", "Hello World");
    }
}
