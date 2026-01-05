Mini Gotham Sample Dataset (Synthetic)

Files:
- persons.csv: includes one deliberate duplicate (P002 alias_of P001) for entity-resolution demos
- phones.csv, devices.csv, vehicles.csv, locations.csv
- person_phone.csv, person_device.csv, person_vehicle.csv, person_org.csv: relationship tables
- events.csv, attendance.csv: event + participation
- cdr_calls.csv, messages.csv: communications edges (CDR-like)
- accounts.csv, transactions.csv: money flows
- sightings.csv: geo-temporal points for map/timeline
- documents.csv + docs/*.txt: unstructured text
- document_mentions.csv: "NLP extracted" entity mentions from docs
- ontology.yaml: a tiny ontology spec tying it all together

Suggested demo paths:
1) Start with +252611001001 (PH001) -> Person P001 -> expand links -> cafe meeting E001 -> map/timeline.
2) Show entity-resolution: P002 should merge into P001 (same DOB, near-identical name).
3) Money flow: A001 -> A005 -> A002 -> A003 around the port arrival timeframe.
