import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MusicHeal from "../../pages/MusicHeal";
import youtube from "../../utils/api/youtube";

jest.mock("../../utils/api/youtube", () => ({
  get: jest.fn(),
}));

beforeAll(() => {
  Object.defineProperty(window, "scrollTo", {
    value: jest.fn(),
    writable: true,
  });
});

describe("MusicHeal Component", () => {
  test("handles submit correctly", async () => {
    const mockGet = youtube.get.mockResolvedValue({ data: { items: [] } });

    render(
      <MemoryRouter>
        <MusicHeal />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("輸入一首喜愛的歌");
    fireEvent.change(input, { target: { value: "或是一首歌" } });

    const form = screen.getByTestId("search-form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/search", {
        params: {
          q: "或是一首歌",
          part: "snippet",
          maxResults: 5,
        },
      });
    });
  });
});
