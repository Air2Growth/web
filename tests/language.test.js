import assert from "node:assert/strict";
import test from "node:test";
import { detectLanguage, resolveLanguage } from "../src/language.js";

test("recognizes German and English regional browser preferences", () => {
  for (const language of ["de", "de-DE", "de-AT", "de-CH", "DE-de"]) {
    assert.equal(detectLanguage([language]), "de");
  }
  for (const language of ["en", "en-US", "en-GB"]) {
    assert.equal(detectLanguage([language]), "en");
  }
});

test("respects the order of supported browser preferences", () => {
  assert.equal(detectLanguage(["en-GB", "de-DE"]), "en");
  assert.equal(detectLanguage(["de-CH", "en-US"]), "de");
  assert.equal(detectLanguage(["fr-FR", "de-DE", "en-US"]), "de");
});

test("falls back to English when preferences are absent or unsupported", () => {
  assert.equal(detectLanguage(), "en");
  assert.equal(detectLanguage(["fr-FR", "ja-JP"]), "en");
});

test("an explicit page language takes priority over saved and browser choices", () => {
  assert.equal(resolveLanguage({ requested: "de", saved: "en", languages: ["en-US"] }), "de");
  assert.equal(resolveLanguage({ requested: "en", saved: "de", languages: ["de-DE"] }), "en");
});

test("uses a saved manual choice before browser preferences", () => {
  assert.equal(resolveLanguage({ saved: "de", languages: ["en-US"] }), "de");
  assert.equal(resolveLanguage({ saved: "en", languages: ["de-DE"] }), "en");
});

test("ignores invalid query parameters and saved values", () => {
  assert.equal(resolveLanguage({ requested: "fr", saved: "de", languages: ["en-US"] }), "de");
  assert.equal(resolveLanguage({ requested: "fr", saved: "invalid", languages: ["de-DE"] }), "de");
  assert.equal(resolveLanguage({ requested: "", saved: "", languages: [] }), "en");
});
