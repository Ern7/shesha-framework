import { SmileOutlined } from "@ant-design/icons";
import { Alert, Button, Form, notification, Result } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useUserResetPasswordUsingToken } from "api/user";
import { PasswordConfirmPasswordInputs } from "components";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { URL_LOGIN_PAGE } from "routes";
import { useAuth, ValidationErrors } from "@shesha/reactjs";
import { IPasswordConfirmPassword } from "src/components/global/passwordConfirmPasswordInputs";
import { ResetPasswordContainer } from "../../../components/pages/account/reset-password/styles";

export const ResetPassword: FC = () => {
  const { verifyOtpResPayload, resetPasswordSuccess } = useAuth();
  const [form] = Form.useForm<IPasswordConfirmPassword>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const { mutate, loading, error } = useUserResetPasswordUsingToken();

  if (
    !verifyOtpResPayload ||
    (verifyOtpResPayload && !verifyOtpResPayload.token) ||
    !verifyOtpResPayload.username
  ) {
    return (
      <div className="reset-password-page not-authorized">
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={() => router.push(URL_LOGIN_PAGE)}>
              Back Login Page
            </Button>
          }
        />
      </div>
    );
  }

  const handleResetPassword = ({
    password: newPassword,
    confirmPassword: localConfirmPassword,
  }: IPasswordConfirmPassword) => {
    if (newPassword === localConfirmPassword) {
      mutate({
        username: verifyOtpResPayload?.username,
        newPassword,
        token: verifyOtpResPayload?.token,
      }).then(() => {
        resetPasswordSuccess(); // This will clear verifyOtpResPayload

        notification.open({
          message: "Password Reset Successful!",
          description:
            "Your password has been reset successfully! You will be redirected to the login page very soon.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
          onClose: () => {
            router.push(URL_LOGIN_PAGE);
          },
        });
      });
    }
  };

  return (
    <ResetPasswordContainer
      className="reset-password-page"
      heading="Reset Your Password"
      hint="Please enter your new password below"
    >
      <Alert
        message="OTP verification was successful!"
        type="success"
        showIcon
      />

      <ValidationErrors error={error?.data as any} />

      <Form form={form} onFinish={handleResetPassword}>
        <PasswordConfirmPasswordInputs
          {...{ password, confirmPassword, setPassword, setConfirmPassword }}
        />

        <FormItem className="un-authed-btn-container">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            loading={loading}
            disabled={!password.trim().length || password !== confirmPassword}
          >
            {loading ? "Resetting Password...." : "Reset Password"}
          </Button>
        </FormItem>
      </Form>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
