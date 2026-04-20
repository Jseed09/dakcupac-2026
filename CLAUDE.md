# DakCUPAC 2026 — project conventions

## Tracker key format

Every per-candidate localStorage tracker key uses **first name + last name + district**, lower-cased with non-letter characters stripped:

    person_{firstslug}_{lastslug}_{district}

Examples:

- Dawson Holle, District 31 → `person_dawson_holle_31`
- Karen Rohr, District 31 → `person_karen_rohr_31`
- Anna S (Garrett) Novak, District 33 → `person_anna_novak_33` (middle initials and parenthetical aliases are ignored)

Never key candidates by last name + district alone — that format caused collisions for shared last names (Johnson, Becker, Vetter, Kessel, Anderson, Roers, Kenner) and resulted in the wrong person's email / phone / address appearing on exports.

The canonical implementation lives in `personKey(name, dist)` in `index.html`. All new code that reads or writes the tracker must go through `personKey`, not hand-built strings. Pre-seeded keys and any string literals referencing the tracker must follow the same convention.

When accepting new tracker data from older builds, migrate legacy `person_{last}_{district}` keys forward on startup (see the migration block in `index.html` near the other startup backfills).

## Export semantics (check-request workflow)

- `approved` = committee voted yes; candidate belongs on the Jessica check-request export.
- `contributed` = check has been written and is on its way out; still exports.
- `review`, `pass`, `none` = do **not** export.

"Accept rec" and "Apply All" both set status to `approved` (never downgrade `contributed`). The money-bag 💰 sidebar total and the check-request export must always agree — both count only `approved + contributed` dollars.

## Exports must carry contact info

Every per-candidate export row (Summary sheet, per-candidate check-request sheet, Jessica email body, approved JSON) must include the candidate's email and phone pulled from their profile in `CANDIDATES` (with `LEADERS` as a fallback for legislators whose contact info lives there). Don't ship an export that lists a candidate without their contact info unless the profile genuinely has none.
