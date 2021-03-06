package com.wmqe.web.controllers;

import com.wmqe.web.vo.LoginUserVo;
import com.wmqe.web.vo.UserVo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    /**
     * 注册用户
     * @param user
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity registerUser(@RequestBody(required = true) UserVo user ) {

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    /**
     *
     * @param user
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity userLogin(@RequestBody(required = true) LoginUserVo user ) {

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    /**
     * 获取用户
     * @param userId
     * @return
     */
    @GetMapping("/{userId}")
    public ResponseEntity getUser(@PathVariable String userId) {
        UserVo user = new UserVo();
        user.setUserId(userId);
        user.setEmail("hi@qq.com");
        List<String> hobbies = new ArrayList<>();
        hobbies.add("音乐");
        user.setHobbies(hobbies);
        user.setGender("男");
        return new ResponseEntity<UserVo>(user, HttpStatus.OK);
    }
}
