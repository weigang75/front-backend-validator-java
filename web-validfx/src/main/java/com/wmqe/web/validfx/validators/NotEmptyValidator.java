package com.wmqe.web.validfx.validators;

import com.wmqe.web.validfx.annotations.NotEmpty;
import com.wmqe.web.validfx.utils.StringUtil;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * 字符串非空校验类
 */
public class NotEmptyValidator extends BaseValidator<NotEmpty> {

    @Override
    public void onLoad() {

    }

    @Override
    public void onInitialize(NotEmpty constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(StringUtil.isEmpty(value)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("不能为空").addConstraintViolation();
            return false;
        }
        return true;
    }

}
