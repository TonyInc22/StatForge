import { fetch } from "undici";
import Bottleneck from "bottleneck";
import pRetry from "p-retry";
import { z } from "zod";

const limiter = new Bottleneck({ minTime: 350, maxConcurrent: 1 }); // be gentle

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36";

async function getJson<T>(url: string): Promise<T> {
  return limiter.schedule(() =>
    pRetry(async () => {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return (await res.json()) as T;
    }, { retries: 3, factor: 2, minTimeout: 500 })
  );
}

export async function fetchTeams() {
  const url = `site.api.espn.com/apis/site/v2/sports/football/nfl/teams`;
  return getJson<any>(url);
}

export const TeamSchema = z.object({
  id: z.string(),
  abbr: z.string().optional(),
  name: z.string(),
  displayName: z.string(),
  location: z.string(),
  color: z.string().optional(),
  alternateColor: z.string().optional(),
  logo: z.string().optional(),
  leagueId: z.string(),
  sportId: z.string()
});