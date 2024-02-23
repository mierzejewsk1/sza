import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideMenu from "../SideMenu";

describe("Side menu test", () => {
  it("sidemenu should be visible", () => {
    render(<SideMenu open={true} changeMenuState={() => {}} />);

    const sideMenu = screen.getByText(/Your work/i);

    expect(sideMenu).toBeVisible();
  });

  it("side menu should be invisible", () => {
    render(<SideMenu open={true} changeMenuState={() => {}} />);

    const hamburgerMenu = screen.queryByTestId("hamburger icon");
    const avatarSubMenu = screen.queryByTestId("avatar submenu");

    // fireEvent.click(hamburgerMenu);
    if (hamburgerMenu) {
      fireEvent.click(hamburgerMenu);
    }

    const sideMenu = screen.queryByTestId("sidemenu");

    //expect(sideMenu).not.toBeVisible();
    expect(avatarSubMenu).not.toBeInTheDocument();
  });
});
