"use client";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLogin } from "@/features/auth/hooks";
import type { LoginPayload } from "@/features/auth/types";
import { HOME_ROUTE } from "@/lib/routes";
import { tokenStorage } from "@/lib/token-storage";

export function LoginForm() {
  const [form] = Form.useForm<LoginPayload>();
  const router = useRouter();
  const { mutate, isPending, error, reset } = useLogin();

  // Zaten giriş yapılmışsa doğrudan ana sayfaya geç
  useEffect(() => {
    if (tokenStorage.get()) router.replace(HOME_ROUTE);
  }, [router]);

  return (
    <Form<LoginPayload>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ remember: true }}
      onFinish={(values) => mutate(values)}
      onValuesChange={() => error && reset()}
      className="flex flex-1 flex-col"
    >
      {error && (
        <Alert type="error" showIcon title={error.message} className="mb-5" />
      )}

      <Form.Item
        label="E-posta"
        name="email"
        rules={[
          { required: true, message: "E-posta adresini gir." },
          { type: "email", message: "Geçerli bir e-posta adresi gir." },
        ]}
      >
        <Input
          size="large"
          prefix={<MailOutlined className="text-muted" />}
          placeholder="ornek@mail.com"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
        />
      </Form.Item>

      <Form.Item
        label="Şifre"
        name="password"
        rules={[
          { required: true, message: "Şifreni gir." },
          { min: 6, message: "Şifre en az 6 karakter olmalı." },
        ]}
        className="mb-3"
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="text-muted" />}
          placeholder="Şifren"
          autoComplete="current-password"
        />
      </Form.Item>

      <div className="mb-6 flex items-center justify-between">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Beni hatırla</Checkbox>
        </Form.Item>
        <Link href="#" className="text-[15px] font-medium text-brand no-underline">
          Şifremi unuttum
        </Link>
      </div>

      {/* Butonu ekranın altına, başparmağın kolay eriştiği yere it */}
      <div className="mt-auto pb-6">
        <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
          Giriş yap
        </Button>
        <p className="mt-5 text-center text-[15px] text-muted">
          Hesabın yok mu?{" "}
          <Link href="#" className="font-semibold text-brand no-underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </Form>
  );
}
