import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import SideMenuItem from "../SideMenuItem";
import { IoConstructOutline } from "react-icons/io5";

describe("Side menu item test", () => {
  it("should render", () => {
    render(<SideMenuItem icon={<IoConstructOutline />} text={`Usterki`} />);
    const textElement = screen.getByText(/Usterki/i);
    expect(textElement).toBeInTheDocument();
  });
});
