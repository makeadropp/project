import { describe, expect, it } from "bun:test"
import { app } from "./app"

describe("Server", () => {
  describe("Health Check", () => {
    it("should return 200 OK", async () => {
      const req = new Request("http://localhost/health")
      const res = await app.fetch(req)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toEqual({
        status: "🚀 User service runnning!",
        timestamp: expect.any(String)
      })
    })
  })
})