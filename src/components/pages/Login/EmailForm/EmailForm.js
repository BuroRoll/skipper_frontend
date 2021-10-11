import React from 'react';
import {Formik} from "formik";
import s from './EmailForm.module.css'
import Button from "../../../UI/Button/Button";
import {Link} from "react-router-dom";
import * as yup from 'yup'
import TextInput from "../../../UI/TextInput/TextInput";

const EmailForm = () => {

    const validationSchema = yup.object({
        email: yup.string().required('Обязательное поле').email('Неправильная форма почты'),
        password: yup.string().required('Обязательное поле')
    })

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                saveMe: false
            }}
            onSubmit={(values) => {
                console.log(values)
            }}
            validationSchema={validationSchema}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.input_container}>
                        <TextInput
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            placeholder={'Email'}
                        />
                        <div className={s.error}>{errors.email && touched.email && errors.email}</div>
                    </div>
                    <div className={s.input_container}>
                        <TextInput
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder={'Password'}
                        />
                        <div className={s.error}>{errors.password && touched.password && errors.password}</div>
                    </div>
                    <div className={s.low_container}>
                        <div>
                            <input
                                name="saveMe"
                                type="checkbox"
                                onChange={handleChange}
                                value={values.saveMe}/>
                            <label>Оставаться в системе</label>
                        </div>
                        <span className={s.lost_password}>Забыли пароль?</span>
                    </div>
                    <div className={s.btn_container}>
                        <Button title={'Войти'} onClick={handleSubmit}
                                disabled={isSubmitting}/>
                    </div>
                    <Link to={'/registration'}>
                        <div className={s.to_reg}>
                            Зарегистрироваться
                        </div>
                    </Link>
                </form>
            )}
        </Formik>
    );
};

export default EmailForm;