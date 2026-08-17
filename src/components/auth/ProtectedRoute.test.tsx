import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

vi.mock("@/lib/api/auth", () => ({
  authApi: {
    getMe: vi.fn(),
  },
}));

import { authApi } from "@/lib/api/auth";

function renderProtected(getMe: () => Promise<unknown>) {
  vi.mocked(authApi.getMe).mockImplementation(getMe as typeof authApi.getMe);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Admin Login</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ProtectedRoute", () => {
  it("shows verifying state while loading", () => {
    vi.mocked(authApi.getMe).mockReturnValue(new Promise(() => {}));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/admin/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Verifying session/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users to admin login", async () => {
    renderProtected(() => Promise.reject(new Error("no session")));
    expect(await screen.findByText("Admin Login")).toBeInTheDocument();
  });

  it("renders the outlet for an admin", async () => {
    renderProtected(() => Promise.resolve({ data: { role: "ADMIN" } }));
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
