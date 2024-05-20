import { render, screen } from "test-utils";
import Hello from "../Hello";

test("renders Hello component with name", () => {
  render(<Hello name="World" />);
  const helloElement = screen.getByText(/Hello, World!/i);
  expect(helloElement).toBeInTheDocument();
});
