/**
 * One key per network: IPv4 as it is, IPv4 written in IPv6 form as the IPv4
 * address it holds, and IPv6 grouped by its /64 (one home or phone network).
 */
export function addressGroup(raw: string): string {
  const ip = raw.trim().toLowerCase().replace(/^\[|\]$/g, "").split("%")[0];
  if (!ip.includes(":")) return ip;
  const mapped = ip.match(/^(?:0*:)*:?ffff:(\d+\.\d+\.\d+\.\d+)$/) ?? ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return mapped[1];
  // Expand "::" so every form of the same address gives the same groups.
  const [head, tail = ""] = ip.split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t] : h;
  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return ip;
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}
