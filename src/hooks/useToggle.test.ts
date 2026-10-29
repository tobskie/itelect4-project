// ===== SESSION 12: a NEW file =========================================
// Test 2 of 3: hook state. A hook can only run inside a component, so
// renderHook makes a tiny one whose only job is to call it.
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useToggle from "./useToggle";

describe("useToggle", () => {
  it("starts at the value it was given", () => {
    const { result } = renderHook(() => useToggle(false));

    // result.current is whatever the hook returned on its latest
    // render: here the tuple [value, toggle].
    expect(result.current[0]).toBe(false);
  });

  it("flips the value each time toggle is called", () => {
    // Started at true this time, so the first flip goes the other way.
    const { result } = renderHook(() => useToggle(true));

    // A state change, so it goes inside act(): React finishes the
    // re-render before the next line reads result.current.
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});
