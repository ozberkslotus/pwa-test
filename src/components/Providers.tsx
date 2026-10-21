"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App as AntdApp, ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import { getQueryClient } from "@/lib/query-client";
import { antdTheme } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <ConfigProvider theme={antdTheme} locale={trTR}>
          {/* AntdApp: message / notification / modal'ı hook ile kullanmayı sağlar */}
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </AntdRegistry>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
