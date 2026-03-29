# NAHQ Data Model Assessment

**Date:** 2026-02-26
**Source:** NAHQ Data Model v1.0 (40-page specification, 19 entities)
**Method:** Automated assessment against Universal Data Model (UDM) knowledge base

## Contents

| File | Description |
|------|-------------|
| `nahq-data-model-v1.0.pdf` | Original data model specification (input) |
| `nahq-target-state.d2` | Target state ERD — D2 source (editable) |
| `nahq-target-state.png` | Target state ERD — raster image |
| `nahq-target-state.svg` | Target state ERD — vector image (scalable) |
| `assessment-report.md` | Full findings and remediation plan |
| `deltas.md` | Baseline → Target → Migration for each change |
| `deltas.pdf` | PDF version of deltas (formatted, shareable) |

## Quick Summary

- **19 entities** assessed across people/org modeling, roles, contact info, status tracking, participation, and course mappings
- **2 GREEN** — Competency Framework versioning, Audit & Consent
- **4 YELLOW** — Party abstraction, Contact info, Status tracking, Course-Competency links
- **2 RED** — User role normalization, Engagement participation modeling
- **6 remediation tasks** created and tracked in Portable Mind (Project #33)

## How to Render the D2 Diagram

```bash
# Install D2 (one-time)
brew install d2

# Render to PNG or SVG
d2 nahq-target-state.d2 nahq-target-state.png
d2 nahq-target-state.d2 nahq-target-state.svg
```

Or paste the `.d2` file contents into https://play.d2lang.com for browser-based rendering.
