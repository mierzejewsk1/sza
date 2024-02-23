import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginButton from "../LoginButton";
import { BrowserRouter } from "react-router-dom";

const LoginMock = () => {
  return (
    <BrowserRouter>
      <LoginButton />
    </BrowserRouter>
  );
};

describe("Login button test", () => {
  it("should render", () => {
    render(<LoginMock />);
    const buttonElement = screen.getByText(/Zaloguj się/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it("should navigate to appropriate page", () => {
    render(<LoginMock />);
    const linkElement = screen.getByRole("link", { name: /Zaloguj się/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute("href")).toBe("/login");
  });
});
