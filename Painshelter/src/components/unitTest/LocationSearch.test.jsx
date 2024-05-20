import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LocationSearch from "../LocationSearch";

jest.mock("axios");

describe("LocationSearch Component", () => {
  it("renders the input and the button", () => {
    render(<LocationSearch />);
    expect(
      screen.getByPlaceholderText("請輸入地點，如：花蓮市美崙")
    ).toBeInTheDocument();
    expect(screen.getByTitle("搜尋地點")).toBeInTheDocument();
  });
});
