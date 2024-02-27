import { FormikHelpers, useFormik } from "formik"
import { authThunks } from "features/auth/auth-reducer"
import { BaseResponseType } from "common/types"
import { LoginDataType } from "features/auth/Login/Login"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { authSelectors } from "features/auth/auth.selectors"

type FormikErrorType = Partial<Omit<LoginDataType, "captcha">>

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = authSelectors.useIsLoggedIn()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      // if (!values.email) {
      //   errors.email = "Required"
      // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      //   errors.email = "Invalid email address"
      // }
      // if (!values.password) {
      //   errors.password = "Required"
      // } else if (values.password.length < 5) {
      //   errors.password = "Most be more 5 symbols"
      // }
      return errors
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginDataType>) => {
      // submit.setSubmiting(true) - дизейблить кнопку ( надо сделать async , await + disabled на кнопку)
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((e: BaseResponseType) => {
          console.log(e)
          e.fieldsErrors?.forEach((fieldsError) => {
            formikHelpers.setFieldError(fieldsError.field, fieldsError.error)
          })
        })
      //formik.resetForm() зачищение формы
    },
  })
  return { formik, isLoggedIn }
}
