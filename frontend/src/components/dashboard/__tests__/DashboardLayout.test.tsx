import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardLayout from "../DashboardLayout";

describe("Dashboard layou", () => {
  it("Dashboard should be visible", () => {
    render(<DashboardLayout children={`q`} />);

    const dashboard = screen.getByText(/q/i);

    expect(dashboard).toBeInTheDocument();
  });

  it("Side menu should be in the document", () => {
    render(<DashboardLayout children={`q`} />);

    const sidemenu = screen.queryByTestId(/sidemenu/i);

    expect(sidemenu).toBeVisible();
  });

  it("Side menu should not be visible after click hamburger icon", () => {
    render(<DashboardLayout children={`q`} />);

    const sidemenu = screen.queryByTestId(/sidemenu/i);
    const hamburgericon = screen.queryByTestId(/hamburger icon/i);

    fireEvent.click(hamburgericon);

    expect(sidemenu).not.toBeVisible();
  });
});
