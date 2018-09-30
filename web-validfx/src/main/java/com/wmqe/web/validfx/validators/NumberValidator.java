package com.wmqe.web.validfx.validators;

import com.wmqe.web.validfx.annotations.Number;

/**
 *
 */
public class NumberValidator extends RegexValidator<Number> {

    public static final String REG_EXP = "^[0-9]*$";

    @Override
    public void onLoad() {

    }
    public NumberValidator()  {
        super(REG_EXP);
    }
}
