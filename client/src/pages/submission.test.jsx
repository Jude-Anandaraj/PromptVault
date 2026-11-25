import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Members from "./Members";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    categories: vi.fn(),
    prompts: vi.fn(),
    members: vi.fn()
  }
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, signOut: vi.fn() })
}));

function renderInRouter(element) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

describe("submission UI", () => {
  beforeEach(() => {
    api.categories.mockResolvedValue({ categories: [] });
    api.prompts.mockResolvedValue({ prompts: [] });
    api.members.mockResolvedValue({
      users: [
        { id: "member-one", name: "Alex Green", createdAt: "2026-01-01", promptCount: 2 },
        { id: "member-two", name: "Sam Blue", createdAt: "2026-01-02", promptCount: 1 }
      ]
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows the PromptVault wordmark on Explore", () => {
    renderInRouter(<Home />);

    expect(screen.getByRole("link", { name: "PromptVault home" })).toBeTruthy();
  });

  it("labels the signed-out navigation action Sign In", () => {
    renderInRouter(<Navbar />);

    expect(screen.getByRole("link", { name: "Sign In" })).toBeTruthy();
  });

  it("shows singular and plural prompt counts for members", async () => {
    renderInRouter(<Members />);

    expect(await screen.findByText("2 prompts")).toBeTruthy();
    expect(screen.getByText("1 prompt")).toBeTruthy();
  });
});