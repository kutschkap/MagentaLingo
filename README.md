# MagentaLingo

Microsoft 365 lernen mit Tilly – spielerisch und für den Vertrieb.

- 6 Kapitel von Teams bis Lizenzen, je 6 Lektionen und ein Abschlusstest
- Level Silber, Gold und Magenta
- Fehlertraining, Tagesziel, Serien und Erfolge
- **Wissen: Das digitale Büro** – Rundgang durch ein Büro, in dem jeder Raum zeigt, welche Tools dort arbeiten (Sicherheit, Modern Work, KI), einfach erklärt und mit Lizenz-Spickzettel
- Spielstand bleibt im Browser; Sicherung als Datei unter „Erfolge“
- Läuft auch offline und lässt sich als App installieren (über GitHub Pages)

Einfach `index.html` öffnen oder über GitHub Pages aufrufen.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | App, Design und Logik |
| `content.js` | Alle Fragen, Hinweise von Tilly und der Lernbereich mit Lizenzangaben |
| `fonts/`, `icons/` | Schriften und Icons, lokal ausgeliefert (keine Anfragen an Google) |
| `sw.js`, `manifest.webmanifest` | Offline-Nutzung und Installation als App |
| `tools/check-content.js` | Prüft die Inhalte |

## Inhalte ändern

1. Fragen und Texte in `content.js` bearbeiten.
2. Prüfen:
   ```bash
   node tools/check-content.js
   ```
   Der Check meldet Fehler im Aufbau und schlägt Alarm, wenn sich Antworten erraten lassen: wenn die richtige Antwort zu oft die längste oder kürzeste ist oder wenn „Stimmt“ und „Stimmt nicht“ nicht ungefähr gleich oft richtig sind. Er läuft auch automatisch bei jedem Push.
3. In `sw.js` die `VERSION` erhöhen, damit installierte Apps die neuen Inhalte holen.
4. Bei Lizenzänderungen das Prüfdatum anpassen (`checked` je Kapitel und `LEARN.checked`).
