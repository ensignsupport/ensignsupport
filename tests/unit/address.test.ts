import { describe, expect, test } from "vitest";
import { addressGroup } from "@/lib/address";

describe("sign in limits group addresses by network", () => {
  test("IPv4 stays as it is", () => {
    expect(addressGroup("203.0.113.5")).toBe("203.0.113.5");
  });
  test("IPv4 written in IPv6 form counts as the IPv4 address", () => {
    expect(addressGroup("::ffff:203.0.113.5")).toBe("203.0.113.5");
    expect(addressGroup("0:0:0:0:0:ffff:203.0.113.5")).toBe("203.0.113.5");
  });
  test("every address in one IPv6 /64 is one group, however it is written", () => {
    const a = addressGroup("2001:db8:85a3:12::1");
    expect(a).toBe("2001:db8:85a3:12::/64");
    expect(addressGroup("2001:0db8:85a3:0012:0000:0000:0000:0042")).toBe(a);
    expect(addressGroup("[2001:DB8:85A3:12:ffff::9]")).toBe(a);
    expect(addressGroup("2001:db8:85a3:13::1")).not.toBe(a);
  });
  test("short IPv6 forms expand correctly", () => {
    expect(addressGroup("2001:db8::1")).toBe("2001:db8:0:0::/64");
    expect(addressGroup("fe80::1%eth0")).toBe("fe80:0:0:0::/64");
  });
});
