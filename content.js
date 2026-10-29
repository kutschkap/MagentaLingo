/* MagentaLingo · Inhalte. Wird von index.html geladen und von tools/check-content.js geprüft.
   Aufgabentypen: mc (Auswahl, a = Index der richtigen Option), tf (Stimmt/Stimmt nicht), match (Paare), gap (Lückentext), order (Reihenfolge).
   Faustregeln: Ablenker plausibel und etwa gleich lang wie die richtige Antwort, Richtig/Falsch etwa je zur Hälfte. */
const TIER=[{n:'Silber',k:'silver',d:'Kennt Produkte, Begriffe und den Nutzen'},{n:'Gold',k:'gold',d:'Berät Kunden zu Szenarien und Einwänden'},{n:'Magenta',k:'magenta',d:'Schnürt Lösungen und Lizenzpakete'}];

const CATS=[
{id:'teams',name:'Teams & Zusammenarbeit',sub:'Chats, Kanäle, Meetings, Telefonie',ic:'teams',checked:'2026-10',lessons:[
 {title:'Teams-Grundlagen',ex:[
  {t:'mc',q:'Wofür nimmst du am besten einen Kanal statt eines Gruppenchats?',o:['Für ein Projekt mit dauerhaftem Austausch und gemeinsamen Dateien in SharePoint','Für eine kurze Abstimmung mit zwei Kolleginnen über den nächsten Termin','Für vertrauliche Nachrichten, die nur eine Person sehen soll','Für spontane Anrufe mit externen Kunden über das Festnetz'],a:0,x:'Kanäle bündeln Themen eines Teams dauerhaft, inklusive Dateiablage in SharePoint.'},
  {t:'tf',q:'Dateien, die du im 1:1-Chat teilst, landen im OneDrive des Absenders.',a:true,x:'Chat-Dateien liegen im OneDrive der Person, die sie teilt. Kanal-Dateien liegen in SharePoint.'},
  {t:'match',q:'Welche App passt zur Aufgabe?',p:[['Notizen live gemeinsam bearbeiten','Loop'],['Aufgaben im Team planen','Planner'],['Kurze Umfrage erstellen','Forms'],['Zahlen gemeinsam auswerten','Excel']],x:'Loop, Planner und Forms stecken in den meisten Plänen schon drin. Im Kundengespräch zeigen sie schnell, wie viel mehr Microsoft 365 ist als Mail und Office.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Private Kanäle sehen nur {0} Mitglieder. In freigegebene Kanäle kann man auch {1} einladen.',b:['ausgewählte','alle','Personen aus anderen Organisationen','nur Admins'],a:['ausgewählte','Personen aus anderen Organisationen'],x:'Freigegebene Kanäle funktionieren über Organisationsgrenzen hinweg, ohne Gastkonto im Team.'},
  {t:'mc',q:'Wie markierst du eine wichtige Chatnachricht, um sie später schnell wiederzufinden?',o:['Nachricht als ungelesen markieren','Nachricht in eine Mail an dich kopieren','Daumen hoch','Nachricht speichern'],a:3,x:'Gespeicherte Nachrichten findest du gesammelt wieder.'}
 ]},
 {title:'Chatten & Status',ex:[
  {t:'match',q:'Was bedeutet welcher Status?',p:[['Verfügbar','Erreichbar für alle'],['Beschäftigt','In Besprechung oder im Anruf'],['Nicht stören','Nur Prioritätskontakte kommen durch'],['Abwesend','Länger inaktiv oder selbst gesetzt']],x:'Der Status zeigt auf einen Blick, wer gerade erreichbar ist. Das spart Mails mit der Frage „Hast du kurz Zeit?“.'},
  {t:'tf',q:'Eine gesendete Chatnachricht lässt sich in Teams nicht mehr bearbeiten oder löschen.',a:false,x:'Bearbeiten und Löschen geht auch nach dem Senden. Die Nachricht wird dann als bearbeitet markiert.'},
  {t:'mc',q:'Wie stellst du sicher, dass eine Kollegin deine Kanalnachricht sieht?',o:['Die Nachricht fett formatieren und rot einfärben','Sie mit @Name erwähnen','Die Nachricht mit großem Betreff im Kanal posten','Fett schreiben'],a:1,x:'Mit @Name bekommt die Person eine Benachrichtigung. Ohne Erwähnung geht eine Kanalnachricht im Alltag leicht unter.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Mit einer {0} antwortest du schnell, ohne extra zu schreiben. Eine {1} hebt eine wichtige Nachricht im Kanal hervor.',b:['Reaktion','Ankündigung','Besprechung','Freigabe'],a:['Reaktion','Ankündigung'],x:'Reaktionen ersetzen viele kurze „Danke“-Nachrichten. Ankündigungen sorgen dafür, dass Wichtiges im Kanal sofort auffällt.'},
  {t:'mc',q:'Eine externe Partnerin soll dauerhaft im Projektteam mitarbeiten. Was richtest du ein?',o:['Sie als Gast ins Team einladen','Ihr dein Kennwort geben','Ihr alle Projektdateien regelmäßig per Mail schicken','Für sie einen eigenen Tenant beim Kunden anlegen'],a:0,x:'Gäste arbeiten mit ihrem eigenen Konto im Team mit. So bleiben Chats, Dateien und Termine an einem Ort statt in Mail-Ketten.'}
 ]},
 {title:'Meetings & Events',ex:[
  {t:'mc',q:'Ihr plant ein Online-Event mit Anmeldeseite und Interaktion für rund 300 Teilnehmende. Welches Format passt?',o:['Town Hall','Gruppenchat','Webinar','Kanalbesprechung'],a:2,x:'Webinare bringen Registrierung und Interaktion mit. Town Halls sind für große Übertragungen gedacht.'},
  {t:'tf',q:'Breakout-Räume kann man vorab anlegen und Teilnehmende schon vor dem Meeting zuweisen.',a:true,x:'Breakout-Räume lassen sich vorab planen. Bei Workshops mit Kunden spart das im Meeting wertvolle Minuten.'},
  {t:'order',q:'So läuft ein Webinar ab. Bring die Schritte in die richtige Reihenfolge.',o:['Anmeldeseite einrichten','Einladung verschicken','Webinar durchführen','Teilnahmebericht auswerten'],x:'Bei Webinaren entscheidet die Vorbereitung. Die Anmeldeseite liefert vorab Kontaktdaten, der Bericht danach die Grundlage fürs Nachfassen.'},
  {t:'mc',q:'Was ist Teams Premium?',o:['Ein kostenloses Update, das automatisch für alle Nutzer ausgerollt wird','Die Zusatzlizenz, mit der man aus Teams ins Festnetz telefoniert','Ein Add-on für Meetings und Webinare, z. B. mit intelligentem Recap und Wasserzeichen','Zertifizierte Hardware für Besprechungsräume und Konferenzsysteme'],a:2,x:'Teams Premium erweitert Meetings und Webinare. Für Telefonie braucht es Teams Phone.'},
  {t:'tf',q:'Wer den Wartebereich umgehen darf, kann nur die IT im Teams Admin Center festlegen.',a:false,x:'Das legt die Organisatorin selbst in den Besprechungsoptionen fest. Die IT gibt nur den Rahmen vor.'}
 ]},
 {title:'Teams Rooms & Geräte',ex:[
  {t:'mc',q:'Was ist Microsoft Teams Rooms?',o:['Private Kanäle für vertrauliche Projekte im Team','Raumsysteme für hybride Meetings mit Teams','Ein Speicherplan für Aufzeichnungen in OneDrive','Eine Webinar-Funktion'],a:1,x:'Teams Rooms holt Besprechungsräume in die hybride Welt: ein Klick auf der Konsole, und das Meeting startet.'},
  {t:'match',q:'Ordne zu.',p:[['Teams Rooms Basic','Kostenlos für bis zu 25 Räume'],['Teams Rooms Pro','Mehr Funktionen und Fernverwaltung'],['Teams-Display','Gerät für den Schreibtisch'],['Zertifiziertes Headset','Geprüfte Audioqualität']],x:'Teams Rooms Basic ist ein guter Einstieg. Wer viele Räume zentral verwalten will, braucht Teams Rooms Pro.'},
  {t:'tf',q:'Ein Besprechungsraum-System bekommt eine Raumlizenz statt einer Nutzerlizenz.',a:true,x:'Raumsysteme bekommen eine Raumlizenz wie Teams Rooms Pro, keine normale Nutzerlizenz. Das gehört in jedes Angebot für Räume.'},
  {t:'order',q:'So läuft ein hybrides Meeting im Raum. Bring die Schritte in die richtige Reihenfolge.',o:['Raum im Termin mitbuchen','Teams-Besprechung versenden','Im Raum über die Konsole beitreten','Inhalte teilen und mitschreiben'],x:'Ist der Raum im Termin mitgebucht, startet das Meeting mit einem Klick an der Konsole. Genau das überzeugt Kunden in der Demo.'},
  {t:'mc',q:'Was macht der Modus „Gemeinsam“ (Together Mode)?',o:['Zeigt die Bildschirme aller Teilnehmenden gleichzeitig an','Startet die Aufzeichnung','Verbindet zwei Organisationen in einem gemeinsamen Meeting','Setzt alle in einen gemeinsamen virtuellen Raum'],a:3,x:'Der Modus „Gemeinsam“ wirkt weniger anstrengend als viele Kacheln. Er eignet sich gut für Teamrunden und Workshops.'}
 ]},
 {title:'Teams Telefonie',ex:[
  {t:'match',q:'Ordne die Telefonie-Bausteine zu.',p:[['Calling Plan','Microsoft liefert Rufnummern und Amtsleitung'],['Operator Connect','Netzbetreiber wird im Teams Admin Center angebunden'],['Direct Routing','Anbindung über einen zertifizierten SBC'],['Teams Phone','Lizenz für Telefonanlagen-Funktionen']],x:'Diese vier Begriffe solltest du sicher erklären können. Die Frage „Wie kommen wir ans Telefonnetz?“ kommt in jedem Telefonie-Gespräch.'},
  {t:'mc',q:'Ein Kunde hat Microsoft 365 E3 und will mit Teams telefonieren. Welche Lizenz braucht er zusätzlich?',o:['Teams Premium','Teams Essentials','Keine, das ist enthalten','Teams Phone Standard'],a:3,x:'Teams Phone ist in E5 enthalten, bei E3 und Business-Plänen kommt es als Add-on dazu. Dazu kommt die Amtsanbindung.'},
  {t:'tf',q:'Für eine Zentrale mit Ansage und Menü („Drücken Sie 1 für …“) braucht Teams eine zusätzliche Telefonanlage.',a:false,x:'Das erledigt die automatische Telefonzentrale in Teams, ganz ohne eigene Hardware.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Eine {0} verteilt eingehende Anrufe gleichmäßig auf eine Gruppe von Agentinnen und Agenten.',b:['Anrufwarteschleife','Besprechung','Kanalnachricht','Rufumleitung'],a:['Anrufwarteschleife'],x:'Warteschleifen verteilen Anrufe an ein Team, etwa im Vertrieb oder Support. Oft kombiniert man sie mit einer Telefonzentrale davor.'},
  {t:'mc',q:'Ein Kunde will seine bestehenden Rufnummern in Teams weiter nutzen. Wie heißt der Vorgang?',o:['Rufumleitung auf Teams','Domainverifizierung','Rufnummernportierung','Lizenzzuweisung'],a:2,x:'Bei der Portierung behält der Kunde seine bekannten Rufnummern. Das ist für viele die wichtigste Bedingung beim Wechsel.'}
 ]},
 {title:'Telefonie planen',ex:[
  {t:'mc',q:'Wie bekommt eine automatische Telefonzentrale eine eigene Rufnummer?',o:['Über das Postfach der Geschäftsführung','Über eine Microsoft-365-Gruppe mit Postfach','Über ein Ressourcenkonto, dem eine Rufnummer zugewiesen ist','Über eine Weiterleitung vom Handy der Zentrale'],a:2,x:'Ressourcenkonten sind die „Nummernträger“ für Telefonzentralen und Warteschleifen. Die Nummer hängt am Konto, nicht an einer Person.'},
  {t:'tf',q:'Ressourcenkonten für Telefonzentrale und Warteschleife brauchen eine volle Teams-Phone-Lizenz.',a:false,x:'Dafür gibt es die kostenlose Teams Phone Resource Account-Lizenz.'},
  {t:'match',q:'Ordne zu.',p:[['Notruf','Standort muss hinterlegt sein'],['Gemeinschaftstelefon','Telefon in Flur oder Kantine'],['Shared Calling','Viele Nutzer teilen sich eine Hauptnummer'],['Voicemail','Nachrichten landen in Outlook']],x:'Notruf mit Standort ist Pflicht und gehört in jedes Telefonie-Projekt. Gemeinschaftstelefone und Shared Calling helfen bei Flächen ohne feste Arbeitsplätze.'},
  {t:'order',q:'Bring ein Telefonie-Projekt in die richtige Reihenfolge.',o:['Nummern und Endgeräte aufnehmen','Anbindung wählen, z. B. Operator Connect','Teams Phone lizenzieren und Nummern zuweisen','Nummern portieren und umschalten'],x:'Erst Bestand aufnehmen, dann Anbindung wählen. Wer zu früh über Lizenzen spricht, übersieht oft Sonderfälle wie Faxe oder Türsprechstellen.'},
  {t:'mc',q:'In welchem Plan ist Teams Phone bereits enthalten?',o:['Microsoft 365 E3','Business Standard','Microsoft 365 E5','Business Premium'],a:2,x:'In E5 ist Teams Phone schon enthalten. Bei E3 und den Business-Plänen kommt es als Add-on dazu.'}
 ]}
]},
{id:'exo',name:'Outlook & Exchange',sub:'Mail, Kalender, Postfächer, Mailschutz',ic:'mail',checked:'2026-10',lessons:[
 {title:'Outlook im Alltag',ex:[
  {t:'mc',q:'Ein Kollege soll in deinem Namen Termine annehmen. Was richtest du ein?',o:['Eine Weiterleitungsregel','Ein freigegebenes Postfach','Eine Regel','Eine Stellvertretung'],a:3,x:'Die Stellvertretung ist ideal für Assistenzen. Sie arbeiten im Namen der Person, ohne deren Kennwort zu kennen.'},
  {t:'tf',q:'Das neue Outlook für Windows ersetzt die alten Apps „Mail“ und „Kalender“ in Windows.',a:true,x:'Das neue Outlook ist die Zukunft auf Windows. Kunden profitieren davon, dass es sich überall gleich anfühlt, auch im Web.'},
  {t:'match',q:'Welche Funktion erledigt was?',p:[['Relevanter Posteingang','Wichtige Mails zuerst'],['Abwesenheitsnotiz','Automatische Antwort'],['Terminplanungs-Assistent','Freie Zeiten finden'],['Regeln','Mails automatisch sortieren']],x:'Diese Funktionen sind kleine Zeitsparer im Alltag. In Demos zeigen sie, wie viel schon im Standard steckt.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Ein {0} Postfach wie info@firma.de nutzt ein Team gemeinsam. Bis {1} braucht es keine eigene Lizenz.',b:['freigegebenes','persönliches','50 GB','5 GB'],a:['freigegebenes','50 GB'],x:'Freigegebene Postfächer bis 50 GB kosten keine eigene Lizenz. Bei Sammeladressen ist das ein schnelles Spar-Argument.'},
  {t:'tf',q:'Eine Teams-Besprechung lässt sich nur in Teams anlegen, nicht aus dem Outlook-Kalender.',a:false,x:'Ein Klick auf „Teams-Besprechung“ im Termin reicht. Der Link landet automatisch in der Einladung.'}
 ]},
 {title:'Kalender & Ordnung',ex:[
  {t:'mc',q:'Du willst eine Mail später noch bearbeiten. Was hilft?',o:['Mit Erinnerung kennzeichnen','Als Junk markieren','In „Gelöschte Elemente“ verschieben','An dich selbst weiterleiten und warten'],a:0,x:'Mit Kennzeichnung und Erinnerung wird der Posteingang zur Aufgabenliste. Gekennzeichnete Mails tauchen auch in To Do auf.'},
  {t:'match',q:'Ordne zu.',p:[['Kategorie','Farbe für Themen'],['Ordner','Ablage nach Struktur'],['Suchordner','Gespeicherte Suche'],['Archivieren','Aus dem Posteingang räumen, ohne zu löschen']],x:'Kategorien, Ordner und Suchordner lassen sich kombinieren. Archivieren räumt auf, ohne etwas zu löschen.'},
  {t:'tf',q:'Einen Kalender kann man nur ganz mit allen Details teilen oder gar nicht.',a:false,x:'Man kann abgestuft teilen, z. B. nur „Frei/Gebucht“, mit Titel und Ort oder mit allen Details.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Einen Raum findest du über die {0} im Termin. Räume und Ressourcen sind in Exchange eigene {1}.',b:['Raumsuche','Signatur','Postfächer','Kategorien'],a:['Raumsuche','Postfächer'],x:'Räume sind in Exchange eigene Postfächer und brauchen keine Nutzerlizenz. Über die Raumsuche findet man freie Räume schnell.'},
  {t:'mc',q:'Was passiert bei „Allen antworten“ auf eine Mail an einen Verteiler mit 500 Personen?',o:['Nur die Person, die die Mail geschickt hat','Alle 500 bekommen deine Antwort','Nur die Kolleginnen aus deiner Abteilung','Niemand'],a:1,x:'„Allen antworten“ an große Verteiler sorgt für Mail-Fluten. Gegen solche Massen-Antworten gibt es in Exchange Online einen eigenen Schutz.'}
 ]},
 {title:'Exchange Online verstehen',ex:[
  {t:'mc',q:'Wie groß ist das Postfach mit Microsoft 365 E3?',o:['50 GB','1 TB','100 GB','2 GB'],a:2,x:'E3 und E5 haben 100 GB. Seit 2026 bekommen auch die Business-Pläne bis zu 100 GB, ohne Aufpreis.'},
  {t:'tf',q:'Das Online-Archiv zählt zum normalen Postfach und bringt keinen zusätzlichen Speicher.',a:false,x:'Das Online-Archiv ist zusätzlicher Speicher für ältere Mails und bleibt durchsuchbar.'},
  {t:'mc',q:'Welcher Plan enthält nur Mail und Kalender, ohne Office-Apps?',o:['Microsoft 365 Business Basic','Microsoft 365 Business Standard','Exchange Online Plan 1','Office 365 E3'],a:2,x:'Exchange Online Plan 1 passt für reine Mail-Nutzer. Wer Teams und die Office-Apps braucht, ist mit einem Business-Plan besser bedient.'},
  {t:'order',q:'Ein Kunde betreibt noch einen eigenen Exchange Server. Bring dein Vorgehen in die richtige Reihenfolge.',o:['Auf das Support-Ende hinweisen','Postfächer und Anforderungen erfragen','Passenden Plan anbieten','Migration mit Technik oder Partner einplanen'],x:'Das Support-Ende ist der beste Gesprächseinstieg. Danach zählen Anforderungen und ein Plan, wie die Migration umgesetzt wird.'},
  {t:'mc',q:'Was bringt eine Microsoft-365-Gruppe gegenüber einer Verteilerliste mit?',o:['Zusätzlich ein gemeinsames Postfach, einen Kalender und eine Dateiablage','Nichts, Gruppe und Verteiler sind dasselbe','Mehr Postfachspeicher für jedes Mitglied','Eine eigene Telefonnummer für das ganze Team'],a:0,x:'Eine Microsoft-365-Gruppe ist mehr als ein Verteiler. Sie bringt Postfach, Kalender und Dateiablage für das Team gleich mit.'}
 ]},
 {title:'Exchange im Kundengespräch',ex:[
  {t:'mc',q:'Ein Kunde hat viele Sammeladressen wie info@ und rechnung@. Was kannst du ihm sagen?',o:['Jede Adresse braucht eine eigene Business-Premium-Lizenz','Sammeladressen gibt es nur mit Microsoft 365 E5','Freigegebene Postfächer bis 50 GB sind ohne Lizenz','Dafür braucht er einen eigenen Exchange Server'],a:2,x:'Mit diesem Hinweis sparst du dem Kunden oft mehrere Lizenzen. Das schafft Vertrauen für das eigentliche Angebot.'},
  {t:'tf',q:'Das Postfach ausgeschiedener Mitarbeitender kann man in ein freigegebenes Postfach umwandeln und die Lizenz freigeben.',a:true,x:'Mit dem Umwandeln bleibt das Postfach erhalten und die Lizenz wird frei. Das ist ein typischer Tipp für die Lizenzoptimierung.'},
  {t:'match',q:'Welcher Kundenwunsch, welche Lösung?',p:[['Gemeinsame Adresse fürs Team','Freigegebenes Postfach'],['Zweite Adresse für dieselbe Person','Alias'],['Alte Mails langfristig behalten','Online-Archiv'],['Mails an viele Empfänger verteilen','Verteiler oder Gruppe']],x:'Viele Kundenwünsche lassen sich mit Bordmitteln lösen. Wer das weiß, berät glaubwürdig statt nur zu verkaufen.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Wer nur Mail und Kalender braucht, kommt mit {0} aus. Wer zusätzlich die Desktop-Apps braucht, bekommt {1}.',b:['Exchange Online Plan 1','Business Standard','Teams Premium','Copilot'],a:['Exchange Online Plan 1','Business Standard'],x:'Nicht jeder braucht die Desktop-Apps. Mit einer passenden Planmischung wird das Angebot für den Kunden günstiger.'},
  {t:'mc',q:'Ein Kunde betreibt noch Exchange Server 2016 im eigenen Rechenzentrum. Was gilt?',o:['Der Support läuft noch bis 2035','Der Support endete im Oktober 2025, Umstieg planen','Er wird automatisch zu Exchange Online migriert','Microsoft liefert weiter kostenlose Sicherheitsupdates'],a:1,x:'Exchange Server 2016 und 2019 bekommen keine Sicherheitsupdates mehr. Das ist ein klarer Anlass für das Gespräch über Exchange Online.'}
 ]},
 {title:'Mailschutz & Compliance',ex:[
  {t:'match',q:'Ordne die Schutzfunktionen zu.',p:[['Sichere Links','Prüft Links beim Klick'],['Sichere Anlagen','Öffnet Anhänge vorab in einer Sandbox'],['Aufbewahrungsrichtlinie','Behält Daten für eine feste Zeit'],['eDiscovery','Findet Inhalte für rechtliche Prüfungen']],x:'Sichere Links und Sichere Anlagen gehören zu Defender for Office 365. Aufbewahrung und eDiscovery kommen aus Microsoft Purview.'},
  {t:'mc',q:'Welcher Plan enthält Defender for Office 365 Plan 1?',o:['Business Standard','Business Basic','Exchange Online Plan 1','Business Premium'],a:3,x:'Business Premium bringt Defender for Office 365 Plan 1 mit. Seit Juli 2026 ist Plan 1 auch in E3 enthalten.'},
  {t:'tf',q:'SPF, DKIM und DMARC helfen, den Missbrauch der eigenen Absenderdomain zu verhindern.',a:true,x:'Ohne SPF, DKIM und DMARC können Betrüger leicht im Namen des Kunden Mails verschicken. Das schadet dem Ruf und der Zustellbarkeit.'},
  {t:'mc',q:'Ein Kunde muss Mails zehn Jahre aufbewahren. Womit setzt du das um?',o:['Eine Outlook-Regel, die alle Mails in einen Ordner verschiebt','Dem Papierkorb in OneDrive mit langer Frist','Einem eigenen Archivordner in jedem Postfach','Aufbewahrungsrichtlinien in Microsoft Purview, zentral für alle Postfächer'],a:3,x:'Aufbewahrungsrichtlinien in Purview arbeiten zentral und automatisch. Outlook-Regeln oder manuelle Ablage sind dafür nicht geeignet.'},
  {t:'tf',q:'Löscht ein Nutzer Mails, sind sie trotz Beweissicherungsverfahren (Litigation Hold) endgültig weg.',a:false,x:'Genau das verhindert der Litigation Hold: Gelöschte Inhalte bleiben im Hintergrund erhalten.'}
 ]},
 {title:'Phishing-Abwehr',ex:[
  {t:'mc',q:'Was schützt vor Mails, die sich als Geschäftsführer ausgeben?',o:['Schutz vor Identitätswechsel in Defender','Ein größeres Postfach','Eine Abwesenheitsnotiz der Geschäftsführung','Eine Outlook-Kategorie „Chef“ für alle Mails'],a:0,x:'Gefälschte Chef-Mails (CEO-Fraud) verursachen hohe Schäden. Der Schutz vor Identitätswechsel ist hier ein starkes Verkaufsargument.'},
  {t:'match',q:'Welches Kundenproblem löst was?',p:[['Gefälschte Absender im Namen der Firma','SPF, DKIM und DMARC'],['Schädliche Links in Mails','Sichere Links'],['Verseuchte Anhänge','Sichere Anlagen'],['Mitarbeitende fallen auf Phishing rein','Angriffssimulationstraining']],x:'Ordne jedes Kundenproblem einer konkreten Funktion zu. So wird aus „mehr Sicherheit“ ein greifbarer Nutzen.'},
  {t:'tf',q:'Das Angriffssimulationstraining ist schon in Defender for Office 365 Plan 1 enthalten.',a:false,x:'Angriffssimulation gehört zu Plan 2, zum Beispiel über Microsoft 365 E5.'},
  {t:'order',q:'Ein Kunde hatte gerade einen Phishing-Vorfall. Bring dein Gespräch in die richtige Reihenfolge.',o:['Vorfall und Schaden verstehen','Aktuellen Mailschutz und Lizenzen prüfen','Defender for Office 365 und Schulungen vorschlagen','Pilot oder Angebot vereinbaren'],x:'Nach einem Vorfall ist der Kunde offen für Lösungen. Erst zuhören und verstehen, dann konkrete Schutzmaßnahmen vorschlagen.'},
  {t:'mc',q:'Welcher Plan enthält Defender for Office 365 Plan 2?',o:['Microsoft 365 E3','Business Premium','Microsoft 365 E5','Business Standard'],a:2,x:'Plan 2 steckt in E5 und bringt Angriffssimulation und erweiterte Untersuchung mit. Plan 1 ist in Business Premium enthalten.'}
 ]}
]},
{id:'spo',name:'SharePoint & OneDrive',sub:'Ablage, Teilen, Intranet, Governance',ic:'folder',checked:'2026-10',lessons:[
 {title:'Dateien richtig ablegen',ex:[
  {t:'match',q:'Was gehört wohin?',p:[['OneDrive','Persönliche Arbeitsdateien'],['SharePoint-Teamwebsite','Dateien eines Projekts'],['Kommunikationswebsite','Intranet und News'],['Registerkarte „Dateien“ im Kanal','Ansicht auf die SharePoint-Bibliothek']],x:'Die Faustregel lautet: Persönliches in OneDrive, Teamdateien in SharePoint oder Teams. Das hilft Kunden bei der Ordnung.'},
  {t:'tf',q:'Mehrere Personen können gleichzeitig in derselben Word-Datei in OneDrive arbeiten.',a:true,x:'Gemeinsames Bearbeiten in Echtzeit ersetzt das Hin- und Herschicken von Versionen. In jeder Demo ein Aha-Moment.'},
  {t:'mc',q:'Wie holst du eine ältere Fassung eines Dokuments zurück?',o:['Die Datei aus dem Mailanhang neu hochladen','Ein Ticket bei der IT für eine Rücksicherung','Gar nicht','Über den Versionsverlauf'],a:3,x:'Der Versionsverlauf rettet bei überschriebenen Dateien. Ein Ticket bei der IT ist dafür nicht nötig.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Mit der OneDrive-App erscheinen Cloud-Dateien im {0}. Dank {1} werden sie erst beim Öffnen geladen.',b:['Datei-Explorer','Browser','Dateien bei Bedarf','Papierkorb'],a:['Datei-Explorer','Dateien bei Bedarf'],x:'„Dateien bei Bedarf“ spart Speicher auf dem Laptop. Die Dateien sind trotzdem im Explorer sichtbar.'},
  {t:'tf',q:'In OneDrive gelöschte Dateien sind sofort endgültig weg.',a:false,x:'Gelöschte Dateien landen erst im Papierkorb und lassen sich dort eine Zeit lang wiederherstellen.'}
 ]},
 {title:'Gemeinsam an Dateien',ex:[
  {t:'mc',q:'Woran siehst du, wer gerade im Dokument mitarbeitet?',o:['Im Mailpostfach','Am Teams-Status „Beschäftigt“ der Kolleginnen','An den Profilbildern oben','In der Liste „Zuletzt verwendet“ in OneDrive'],a:2,x:'Die Profilbilder oben zeigen, wer gerade mitarbeitet. Das macht Zusammenarbeit sichtbar und vermeidet Doppelarbeit.'},
  {t:'match',q:'Ordne zu.',p:[['Kommentar','Anmerkung an einer Textstelle'],['@-Erwähnung im Kommentar','Person wird benachrichtigt'],['Änderungen nachverfolgen','Bearbeitungen sichtbar machen'],['Versionsverlauf','Frühere Stände ansehen']],x:'Kommentare mit @-Erwähnung ersetzen viele Rückfrage-Mails. Die erwähnte Person wird direkt benachrichtigt.'},
  {t:'tf',q:'Wer eine Datei als Anhang statt als Link verschickt, erzeugt eine Kopie, die nicht mit dem Original synchron bleibt.',a:true,x:'Links statt Anhänge sind eine einfache Botschaft mit großer Wirkung: eine Version, aktuelle Rechte, kein Datenchaos.'},
  {t:'gap',q:'Ergänze den Satz.',s:'In Teams findest du die Dateien eines Kanals unter {0}. Deine eigenen Dateien zeigt die App {1}.',b:['Dateien','Aktivität','OneDrive','Kalender'],a:['Dateien','OneDrive'],x:'Teams und OneDrive greifen auf dieselben Dateien zu. Es gibt keine doppelte Ablage.'},
  {t:'mc',q:'Wo legst du Vorlagen ab, die die ganze Abteilung nutzen soll?',o:['Im eigenen OneDrive, Link per Mail an alle','Auf einem USB-Stick, der im Büro herumgeht','In der Abteilungsbibliothek in SharePoint','Als Anhang in einer Mail an den ganzen Verteiler'],a:2,x:'Vorlagen in der Abteilungsbibliothek sind für alle aktuell. Wer sie lokal ablegt, arbeitet bald mit veralteten Ständen.'}
 ]},
 {title:'Teilen & Berechtigungen',ex:[
  {t:'mc',q:'Welcher Freigabelink ist für eine Datei an einen bestimmten Kollegen am sichersten?',o:['Jeder mit dem Link','Personen in deiner Organisation','Link für bestimmte Personen','Ein Anhang als Kopie'],a:2,x:'„Bestimmte Personen“ ist der sicherste Link. Wird er weitergeleitet, können andere ihn nicht öffnen.'},
  {t:'tf',q:'Externe können geteilte Dateien nur öffnen, wenn externe Freigabe im Tenant erlaubt ist.',a:true,x:'Die externe Freigabe steuert der Admin zentral. Bei Problemen mit Partnern ist das die erste Stelle zum Prüfen.'},
  {t:'order',q:'Bring den Aufbau einer Projektablage in die richtige Reihenfolge.',o:['Teamwebsite anlegen','Bibliothek mit Ordnern strukturieren','Besitzer, Mitglieder und Besucher festlegen','Bibliothek im Teams-Kanal anheften'],x:'Eine klare Struktur von Anfang an verhindert Wildwuchs. Die Bibliothek im Kanal macht sie für das Team sofort sichtbar.'},
  {t:'mc',q:'Wer darf auf einer SharePoint-Website standardmäßig Inhalte bearbeiten, aber keine Einstellungen ändern?',o:['Besitzer','Besucher','Gäste','Mitglieder'],a:3,x:'Mitglieder arbeiten mit, Besitzer verwalten, Besucher lesen nur. Diese drei Gruppen reichen für die meisten Projekte.'},
  {t:'mc',q:'Was bewirkt ein Ablaufdatum an einem Freigabelink?',o:['Die Datei wird nach Ablauf gelöscht','Die Datei wird ab dem Datum verschlüsselt','Die Datei wandert ins Archiv der Website','Der Link funktioniert danach nicht mehr'],a:3,x:'Ablaufdaten begrenzen das Risiko bei externen Freigaben. Admins können sie auch zentral vorgeben.'}
 ]},
 {title:'Intranet & Seiten',ex:[
  {t:'mc',q:'Welcher Websitetyp passt für ein Intranet mit News an alle Mitarbeitenden?',o:['Teamwebsite mit Kanal','Kommunikationswebsite','Persönliches OneDrive','Ein Planner-Plan für News'],a:1,x:'Kommunikationswebsites sind für viele Leser gemacht. Teamwebsites dienen der Zusammenarbeit kleinerer Gruppen.'},
  {t:'match',q:'Welches Webpart wofür?',p:[['News','Aktuelle Beiträge anzeigen'],['Hero','Große Kacheln für Top-Themen'],['Schnelle Links','Sprungpunkte zu wichtigen Seiten'],['Dokumentbibliothek','Dateien direkt auf der Seite']],x:'Mit Webparts baut man Intranetseiten ohne Programmieren. Das senkt die Hürde für Fachabteilungen.'},
  {t:'tf',q:'Um mehrere SharePoint-Websites zu einem Intranet zu verbinden, muss man sie zu einer Website zusammenlegen.',a:false,x:'Ein Hub verbindet bestehende Websites mit gemeinsamer Navigation und Suche, ohne sie umzubauen.'},
  {t:'order',q:'Bring das Veröffentlichen eines News-Beitrags in die richtige Reihenfolge.',o:['News-Beitrag anlegen','Text und Bilder einfügen','Vorschau prüfen','Veröffentlichen'],x:'Die Vorschau vor dem Veröffentlichen spart peinliche Korrekturen. News erscheinen danach auch in Teams und in der SharePoint-App.'},
  {t:'mc',q:'Was ist Viva Connections?',o:['Ein Telefonietarif für Außendienst-Teams','Das Intranet als App in Teams','Ein Backup-Dienst','Eine Excel-Funktion für verbundene Daten'],a:1,x:'Viva Connections bringt das Intranet dorthin, wo Mitarbeitende ohnehin arbeiten: in Teams.'}
 ]},
 {title:'Migration & Governance',ex:[
  {t:'mc',q:'Welches kostenlose Microsoft-Werkzeug hilft, Fileserver nach SharePoint und OneDrive zu migrieren?',o:['Azure Migrate für Server und VMs','Intune','Power Automate mit einem Flow pro Ordner','SharePoint Migration Tool'],a:3,x:'Das SharePoint Migration Tool und der Migration Manager sind kostenlos. Für große oder komplexe Migrationen gibt es spezialisierte Partner-Tools.'},
  {t:'match',q:'Ordne die Governance-Werkzeuge zu.',p:[['Vertraulichkeitsbezeichnung','Dokumente einstufen und verschlüsseln'],['DLP-Richtlinie','Weitergabe sensibler Daten verhindern'],['Aufbewahrungsbezeichnung','Löschfristen steuern'],['Zugriffsüberprüfung','Berechtigungen regelmäßig prüfen']],x:'Diese Werkzeuge kommen aus Microsoft Purview und Entra. Zusammen sorgen sie für Ordnung, bevor Copilot alles durchsucht.'},
  {t:'tf',q:'Vor einem Copilot-Rollout sollte man prüfen, ob Dateien zu breit freigegeben sind.',a:true,x:'Stichwort Oversharing: Copilot findet alles, worauf ein Nutzer Zugriff hat.'},
  {t:'gap',q:'Ergänze den Satz.',s:'SharePoint-Speicher teilt sich der ganze Tenant: 1 TB plus {0} pro Lizenz.',b:['10 GB','1 GB','100 GB','50 GB'],a:['10 GB'],x:'Der SharePoint-Speicher wächst mit jeder Lizenz. Reicht er nicht, lässt sich zusätzlicher Speicher dazukaufen.'},
  {t:'tf',q:'Mit Microsoft 365 Backup lassen sich SharePoint, OneDrive und Exchange auf einen früheren Stand zurücksetzen.',a:true,x:'Microsoft 365 Backup wird nach Nutzung abgerechnet. Für Kunden mit hohen Anforderungen an Wiederherstellung ist es ein interessantes Zusatzthema.'}
 ]},
 {title:'Daten im Griff',ex:[
  {t:'mc',q:'Was erkennt eine DLP-Richtlinie zum Beispiel automatisch?',o:['Tippfehler und falsche Formatierung','IBANs oder Kreditkartennummern','Doppelte Termine im Kalender','Dateien, die lange niemand geöffnet hat'],a:1,x:'DLP erkennt sensible Daten anhand von Mustern. Es kann warnen oder die Weitergabe direkt blockieren.'},
  {t:'match',q:'Ordne zu.',p:[['Inaktive Websites','Nicht mehr genutzte Bereiche finden'],['Websitebesitzer','Verantwortlich für den Zugriff'],['Externe Freigabe pro Website','Teilen nur, wo es nötig ist'],['Bezeichnung für Container','Regeln für ganze Teams und Websites']],x:'Governance heißt: klare Zuständigkeit, nur so viel Freigabe wie nötig und regelmäßiges Aufräumen.'},
  {t:'tf',q:'Lädt jemand ein Dokument mit Vertraulichkeitsbezeichnung herunter, ist die Verschlüsselung weg.',a:false,x:'Der Schutz reist mit der Datei. Auch heruntergeladen bleibt sie verschlüsselt.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Die {0}-Berichte in SharePoint Advanced Management zeigen zu breit geteilte Websites. Mit {1} nimmt man Websites gezielt aus der Copilot-Suche.',b:['Datenzugriffs-Governance','Speicher','eingeschränkter Inhaltsermittlung','dem Versionsverlauf'],a:['Datenzugriffs-Governance','eingeschränkter Inhaltsermittlung'],x:'Diese Funktionen stammen aus SharePoint Advanced Management. Das ist bei Microsoft 365 Copilot inzwischen mit dabei und ein gutes Argument vor dem Rollout.'},
  {t:'order',q:'Bring eine Fileserver-Migration in die richtige Reihenfolge.',o:['Fileserver analysieren und aufräumen','Zielstruktur in SharePoint planen','Probemigration durchführen','Hauptmigration und Umstellung kommunizieren'],x:'Aufräumen vor der Migration spart Speicher und Zeit. Eine Probemigration deckt Probleme auf, bevor es ernst wird.'}
 ]}
]},
{id:'copilot',name:'Copilot & KI',sub:'Prompts, Apps, Agents, Einführung',ic:'spark',checked:'2026-10',lessons:[
 {title:'Erste Schritte mit KI',ex:[
  {t:'mc',q:'Was ist ein Prompt?',o:['Die Anweisung an die KI','Ein Lizenztyp','Ein eigener Kanal in Teams für KI-Fragen','Eine Sicherheitsrichtlinie für KI-Nutzung'],a:0,x:'Je klarer der Prompt, desto besser das Ergebnis. Das ist die wichtigste Botschaft in jeder Copilot-Schulung.'},
  {t:'tf',q:'Copilot Chat mit Firmenkonto bietet Datenschutz für Unternehmensdaten und ist ohne Zusatzlizenz nutzbar.',a:true,x:'Copilot Chat mit Firmenkonto ist der einfache Einstieg. Für Zugriff auf Mails, Dateien und Chats braucht es Microsoft 365 Copilot.'},
  {t:'match',q:'Wobei hilft Copilot in welcher App?',p:[['Word','Entwurf aus Stichpunkten'],['Excel','Daten analysieren, Formeln vorschlagen'],['PowerPoint','Präsentation aus einem Dokument'],['Outlook','Lange Mailverläufe zusammenfassen']],x:'Zeig dem Kunden einen Anwendungsfall aus seinem Alltag. Das überzeugt mehr als jede Funktionsliste.'},
  {t:'order',q:'Ein guter Prompt hat vier Bausteine. Bring sie in eine sinnvolle Reihenfolge.',o:['Ziel: Was soll entstehen?','Kontext: Wofür und für wen?','Quelle: Welche Dateien oder Infos?','Erwartung: Format und Ton'],x:'Ziel, Kontext, Quelle, Erwartung: Mit diesen vier Bausteinen schreibt jeder bessere Prompts.'},
  {t:'tf',q:'Copilot kann Fehler machen. Ergebnisse prüfst du deshalb, bevor du sie weitergibst.',a:true,x:'Copilot liefert einen Entwurf, die Verantwortung bleibt beim Menschen. Diese ehrliche Botschaft schafft Vertrauen.'}
 ]},
 {title:'Besser prompten',ex:[
  {t:'mc',q:'Welcher Prompt bringt das beste Ergebnis?',o:['Kannst du mir bitte, wenn es gerade passt, mit dem Bericht helfen? Ich brauche irgendwas Schönes für die Geschäftsführung, gern auch etwas länger.','Fasse den Q3-Projektbericht für die Geschäftsführung in 5 Stichpunkten zusammen, Fokus auf Risiken.','Bericht','Bitte hilf mir.'],a:1,x:'Ein guter Prompt nennt Quelle, Zielgruppe, Format und Fokus. Vage Prompts liefern vage Ergebnisse.'},
  {t:'tf',q:'Gefällt dir das erste Ergebnis nicht, musst du den Prompt komplett neu schreiben.',a:false,x:'Prompten ist ein Dialog. Ein Folge-Prompt wie „kürzer und förmlicher“ verbessert das Ergebnis gezielt.'},
  {t:'match',q:'Ordne zu.',p:[['Zusammenfassen','Kernaussagen aus langen Texten'],['Entwerfen','Ersten Text erstellen'],['Umschreiben','Ton oder Länge ändern'],['Fragen','Infos aus Dateien finden']],x:'Diese vier Tätigkeiten decken die meisten Anwendungsfälle im Büroalltag ab. Damit lässt sich jede Demo strukturieren.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Mit {0} und dem Dateinamen gibst du Copilot eine Datei als Quelle. Gute Prompts speicherst du in der {1}.',b:['/','#','Prompt-Galerie','dem Papierkorb'],a:['/','Prompt-Galerie'],x:'Mit „/“ bindest du gezielt Dateien ein. In der Prompt-Galerie findet das ganze Team bewährte Prompts.'},
  {t:'mc',q:'Copilot nennt eine Zahl, die in keiner Quelle steht. Wie nennt man das?',o:['Phishing','Halluzination','Caching','Synchronisation'],a:1,x:'Halluzinationen gibt es bei jeder KI. Quellen prüfen und kritisch lesen gehört zur Copilot-Einführung dazu.'}
 ]},
 {title:'Copilot im Arbeitsalltag',ex:[
  {t:'mc',q:'Wie greift Microsoft 365 Copilot auf Mails, Chats und Dateien zu?',o:['Er liest alle Daten im Tenant, auch ohne Berechtigung','Über Microsoft Graph, nur mit den Rechten des Nutzers','Über eine lokale Kopie aller Dateien auf dem Laptop','Nur über Dateien, die man vorher hochgeladen hat'],a:1,x:'Copilot hält sich an die vorhandenen Berechtigungen. Deshalb sind saubere Freigaben vor dem Rollout so wichtig.'},
  {t:'tf',q:'Daten aus Microsoft 365 Copilot werden zum Training der Basismodelle genutzt.',a:false,x:'Prompts, Antworten und Daten aus Microsoft Graph fließen nicht ins Training der Basismodelle.'},
  {t:'gap',q:'Ergänze den Satz.',s:'In Teams fasst Copilot Meetings anhand des {0} zusammen und listet offene {1} auf.',b:['Transkripts','Kalenders','Aufgaben','Lizenzen'],a:['Transkripts','Aufgaben'],x:'Meeting-Zusammenfassungen mit offenen Aufgaben gehören zu den beliebtesten Copilot-Funktionen im Vertrieb.'},
  {t:'mc',q:'Was sind Agents in Microsoft 365 Copilot?',o:['Externe Dienstleister, die Copilot einrichten','Admin-Rollen, die Copilot im Tenant verwalten','Klassische Chatbots mit festen Antworten ohne KI','Spezialisierte KI-Assistenten, die bestimmte Aufgaben oder Prozesse übernehmen'],a:3,x:'Agents spezialisieren Copilot auf einen Zweck, zum Beispiel für HR-Fragen, Produktwissen oder Angebotsentwürfe.'},
  {t:'tf',q:'Copilot-Antworten enthalten Quellenverweise, mit denen du die Herkunft prüfen kannst.',a:true,x:'Quellenverweise machen Antworten nachprüfbar. Das ist wichtig für Akzeptanz und Qualität.'}
 ]},
 {title:'Copilot in den Apps',ex:[
  {t:'mc',q:'Was kann Copilot in Excel besonders gut?',o:['Das Postfach aufräumen und Regeln anlegen','Teams-Räume für Besprechungen buchen','Trends erkennen und Formeln vorschlagen','Lizenzen im Admin Center an Nutzer zuweisen'],a:2,x:'In Excel hilft Copilot besonders bei sauber formatierten Tabellen. Daten als Tabelle formatieren lohnt sich.'},
  {t:'match',q:'Ordne zu.',p:[['Copilot im Teams-Chat','Lange Chatverläufe zusammenfassen'],['Copilot in Outlook','Antwortentwurf im passenden Ton'],['Copilot in Word','Fragen zum Dokument beantworten'],['Copilot in PowerPoint','Folien aus einer Gliederung']],x:'Copilot arbeitet in jeder App etwas anders. Zeig dem Kunden die App, die er am meisten nutzt.'},
  {t:'tf',q:'Copilot kann Meetings auch ganz ohne Transkript oder Aufzeichnung im Nachhinein zusammenfassen.',a:false,x:'Für die Zusammenfassung nach dem Meeting braucht Copilot das Transkript.'},
  {t:'order',q:'Ein Angebot mit Copilot erstellen. Bring die Schritte in die richtige Reihenfolge.',o:['Kundenmails in Outlook zusammenfassen','Angebotsentwurf in Word mit den Mails als Quelle','Zahlen in Excel prüfen','Präsentation in PowerPoint aus dem Entwurf'],x:'Ein durchgehender Ablauf über mehrere Apps zeigt den echten Mehrwert. Er wirkt stärker als einzelne Funktionen.'},
  {t:'mc',q:'Wofür eignet sich der Agent „Researcher“?',o:['Telefonate mit Kunden automatisch führen','Geräte und Apps im Unternehmen verwalten','Mehrstufige Recherche über Web und Firmendaten mit fertigem Bericht','Kennwörter von Nutzern zurücksetzen'],a:2,x:'Researcher eignet sich für tiefe Recherchen, zum Beispiel zur Vorbereitung eines Kundentermins.'}
 ]},
 {title:'Copilot beraten & einführen',ex:[
  {t:'order',q:'Bring einen Copilot-Rollout in die richtige Reihenfolge.',o:['Freigaben und Datenzugriff prüfen','Pilotgruppe und Anwendungsfälle festlegen','Lizenzen zuweisen und schulen','Nutzung im Copilot-Dashboard messen'],x:'Datenzugriff zuerst, dann Pilot, dann Breite. So vermeidet man Überraschungen und schafft schnelle Erfolge.'},
  {t:'mc',q:'Ein Kunde fürchtet, Copilot zeigt Mitarbeitenden Gehaltsdaten. Was antwortest du?',o:['Copilot erkennt Gehälter und blendet sie automatisch für alle aus.','Copilot kann Excel-Dateien grundsätzlich nicht lesen, also kein Risiko.','Das lässt sich nicht steuern, deshalb Copilot besser gar nicht einführen.','Copilot sieht nur, was der Nutzer sehen darf. Also Rechte aufräumen.'],a:3,x:'Copilot gibt keine neuen Rechte. Er macht aber sichtbar, was ohnehin falsch freigegeben ist. Genau das sollte man vorher klären.'},
  {t:'match',q:'Welches Werkzeug wofür?',p:[['Copilot Studio','Eigene Agents bauen'],['Copilot-Dashboard','Nutzung und Wirkung messen'],['SharePoint Advanced Management','Oversharing aufspüren'],['Microsoft Purview','Daten einstufen und schützen']],x:'Mit diesen Werkzeugen beantwortest du die typischen Fragen: Wie bauen wir Agents, wie messen wir den Nutzen und wie schützen wir Daten?'},
  {t:'tf',q:'Microsoft 365 Copilot kann man einzelnen Nutzern zuweisen, eine Mindestmenge gibt es nicht.',a:true,x:'Die frühere Mindestabnahme von 300 Lizenzen ist seit 2024 weg. Für Firmen bis 300 Nutzer gibt es zudem das günstigere Microsoft 365 Copilot Business.'},
  {t:'mc',q:'Woran misst du den Erfolg einer Copilot-Einführung am besten?',o:['Nutzung und gesparte Zeit je Anwendungsfall','Anzahl der gekauften Copilot-Lizenzen im Tenant','Anzahl der Admins, die Copilot verwalten','Speicherverbrauch in OneDrive und SharePoint'],a:0,x:'Lizenzen allein sagen nichts über den Erfolg. Entscheidend sind Nutzung und gesparte Zeit in echten Anwendungsfällen.'}
 ]},
 {title:'Agents & Erweiterung',ex:[
  {t:'mc',q:'Womit baut eine Fachabteilung ohne Programmierkenntnisse einen eigenen Agent?',o:['Exchange Admin Center mit Transportregeln','Agent Builder bzw. Copilot Studio','Intune mit App-Schutzrichtlinien','PowerShell-Skripte im Admin Center'],a:1,x:'Der Agent Builder ist der schnelle Einstieg ohne Code. Copilot Studio eignet sich für anspruchsvollere Agents.'},
  {t:'tf',q:'Agents lassen sich auf festgelegte Wissensquellen beschränken, z. B. eine bestimmte SharePoint-Website.',a:true,x:'Feste Wissensquellen machen Agents verlässlich. Sie antworten nur aus freigegebenen Inhalten.'},
  {t:'match',q:'Woraus besteht ein Agent?',p:[['Wissensquelle','Woher er Antworten nimmt'],['Anweisungen','Wie er sich verhalten soll'],['Aktion oder Connector','Was er in anderen Systemen tun darf'],['Veröffentlichung','Wer ihn nutzen kann']],x:'Wissen, Anweisungen, Aktionen, Zielgruppe: Mit diesen vier Fragen lässt sich jeder Agent planen.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Daten aus Fremdsystemen wie einem CRM holt man über {0} in Copilot. Manche Agents werden nach {1} abgerechnet.',b:['Copilot-Connectors','Postfachregeln','Nutzung (Copilot Credits)','Raumlizenzen'],a:['Copilot-Connectors','Nutzung (Copilot Credits)'],x:'Mit Copilot-Connectors kommen Daten aus Fremdsystemen dazu. Die nutzungsbasierte Abrechnung sollte man im Angebot transparent machen.'},
  {t:'order',q:'Einen Agent einführen. Bring die Schritte in die richtige Reihenfolge.',o:['Prozess mit hohem Zeitaufwand finden','Agent mit Wissensquelle als Prototyp bauen','Mit Pilotnutzern testen','Freigeben und Wirkung messen'],x:'Klein starten, messen, dann ausrollen. So werden Agents zur Erfolgsgeschichte statt zum Experiment.'}
 ]}
]},
{id:'sec',name:'Sicherheit & Geräte',sub:'Identität, Geräte, Schutz, Reaktion',ic:'shield',checked:'2026-10',lessons:[
 {title:'Sicher arbeiten',ex:[
  {t:'mc',q:'Was bedeutet MFA?',o:['Mehrere Postfächer pro Person für Arbeit und Privates','Monatliche Freigabe des Kontos durch die IT-Abteilung','Anmeldung mit einem zweiten Faktor, z. B. der Authenticator-App auf dem Handy','Eine Firewall-Regel, die fremde Länder automatisch blockiert'],a:2,x:'MFA verhindert die meisten Angriffe auf Konten. Es ist die wichtigste einzelne Schutzmaßnahme.'},
  {t:'tf',q:'Eine dringende Zahlungsaufforderung vom „Chef“ an eine externe Adresse ist ein typisches Phishing-Muster.',a:true,x:'Zeitdruck, ungewöhnliche Empfänger und Geldforderungen sind Warnsignale. Im Zweifel immer über einen zweiten Kanal nachfragen.'},
  {t:'match',q:'Ordne die Begriffe zu.',p:[['Phishing','Gefälschte Mail, die Zugangsdaten abgreift'],['Authenticator','App für die zweite Bestätigung'],['Sicherheitsstandards','Kostenloser Basisschutz im Tenant'],['Passkey','Anmeldung ohne Kennwort']],x:'Diese Begriffe hören Kunden ständig. Wer sie einfach erklären kann, gewinnt Vertrauen.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Verdächtige Mails meldest du in Outlook über {0}. Klicke nie auf {1} in unerwarteten Mails.',b:['Melden','Antworten','Links','Kalender'],a:['Melden','Links'],x:'Gemeldete Mails helfen der IT, Angriffe früh zu erkennen und für alle zu stoppen.'},
  {t:'mc',q:'Du bekommst eine MFA-Anfrage aufs Handy, hast dich aber gar nicht angemeldet. Was tust du?',o:['Bestätigen, damit die Anfragen endlich aufhören','Ignorieren','Ablehnen und die IT informieren','Das Handy neu starten und die App neu installieren'],a:2,x:'Eine unerwartete MFA-Anfrage heißt oft: Jemand kennt das Kennwort. Ablehnen und sofort melden.'}
 ]},
 {title:'Gute Gewohnheiten',ex:[
  {t:'tf',q:'Für eine kurze Kaffeepause musst du den Bildschirm nicht sperren.',a:false,x:'Immer sperren, auch für zwei Minuten. Mit Windows-Taste + L dauert das eine Sekunde.'},
  {t:'match',q:'Ordne die Angriffe zu.',p:[['Password Spray','Häufige Kennwörter bei vielen Konten testen'],['MFA-Fatigue','Nutzer mit vielen Anfragen zermürben'],['Social Engineering','Menschen zur Preisgabe von Infos bringen'],['Ransomware','Daten verschlüsseln, Lösegeld fordern']],x:'Diese Angriffsarten kommen in fast jedem Security-Gespräch vor. Zu jeder gibt es eine passende Microsoft-Lösung.'},
  {t:'mc',q:'Woran erkennst du eine Phishing-Mail oft?',o:['Eine Signatur mit Telefonnummer und Adresse','Zeitdruck, fremde Absender und Links','Ein Firmenlogo im Kopf der Mail','Eine persönliche Anrede mit deinem Namen'],a:1,x:'Vor dem Klicken mit der Maus über den Link fahren und die Adresse prüfen. Das entlarvt viele Fälschungen.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Firmendaten speicherst du in {0} statt auf dem Desktop. Updates installierst du {1}.',b:['OneDrive oder SharePoint','USB-Sticks','zeitnah','einmal im Jahr'],a:['OneDrive oder SharePoint','zeitnah'],x:'Dateien in OneDrive sind gesichert und versioniert. Aktuelle Updates schließen Lücken, die Angreifer sonst nutzen.'},
  {t:'tf',q:'Dein Firmenkennwort darfst du auch für private Shops nutzen, solange MFA aktiv ist.',a:false,x:'Kennwörter niemals wiederverwenden. Ein Datenleck beim Shop wäre sonst ein Einfallstor.'}
 ]},
 {title:'Identität & Geräte',ex:[
  {t:'match',q:'Welcher Dienst macht was?',p:[['Entra ID','Identitäten und Anmeldungen'],['Intune','Geräte und Apps verwalten'],['Defender for Business','Endgeräte vor Angriffen schützen'],['Purview','Daten einstufen und schützen']],x:'Diese vier Dienste bilden das Sicherheitsfundament. In Business Premium sind sie in passender Ausprägung enthalten.'},
  {t:'mc',q:'Was regelt der bedingte Zugriff (Conditional Access)?',o:['Unter welchen Bedingungen eine Anmeldung erlaubt ist, z. B. nur von verwalteten Geräten','Wie viel Speicher ein Nutzer in OneDrive bekommt','Welche Lizenz einem neuen Nutzer zugewiesen wird','Wohin Mails bei Abwesenheit weitergeleitet werden'],a:0,x:'Bedingter Zugriff braucht mindestens Entra ID P1, das in Business Premium und E3 steckt.'},
  {t:'tf',q:'Mit Intune lassen sich Firmendaten auf einem verlorenen Laptop aus der Ferne löschen.',a:true,x:'Das Fernlöschen schützt Firmendaten bei Verlust oder Diebstahl. Für Kunden mit vielen mobilen Mitarbeitenden ein starkes Argument.'},
  {t:'order',q:'So läuft eine Bereitstellung mit Windows Autopilot. Bring die Schritte in die richtige Reihenfolge.',o:['Gerät wird für den Kunden registriert','Mitarbeitende melden sich mit dem Firmenkonto an','Intune spielt Richtlinien und Apps auf','Gerät ist einsatzbereit'],x:'Mit Autopilot geht das Gerät direkt vom Händler zum Mitarbeitenden. Die IT muss es nicht mehr selbst vorbereiten.'},
  {t:'tf',q:'Sicherheitsstandards müssen abgeschaltet werden, bevor man eigene Richtlinien für bedingten Zugriff nutzt.',a:true,x:'Sicherheitsstandards sind der kostenlose Einstieg. Mit bedingtem Zugriff steuert man genauer und braucht dafür Entra ID P1.'}
 ]},
 {title:'Geräte & Apps verwalten',ex:[
  {t:'mc',q:'Was ist der Unterschied zwischen MDM und MAM?',o:['Es gibt keinen Unterschied','MAM ist für Server, MDM für Laptops und Handys','MDM gibt es nur für Mac, MAM nur für Windows','MDM verwaltet das Gerät, MAM nur Firmen-Apps'],a:3,x:'MDM eignet sich für Firmengeräte, MAM für private Geräte. So bleiben Firmendaten geschützt und Privates bleibt privat.'},
  {t:'match',q:'Ordne die Intune-Bausteine zu.',p:[['Konformitätsrichtlinie','Wann ein Gerät als sicher gilt'],['Konfigurationsprofil','Einstellungen auf Geräte verteilen'],['App-Schutzrichtlinie','Firmendaten in Apps schützen'],['Update-Ringe','Updates gestaffelt verteilen']],x:'Konformität, Konfiguration, App-Schutz und Updates: Daraus besteht die Geräteverwaltung mit Intune.'},
  {t:'tf',q:'App-Schutzrichtlinien können verhindern, dass Firmendaten aus Outlook in private Apps kopiert werden.',a:true,x:'App-Schutzrichtlinien trennen Firmen- und Privatdaten auf demselben Handy. Für BYOD ist das die sauberste Lösung.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Bedingter Zugriff kann die Anmeldung nur von {0} Geräten erlauben. Den Gerätestatus liefert {1}.',b:['konformen','privaten','Intune','Planner'],a:['konformen','Intune'],x:'Intune meldet den Gerätestatus an Entra ID. So lässt bedingter Zugriff nur sichere Geräte herein.'},
  {t:'mc',q:'Mitarbeitende lesen Firmenmails auf dem privaten Handy. Was ist meist der beste Weg?',o:['App-Schutzrichtlinien ohne volle Geräteverwaltung','Das Handy komplett zurücksetzen','Mails auf dem Handy verbieten','Ein zweites Firmenkonto anlegen'],a:0,x:'Viele Mitarbeitende wollen keine volle Verwaltung auf dem Privathandy. App-Schutz ist hier der akzeptierte Mittelweg.'}
 ]},
 {title:'Zero Trust & Planwahl',ex:[
  {t:'mc',q:'Welche Lizenz bringt risikobasierten bedingten Zugriff (Identity Protection)?',o:['Entra ID P1','Entra ID P2','Entra ID Free','Business Standard'],a:1,x:'Entra ID P2 steckt z. B. in Microsoft 365 E5.'},
  {t:'match',q:'Ordne die Zero-Trust-Prinzipien zu.',p:[['Explizit überprüfen','Jede Anfrage anhand aller Signale prüfen'],['Minimale Rechte','Nur so viel Zugriff wie nötig'],['Von Kompromittierung ausgehen','Schaden begrenzen und segmentieren']],x:'Zero Trust heißt: nichts automatisch vertrauen, alles prüfen. Die drei Prinzipien gehören in jedes Security-Gespräch.'},
  {t:'tf',q:'Defender for Business gibt es nur als Teil von Business Premium, nicht einzeln.',a:false,x:'Defender for Business gibt es auch einzeln für bis zu 300 Nutzer. Meist ist Business Premium aber das bessere Paket.'},
  {t:'mc',q:'Ein Mittelständler mit 120 Nutzern will Office-Apps, Geräteverwaltung und Endpoint-Schutz aus einer Hand. Was empfiehlst du?',o:['Business Basic plus Defender for Business','Business Premium','Microsoft 365 E5','Business Standard'],a:1,x:'Business Premium ist für Mittelständler bis 300 Nutzer oft die beste Wahl. Es bündelt Produktivität und Sicherheit in einem Plan.'},
  {t:'mc',q:'Was macht Privileged Identity Management (PIM)?',o:['Speichert Kennwörter aller Nutzer in einem Tresor','Verwaltet Drucker','Admin-Rechte nur auf Zeit und bei Bedarf','Verschlüsselt Mails an externe Empfänger'],a:2,x:'Admin-Rechte nur auf Zeit verkleinern die Angriffsfläche deutlich. PIM ist Teil von Entra ID P2.'}
 ]},
 {title:'Erkennen & Reagieren',ex:[
  {t:'mc',q:'Was ist Microsoft Defender XDR?',o:['Ein Virenscanner, der ausschließlich Mail-Anhänge prüft','Ein Backup-Dienst für Postfächer und Dateien','Eine Firewall-Appliance für das Firmennetz','Ein Portal, das Signale zu Vorfällen bündelt'],a:3,x:'Defender XDR verbindet einzelne Warnungen zu einem Vorfall. Das spart der IT viel Zeit bei der Analyse.'},
  {t:'match',q:'Was schützt welcher Defender?',p:[['Defender for Endpoint','Endgeräte'],['Defender for Office 365','Mail und Zusammenarbeit'],['Defender for Identity','Lokales Active Directory'],['Defender for Cloud Apps','SaaS-Apps und Schatten-IT']],x:'Jeder Defender schützt einen Bereich. Zusammen bilden sie im Defender-Portal ein Gesamtbild.'},
  {t:'tf',q:'Microsoft Sentinel wertet ausschließlich Daten aus Microsoft-Diensten aus.',a:false,x:'Sentinel ist ein SIEM in Azure und wertet auch Daten aus Firewalls und anderen Fremdsystemen aus.'},
  {t:'order',q:'Ein Security-Gespräch mit einem Mittelständler. Bring die Schritte in die richtige Reihenfolge.',o:['Nach Vorfällen und Pflichten wie NIS2 fragen','Heutigen Schutz und Lizenzen aufnehmen','Lücken mit Business Premium oder E5 Security schließen','Einführung mit Partner oder Technik planen'],x:'Erst nach Risiken und Pflichten fragen, dann den Ist-Zustand aufnehmen. So wirkt dein Vorschlag maßgeschneidert.'},
  {t:'mc',q:'Ein Kunde fällt unter NIS2. Welches Argument für Microsoft 365 E5 Security passt?',o:['Es macht den Kunden automatisch NIS2-konform','Es ersetzt alle Meldepflichten gegenüber dem BSI','Es bündelt Schutz und Erkennung fürs Risikomanagement','Es ist für alle NIS2-Unternehmen gesetzlich vorgeschrieben'],a:2,x:'Keine Lizenz macht automatisch NIS2-konform. Sie unterstützt aber wichtige Pflichten wie Risikomanagement und Erkennung.'}
 ]}
]},
{id:'lic',name:'Lizenzen & Pläne',sub:'Business, Enterprise, CSP, Add-ons',ic:'key',checked:'2026-10',lessons:[
 {title:'Die Pläne kennen',ex:[
  {t:'match',q:'Was steckt in welchem Plan?',p:[['Business Basic','Web- und Mobil-Apps, Mail, 1 TB OneDrive'],['Business Standard','Zusätzlich die Desktop-Apps'],['Business Premium','Zusätzlich Intune und Defender'],['Microsoft 365 E3','Enterprise-Plan ohne Nutzergrenze']],x:'Basic, Standard, Premium bauen aufeinander auf. Die Leiter zu kennen, ist die Grundlage für jede Lizenzberatung.'},
  {t:'tf',q:'Business-Pläne kann man für beliebig viele Nutzer kaufen.',a:false,x:'Business-Pläne sind auf 300 Nutzer pro Plan begrenzt. Darüber sind Enterprise-Pläne gefragt.'},
  {t:'mc',q:'Welcher Plan ist für Mitarbeitende ohne festen Schreibtisch gedacht, z. B. in der Produktion?',o:['Microsoft 365 F1 oder F3','Microsoft 365 E5','Business Premium','Microsoft 365 Business Premium mit Copilot'],a:0,x:'F-Pläne sind günstig und auf Mitarbeitende ohne festen Schreibtisch zugeschnitten. Oft ein unterschätztes Potenzial beim Kunden.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Desktop-Apps wie Word und Excel gibt es ab Business {0}. Business {1} hat nur Web- und Mobil-Versionen.',b:['Standard','Basic','Premium','Essentials'],a:['Standard','Basic'],x:'Business Basic genügt für Nutzer, die nur im Browser arbeiten. Mit dem richtigen Mix wird das Angebot günstiger.'},
  {t:'mc',q:'Was unterscheidet Microsoft 365 E3 von Office 365 E3?',o:['Nichts, die Namen sind nur unterschiedlich vermarktet','Zusätzlich Windows Enterprise, Intune und mehr Sicherheit','Office 365 E3 enthält zusätzlich Teams Phone, Copilot und Power BI','Microsoft 365 E3 enthält keine Office-Desktop-Apps'],a:1,x:'Microsoft 365 E3 bündelt Office 365 E3 mit Windows Enterprise und Enterprise Mobility + Security.'}
 ]},
 {title:'Add-ons & Varianten',ex:[
  {t:'match',q:'Ordne die Produkte zu.',p:[['Teams Essentials','Teams als Einzelprodukt für kleine Firmen'],['Microsoft 365 Apps for business','Nur Office-Apps mit OneDrive'],['Exchange Online Plan 1','Nur Mail'],['Microsoft 365 Copilot','KI-Add-on']],x:'Einzelprodukte passen für Sonderfälle. Meist ist ein Komplettplan für den Kunden einfacher und günstiger.'},
  {t:'tf',q:'Pro Nutzer dürfen die Office-Apps auf bis zu 5 PCs oder Macs, 5 Tablets und 5 Smartphones laufen.',a:true,x:'Die Office-Apps auf mehreren Geräten pro Person sind ein klarer Vorteil gegenüber gerätebezogenen Kauflizenzen.'},
  {t:'mc',q:'Ein Kunde mit 40 Nutzern will Mail, Teams und Desktop-Apps, aber keine Geräteverwaltung. Was passt?',o:['Business Basic','Business Standard','Microsoft 365 E5','Microsoft 365 F3 mit Teams'],a:1,x:'Business Standard ist der Klassiker für kleine Teams. Wächst der Sicherheitsbedarf, folgt der Schritt zu Premium.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Lizenzen werden pro {0} vergeben, nicht pro Gerät. Zugewiesen werden sie im {1}.',b:['Nutzer','Rechner','Microsoft 365 Admin Center','Outlook'],a:['Nutzer','Microsoft 365 Admin Center'],x:'Lizenzen hängen an Personen, nicht an Geräten. Die Zuweisung im Admin Center dauert nur wenige Klicks.'},
  {t:'tf',q:'Business- und Enterprise-Pläne lassen sich nicht im selben Tenant mischen.',a:false,x:'Mischen ist erlaubt, z. B. Business Premium für die meisten und E5 für einzelne Rollen.'}
 ]},
 {title:'CSP & NCE',ex:[
  {t:'mc',q:'Was kostet die Monatslaufzeit im NCE im Vergleich zur Jahreslaufzeit?',o:['Gleich viel','Rund 20 % mehr','Rund 50 % weniger','Rund 10 % weniger'],a:1,x:'Monatslaufzeiten sind flexibel, kosten aber einen Aufschlag. Für den stabilen Grundbestand lohnt sich meist das Jahresabo.'},
  {t:'tf',q:'Lizenzen mit Jahreslaufzeit kann man jederzeit erhöhen, aber nach 7 Tagen nicht mehr reduzieren.',a:true,x:'Das Storno-Fenster im NCE beträgt 168 Stunden nach Kauf oder Verlängerung.'},
  {t:'order',q:'Bring das Onboarding eines CSP-Kunden in die richtige Reihenfolge.',o:['Kundentenant anlegen oder verknüpfen','Partnerbeziehung mit GDAP bestätigen','Abo mit Laufzeit kaufen','Lizenzen im Admin Center zuweisen'],x:'GDAP gibt dem Partner nur die Rechte, die er wirklich braucht. Das ist sicherer als frühere pauschale Admin-Zugänge.'},
  {t:'mc',q:'Wofür steht GDAP?',o:['Ein Rabattprogramm für Partner mit vielen Kunden','Granulare, zeitlich begrenzte Admin-Rechte für Partner im Kundentenant','Eine Copilot-Funktion für Partner-Dashboards','Ein Abrechnungsmodell für Jahresabos mit Monatszahlung'],a:1,x:'GDAP ist seit einigen Jahren Standard im CSP. Kunden schätzen, dass Partnerzugriffe zeitlich und inhaltlich begrenzt sind.'},
  {t:'tf',q:'Ein Jahresabo mit monatlicher Abrechnung ist im NCE möglich.',a:true,x:'Jahresabo mit Monatszahlung kombiniert den günstigeren Preis mit verteilter Belastung. Das ist für viele Kunden attraktiv.'}
 ]},
 {title:'Verträge & Laufzeiten',ex:[
  {t:'mc',q:'Welche Laufzeiten gibt es im NCE?',o:['Nur ein Jahr','Monat und Jahr, teils auch drei Jahre','Nur fünf Jahre mit jährlicher Zahlung','Tag, Woche und Monat nach tatsächlicher Nutzung'],a:1,x:'Längere Laufzeiten bringen Preissicherheit. Kürzere bringen Flexibilität. Die Wahl hängt vom Kunden ab.'},
  {t:'match',q:'Ordne zu.',p:[['Upgrade','Wechsel auf höheren Plan jederzeit'],['Storno-Fenster','168 Stunden nach Kauf'],['Verlängerung','Automatisch, wenn nicht abgeschaltet'],['Zusatzlizenzen','Anteilig bis zum Laufzeitende']],x:'Diese Regeln solltest du sicher erklären können. Sie bestimmen, wie flexibel ein Kunde im Vertrag ist.'},
  {t:'tf',q:'Beim Upgrade von Business Standard auf Business Premium müssen Postfächer und Dateien neu migriert werden.',a:false,x:'Beim Upgrade bleiben Daten und Einstellungen erhalten. Für Nutzer ist es kaum spürbar.'},
  {t:'order',q:'Eine Verlängerung vorbereiten. Bring die Schritte in die richtige Reihenfolge.',o:['Nutzung der Lizenzen prüfen','Menge und Plan mit dem Kunden abstimmen','Verlängerung im Partner Center anpassen','Neue Laufzeit dokumentieren'],x:'Die Verlängerung ist der ideale Zeitpunkt für Optimierung und Upsell. Wer früh spricht, hat Zeit für Alternativen.'},
  {t:'mc',q:'Was ist der Vorteil von CSP gegenüber dem Direktkauf bei Microsoft?',o:['Lizenzen sind im CSP grundsätzlich kostenlos','Es gibt keine Laufzeiten und keine Kündigungsfristen','Ein Partner berät, betreut und rechnet flexibel ab, alles aus einer Hand','Kunden bekommen doppelten Speicher in OneDrive'],a:2,x:'Im CSP bekommt der Kunde Beratung, Support und Abrechnung aus einer Hand. Das ist dein Mehrwert gegenüber dem Direktkauf.'}
 ]},
 {title:'Upsell & Beratung',ex:[
  {t:'tf',q:'Im EWR bietet Microsoft seine Suiten seit 2023 auch ohne Teams an. Teams wird dann separat lizenziert.',a:true,x:'Im EWR gibt es die Suiten auch ohne Teams. Achte im Angebot darauf, dass Teams dann separat dabei ist, sonst fehlt es.'},
  {t:'mc',q:'Kunde hat Business Standard und braucht Geräteverwaltung und bedingten Zugriff. Was ist der naheliegende Schritt?',o:['Wechsel auf E5','Teams Premium dazubuchen','Upgrade auf Business Premium','Exchange Online Plan 2 für alle Nutzer kaufen'],a:2,x:'Der Schritt von Standard zu Premium ist der häufigste Upsell im Mittelstand. Geräteverwaltung und Sicherheit sind hier die Argumente.'},
  {t:'match',q:'Welcher Bedarf, welche Lösung?',p:[['Telefonie in Teams','Teams Phone'],['KI-Assistent in den Office-Apps','Microsoft 365 Copilot'],['Webinare mit Wasserzeichen und Recap','Teams Premium'],['Mehr als 300 Nutzer','Microsoft 365 E3 oder E5']],x:'Bedarf zuerst, Produkt danach. So wirkt die Empfehlung logisch statt nach Verkaufsliste.'},
  {t:'order',q:'Bring ein Beratungsgespräch in die richtige Reihenfolge.',o:['Bedarf und aktuelle Lizenzen erfassen','Plan und Add-ons auswählen','Nutzen am Anwendungsfall zeigen','Pilot oder Angebot abschließen'],x:'Wer erst zuhört, kann gezielt empfehlen. Der Nutzen am konkreten Fall überzeugt mehr als jede Feature-Liste.'},
  {t:'mc',q:'Ein Kunde mit 350 Nutzern will die Funktionen von Business Premium. Was geht?',o:['E3 plus Add-ons, Business endet bei 300','Einfach 350 Lizenzen Business Premium kaufen','Zwei Tenants mit je 175 Nutzern aufbauen','Gar nicht'],a:0,x:'Über 300 Nutzer geht es nur mit Enterprise-Plänen. E3 mit passenden Security-Add-ons deckt den Bedarf meist gut ab.'}
 ]},
 {title:'Deals strukturieren',ex:[
  {t:'mc',q:'Ein Kunde hat E3 und will besseren Schutz, aber nicht alles aus E5. Welche Option gibt es?',o:['Zusätzlich Business Premium für alle kaufen','Teams Premium für alle Nutzer dazubuchen','Keine, es geht nur E5 komplett','Ein Add-on wie Microsoft 365 E5 Security'],a:3,x:'E5 Security bringt die Sicherheitsbausteine aus E5 auf E3. Für viele Kunden ist das der wirtschaftliche Mittelweg.'},
  {t:'match',q:'Welche Antwort auf welchen Einwand?',p:[['„Zu teuer“','Kosten abgelöster Einzeltools gegenrechnen'],['„Brauchen wir nicht“','Konkreten Anwendungsfall zeigen'],['„Datenschutz?“','EU-Datengrenze und Zusagen erläutern'],['„Keine Zeit“','Pilot mit kleiner Gruppe vorschlagen']],x:'Einwände sind Kaufsignale. Mit einer passenden Antwort wird aus Skepsis ein nächster Schritt.'},
  {t:'tf',q:'Mit der EU-Datengrenze speichert und verarbeitet Microsoft Kundendaten für Microsoft 365 weitgehend in der EU.',a:true,x:'Die EU-Datengrenze ist ein starkes Argument bei Datenschutzbedenken, besonders im öffentlichen Umfeld und im Mittelstand.'},
  {t:'gap',q:'Ergänze den Satz.',s:'Copilot lässt sich nur mit passender {0} zuweisen. Für Teams-Telefonie braucht es neben Teams Phone eine {1}.',b:['Basislizenz','Rufnummer bzw. Amtsanbindung','Domain','Raumlizenz'],a:['Basislizenz','Rufnummer bzw. Amtsanbindung'],x:'Add-ons brauchen immer eine passende Basis. Fehlt sie, scheitert die Bereitstellung, und das Angebot muss nachgebessert werden.'},
  {t:'order',q:'Ein Paket schnüren. Bring die Schritte in die richtige Reihenfolge.',o:['Basislizenz festlegen','Sicherheits- und Telefonie-Add-ons ergänzen','Copilot für eine Pilotgruppe einplanen','Laufzeit und Abrechnung wählen'],x:'Von der Basis zu den Add-ons arbeiten. So entsteht ein schlüssiges Paket ohne Lücken oder Doppelungen.'}
 ]}
]}
];
/* Hinweise von Tilly zu jeder Aufgabe. Gilt nur, wenn die Aufgabe noch keinen eigenen Hinweis (x) hat. */
const TIPS={
'teams:0:2':'Loop, Planner und Forms stecken in den meisten Plänen schon drin. Im Kundengespräch zeigen sie schnell, wie viel mehr Microsoft 365 ist als Mail und Office.',
'teams:1:0':'Der Status zeigt auf einen Blick, wer gerade erreichbar ist. Das spart Mails mit der Frage „Hast du kurz Zeit?“.',
'teams:1:1':'Bearbeiten und Löschen geht auch nach dem Senden. Die Nachricht wird dann als bearbeitet markiert.',
'teams:1:2':'Mit @Name bekommt die Person eine Benachrichtigung. Ohne Erwähnung geht eine Kanalnachricht im Alltag leicht unter.',
'teams:1:3':'Reaktionen ersetzen viele kurze „Danke“-Nachrichten. Ankündigungen sorgen dafür, dass Wichtiges im Kanal sofort auffällt.',
'teams:1:4':'Gäste arbeiten mit ihrem eigenen Konto im Team mit. So bleiben Chats, Dateien und Termine an einem Ort statt in Mail-Ketten.',
'teams:2:1':'Breakout-Räume lassen sich vorab planen. Bei Workshops mit Kunden spart das im Meeting wertvolle Minuten.',
'teams:2:2':'Bei Webinaren entscheidet die Vorbereitung. Die Anmeldeseite liefert vorab Kontaktdaten, der Bericht danach die Grundlage fürs Nachfassen.',
'teams:2:4':'Mit dem Wartebereich behält die Organisatorin die Kontrolle, wer wann hereinkommt. Das ist besonders bei externen Gästen wichtig.',
'teams:3:0':'Teams Rooms holt Besprechungsräume in die hybride Welt: ein Klick auf der Konsole, und das Meeting startet.',
'teams:3:1':'Teams Rooms Basic ist ein guter Einstieg. Wer viele Räume zentral verwalten will, braucht Teams Rooms Pro.',
'teams:3:2':'Raumsysteme bekommen eine Raumlizenz wie Teams Rooms Pro, keine normale Nutzerlizenz. Das gehört in jedes Angebot für Räume.',
'teams:3:3':'Ist der Raum im Termin mitgebucht, startet das Meeting mit einem Klick an der Konsole. Genau das überzeugt Kunden in der Demo.',
'teams:3:4':'Der Modus „Gemeinsam“ wirkt weniger anstrengend als viele Kacheln. Er eignet sich gut für Teamrunden und Workshops.',
'teams:4:0':'Diese vier Begriffe solltest du sicher erklären können. Die Frage „Wie kommen wir ans Telefonnetz?“ kommt in jedem Telefonie-Gespräch.',
'teams:4:2':'Die automatische Telefonzentrale ersetzt die klassische Zentrale mit Ansage und Menü, ganz ohne eigene Hardware.',
'teams:4:3':'Warteschleifen verteilen Anrufe an ein Team, etwa im Vertrieb oder Support. Oft kombiniert man sie mit einer Telefonzentrale davor.',
'teams:4:4':'Bei der Portierung behält der Kunde seine bekannten Rufnummern. Das ist für viele die wichtigste Bedingung beim Wechsel.',
'teams:5:0':'Ressourcenkonten sind die „Nummernträger“ für Telefonzentralen und Warteschleifen. Die Nummer hängt am Konto, nicht an einer Person.',
'teams:5:1':'Die Resource-Account-Lizenz ist kostenlos. Das ist ein gutes Argument, wenn Kunden Zusatzkosten für die Zentrale befürchten.',
'teams:5:2':'Notruf mit Standort ist Pflicht und gehört in jedes Telefonie-Projekt. Gemeinschaftstelefone und Shared Calling helfen bei Flächen ohne feste Arbeitsplätze.',
'teams:5:3':'Erst Bestand aufnehmen, dann Anbindung wählen. Wer zu früh über Lizenzen spricht, übersieht oft Sonderfälle wie Faxe oder Türsprechstellen.',
'teams:5:4':'In E5 ist Teams Phone schon enthalten. Bei E3 und den Business-Plänen kommt es als Add-on dazu.',
'exo:0:0':'Die Stellvertretung ist ideal für Assistenzen. Sie arbeiten im Namen der Person, ohne deren Kennwort zu kennen.',
'exo:0:1':'Das neue Outlook ist die Zukunft auf Windows. Kunden profitieren davon, dass es sich überall gleich anfühlt, auch im Web.',
'exo:0:2':'Diese Funktionen sind kleine Zeitsparer im Alltag. In Demos zeigen sie, wie viel schon im Standard steckt.',
'exo:0:3':'Freigegebene Postfächer bis 50 GB kosten keine eigene Lizenz. Bei Sammeladressen ist das ein schnelles Spar-Argument.',
'exo:0:4':'Ein Klick auf „Teams-Besprechung“ im Termin reicht. Der Link landet automatisch in der Einladung.',
'exo:1:0':'Mit Kennzeichnung und Erinnerung wird der Posteingang zur Aufgabenliste. Gekennzeichnete Mails tauchen auch in To Do auf.',
'exo:1:1':'Kategorien, Ordner und Suchordner lassen sich kombinieren. Archivieren räumt auf, ohne etwas zu löschen.',
'exo:1:2':'Mit abgestuften Kalenderrechten sehen Kolleginnen nur, was sie sehen sollen. Das ist ein wichtiges Thema beim Datenschutz.',
'exo:1:3':'Räume sind in Exchange eigene Postfächer und brauchen keine Nutzerlizenz. Über die Raumsuche findet man freie Räume schnell.',
'exo:1:4':'„Allen antworten“ an große Verteiler sorgt für Mail-Fluten. Gegen solche Massen-Antworten gibt es in Exchange Online einen eigenen Schutz.',
'exo:2:1':'Das Online-Archiv ist ein gutes Argument für Kunden mit vollen Postfächern. Alte Mails bleiben durchsuchbar.',
'exo:2:2':'Exchange Online Plan 1 passt für reine Mail-Nutzer. Wer Teams und die Office-Apps braucht, ist mit einem Business-Plan besser bedient.',
'exo:2:3':'Das Support-Ende ist der beste Gesprächseinstieg. Danach zählen Anforderungen und ein Plan, wie die Migration umgesetzt wird.',
'exo:2:4':'Eine Microsoft-365-Gruppe ist mehr als ein Verteiler. Sie bringt Postfach, Kalender und Dateiablage für das Team gleich mit.',
'exo:3:0':'Mit diesem Hinweis sparst du dem Kunden oft mehrere Lizenzen. Das schafft Vertrauen für das eigentliche Angebot.',
'exo:3:1':'Mit dem Umwandeln bleibt das Postfach erhalten und die Lizenz wird frei. Das ist ein typischer Tipp für die Lizenzoptimierung.',
'exo:3:2':'Viele Kundenwünsche lassen sich mit Bordmitteln lösen. Wer das weiß, berät glaubwürdig statt nur zu verkaufen.',
'exo:3:3':'Nicht jeder braucht die Desktop-Apps. Mit einer passenden Planmischung wird das Angebot für den Kunden günstiger.',
'exo:3:4':'Exchange Server 2016 und 2019 bekommen keine Sicherheitsupdates mehr. Das ist ein klarer Anlass für das Gespräch über Exchange Online.',
'exo:4:0':'Sichere Links und Sichere Anlagen gehören zu Defender for Office 365. Aufbewahrung und eDiscovery kommen aus Microsoft Purview.',
'exo:4:1':'Business Premium bringt Defender for Office 365 Plan 1 mit. Für viele Mittelständler deckt das den Mailschutz gut ab.',
'exo:4:2':'Ohne SPF, DKIM und DMARC können Betrüger leicht im Namen des Kunden Mails verschicken. Das schadet dem Ruf und der Zustellbarkeit.',
'exo:4:3':'Aufbewahrungsrichtlinien in Purview arbeiten zentral und automatisch. Outlook-Regeln oder manuelle Ablage sind dafür nicht geeignet.',
'exo:4:4':'Das Beweissicherungsverfahren ist wichtig bei rechtlichen Auseinandersetzungen. Dann darf nichts verloren gehen.',
'exo:5:0':'Gefälschte Chef-Mails (CEO-Fraud) verursachen hohe Schäden. Der Schutz vor Identitätswechsel ist hier ein starkes Verkaufsargument.',
'exo:5:1':'Ordne jedes Kundenproblem einer konkreten Funktion zu. So wird aus „mehr Sicherheit“ ein greifbarer Nutzen.',
'exo:5:2':'Simulierte Phishing-Mails trainieren Mitarbeitende im echten Umfeld. Das Training ist in Plan 2 enthalten, zum Beispiel über E5.',
'exo:5:3':'Nach einem Vorfall ist der Kunde offen für Lösungen. Erst zuhören und verstehen, dann konkrete Schutzmaßnahmen vorschlagen.',
'exo:5:4':'Plan 2 steckt in E5 und bringt Angriffssimulation und erweiterte Untersuchung mit. Plan 1 ist in Business Premium enthalten.',
'spo:0:0':'Die Faustregel lautet: Persönliches in OneDrive, Teamdateien in SharePoint oder Teams. Das hilft Kunden bei der Ordnung.',
'spo:0:1':'Gemeinsames Bearbeiten in Echtzeit ersetzt das Hin- und Herschicken von Versionen. In jeder Demo ein Aha-Moment.',
'spo:0:2':'Der Versionsverlauf rettet bei überschriebenen Dateien. Ein Ticket bei der IT ist dafür nicht nötig.',
'spo:0:3':'„Dateien bei Bedarf“ spart Speicher auf dem Laptop. Die Dateien sind trotzdem im Explorer sichtbar.',
'spo:0:4':'Gelöschte Dateien landen erst im Papierkorb. Sie lassen sich dort eine Zeit lang selbst wiederherstellen.',
'spo:1:0':'Die Profilbilder oben zeigen, wer gerade mitarbeitet. Das macht Zusammenarbeit sichtbar und vermeidet Doppelarbeit.',
'spo:1:1':'Kommentare mit @-Erwähnung ersetzen viele Rückfrage-Mails. Die erwähnte Person wird direkt benachrichtigt.',
'spo:1:2':'Links statt Anhänge sind eine einfache Botschaft mit großer Wirkung: eine Version, aktuelle Rechte, kein Datenchaos.',
'spo:1:3':'Teams und OneDrive greifen auf dieselben Dateien zu. Es gibt keine doppelte Ablage.',
'spo:1:4':'Vorlagen in der Abteilungsbibliothek sind für alle aktuell. Wer sie lokal ablegt, arbeitet bald mit veralteten Ständen.',
'spo:2:0':'„Bestimmte Personen“ ist der sicherste Link. Wird er weitergeleitet, können andere ihn nicht öffnen.',
'spo:2:1':'Die externe Freigabe steuert der Admin zentral. Bei Problemen mit Partnern ist das die erste Stelle zum Prüfen.',
'spo:2:2':'Eine klare Struktur von Anfang an verhindert Wildwuchs. Die Bibliothek im Kanal macht sie für das Team sofort sichtbar.',
'spo:2:3':'Mitglieder arbeiten mit, Besitzer verwalten, Besucher lesen nur. Diese drei Gruppen reichen für die meisten Projekte.',
'spo:2:4':'Ablaufdaten begrenzen das Risiko bei externen Freigaben. Admins können sie auch zentral vorgeben.',
'spo:3:0':'Kommunikationswebsites sind für viele Leser gemacht. Teamwebsites dienen der Zusammenarbeit kleinerer Gruppen.',
'spo:3:1':'Mit Webparts baut man Intranetseiten ohne Programmieren. Das senkt die Hürde für Fachabteilungen.',
'spo:3:2':'Hubs verbinden einzelne Websites zu einem Intranet mit gemeinsamer Navigation, ohne dass sie umgebaut werden müssen.',
'spo:3:3':'Die Vorschau vor dem Veröffentlichen spart peinliche Korrekturen. News erscheinen danach auch in Teams und in der SharePoint-App.',
'spo:3:4':'Viva Connections bringt das Intranet dorthin, wo Mitarbeitende ohnehin arbeiten: in Teams.',
'spo:4:0':'Das SharePoint Migration Tool und der Migration Manager sind kostenlos. Für große oder komplexe Migrationen gibt es spezialisierte Partner-Tools.',
'spo:4:1':'Diese Werkzeuge kommen aus Microsoft Purview und Entra. Zusammen sorgen sie für Ordnung, bevor Copilot alles durchsucht.',
'spo:4:3':'Der SharePoint-Speicher wächst mit jeder Lizenz. Reicht er nicht, lässt sich zusätzlicher Speicher dazukaufen.',
'spo:4:4':'Microsoft 365 Backup wird nach Nutzung abgerechnet. Für Kunden mit hohen Anforderungen an Wiederherstellung ist es ein interessantes Zusatzthema.',
'spo:5:0':'DLP erkennt sensible Daten anhand von Mustern. Es kann warnen oder die Weitergabe direkt blockieren.',
'spo:5:1':'Governance heißt: klare Zuständigkeit, nur so viel Freigabe wie nötig und regelmäßiges Aufräumen.',
'spo:5:2':'Der Schutz reist mit der Datei. Auch ein heruntergeladenes Dokument bleibt verschlüsselt.',
'spo:5:3':'Diese Funktionen stammen aus SharePoint Advanced Management. Das ist bei Microsoft 365 Copilot inzwischen mit dabei und ein gutes Argument vor dem Rollout.',
'spo:5:4':'Aufräumen vor der Migration spart Speicher und Zeit. Eine Probemigration deckt Probleme auf, bevor es ernst wird.',
'copilot:0:0':'Je klarer der Prompt, desto besser das Ergebnis. Das ist die wichtigste Botschaft in jeder Copilot-Schulung.',
'copilot:0:1':'Copilot Chat mit Firmenkonto ist der einfache Einstieg. Für Zugriff auf Mails, Dateien und Chats braucht es Microsoft 365 Copilot.',
'copilot:0:2':'Zeig dem Kunden einen Anwendungsfall aus seinem Alltag. Das überzeugt mehr als jede Funktionsliste.',
'copilot:0:3':'Ziel, Kontext, Quelle, Erwartung: Mit diesen vier Bausteinen schreibt jeder bessere Prompts.',
'copilot:0:4':'Copilot liefert einen Entwurf, die Verantwortung bleibt beim Menschen. Diese ehrliche Botschaft schafft Vertrauen.',
'copilot:1:0':'Ein guter Prompt nennt Quelle, Zielgruppe, Format und Fokus. Vage Prompts liefern vage Ergebnisse.',
'copilot:1:1':'Prompten ist ein Dialog. Mit Folge-Prompts verfeinerst du das Ergebnis Schritt für Schritt.',
'copilot:1:2':'Diese vier Tätigkeiten decken die meisten Anwendungsfälle im Büroalltag ab. Damit lässt sich jede Demo strukturieren.',
'copilot:1:3':'Mit „/“ bindest du gezielt Dateien ein. In der Prompt-Galerie findet das ganze Team bewährte Prompts.',
'copilot:1:4':'Halluzinationen gibt es bei jeder KI. Quellen prüfen und kritisch lesen gehört zur Copilot-Einführung dazu.',
'copilot:2:0':'Copilot hält sich an die vorhandenen Berechtigungen. Deshalb sind saubere Freigaben vor dem Rollout so wichtig.',
'copilot:2:2':'Meeting-Zusammenfassungen mit offenen Aufgaben gehören zu den beliebtesten Copilot-Funktionen im Vertrieb.',
'copilot:2:3':'Agents spezialisieren Copilot auf einen Zweck, zum Beispiel für HR-Fragen, Produktwissen oder Angebotsentwürfe.',
'copilot:2:4':'Quellenverweise machen Antworten nachprüfbar. Das ist wichtig für Akzeptanz und Qualität.',
'copilot:3:0':'In Excel hilft Copilot besonders bei sauber formatierten Tabellen. Daten als Tabelle formatieren lohnt sich.',
'copilot:3:1':'Copilot arbeitet in jeder App etwas anders. Zeig dem Kunden die App, die er am meisten nutzt.',
'copilot:3:2':'Für Zusammenfassungen nach dem Meeting braucht Copilot das Transkript. Das sollte man vor wichtigen Terminen einschalten.',
'copilot:3:3':'Ein durchgehender Ablauf über mehrere Apps zeigt den echten Mehrwert. Er wirkt stärker als einzelne Funktionen.',
'copilot:3:4':'Researcher eignet sich für tiefe Recherchen, zum Beispiel zur Vorbereitung eines Kundentermins.',
'copilot:4:0':'Datenzugriff zuerst, dann Pilot, dann Breite. So vermeidet man Überraschungen und schafft schnelle Erfolge.',
'copilot:4:1':'Copilot gibt keine neuen Rechte. Er macht aber sichtbar, was ohnehin falsch freigegeben ist. Genau das sollte man vorher klären.',
'copilot:4:2':'Mit diesen Werkzeugen beantwortest du die typischen Fragen: Wie bauen wir Agents, wie messen wir den Nutzen und wie schützen wir Daten?',
'copilot:4:4':'Lizenzen allein sagen nichts über den Erfolg. Entscheidend sind Nutzung und gesparte Zeit in echten Anwendungsfällen.',
'copilot:5:0':'Der Agent Builder ist der schnelle Einstieg ohne Code. Copilot Studio eignet sich für anspruchsvollere Agents.',
'copilot:5:1':'Feste Wissensquellen machen Agents verlässlich. Sie antworten nur aus freigegebenen Inhalten.',
'copilot:5:2':'Wissen, Anweisungen, Aktionen, Zielgruppe: Mit diesen vier Fragen lässt sich jeder Agent planen.',
'copilot:5:3':'Mit Copilot-Connectors kommen Daten aus Fremdsystemen dazu. Die nutzungsbasierte Abrechnung sollte man im Angebot transparent machen.',
'copilot:5:4':'Klein starten, messen, dann ausrollen. So werden Agents zur Erfolgsgeschichte statt zum Experiment.',
'sec:0:0':'MFA verhindert die meisten Angriffe auf Konten. Es ist die wichtigste einzelne Schutzmaßnahme.',
'sec:0:1':'Zeitdruck, ungewöhnliche Empfänger und Geldforderungen sind Warnsignale. Im Zweifel immer über einen zweiten Kanal nachfragen.',
'sec:0:2':'Diese Begriffe hören Kunden ständig. Wer sie einfach erklären kann, gewinnt Vertrauen.',
'sec:0:3':'Gemeldete Mails helfen der IT, Angriffe früh zu erkennen und für alle zu stoppen.',
'sec:0:4':'Eine unerwartete MFA-Anfrage heißt oft: Jemand kennt das Kennwort. Ablehnen und sofort melden.',
'sec:1:0':'Bildschirm sperren dauert eine Sekunde. Gerade unterwegs und beim Kunden ist das wichtig.',
'sec:1:1':'Diese Angriffsarten kommen in fast jedem Security-Gespräch vor. Zu jeder gibt es eine passende Microsoft-Lösung.',
'sec:1:2':'Vor dem Klicken mit der Maus über den Link fahren und die Adresse prüfen. Das entlarvt viele Fälschungen.',
'sec:1:3':'Dateien in OneDrive sind gesichert und versioniert. Aktuelle Updates schließen Lücken, die Angreifer sonst nutzen.',
'sec:2:0':'Diese vier Dienste bilden das Sicherheitsfundament. In Business Premium sind sie in passender Ausprägung enthalten.',
'sec:2:2':'Das Fernlöschen schützt Firmendaten bei Verlust oder Diebstahl. Für Kunden mit vielen mobilen Mitarbeitenden ein starkes Argument.',
'sec:2:3':'Mit Autopilot geht das Gerät direkt vom Händler zum Mitarbeitenden. Die IT muss es nicht mehr selbst vorbereiten.',
'sec:2:4':'Sicherheitsstandards sind der kostenlose Einstieg. Mit bedingtem Zugriff steuert man genauer und braucht dafür Entra ID P1.',
'sec:3:0':'MDM eignet sich für Firmengeräte, MAM für private Geräte. So bleiben Firmendaten geschützt und Privates bleibt privat.',
'sec:3:1':'Konformität, Konfiguration, App-Schutz und Updates: Daraus besteht die Geräteverwaltung mit Intune.',
'sec:3:2':'App-Schutzrichtlinien trennen Firmen- und Privatdaten auf demselben Handy. Für BYOD ist das die sauberste Lösung.',
'sec:3:3':'Intune meldet den Gerätestatus an Entra ID. So lässt bedingter Zugriff nur sichere Geräte herein.',
'sec:3:4':'Viele Mitarbeitende wollen keine volle Verwaltung auf dem Privathandy. App-Schutz ist hier der akzeptierte Mittelweg.',
'sec:4:1':'Zero Trust heißt: nichts automatisch vertrauen, alles prüfen. Die drei Prinzipien gehören in jedes Security-Gespräch.',
'sec:4:2':'Defender for Business gibt es auch einzeln. Meist ist Business Premium aber das bessere Paket.',
'sec:4:3':'Business Premium ist für Mittelständler bis 300 Nutzer oft die beste Wahl. Es bündelt Produktivität und Sicherheit in einem Plan.',
'sec:4:4':'Admin-Rechte nur auf Zeit verkleinern die Angriffsfläche deutlich. PIM ist Teil von Entra ID P2.',
'sec:5:0':'Defender XDR verbindet einzelne Warnungen zu einem Vorfall. Das spart der IT viel Zeit bei der Analyse.',
'sec:5:1':'Jeder Defender schützt einen Bereich. Zusammen bilden sie im Defender-Portal ein Gesamtbild.',
'sec:5:2':'Sentinel ist für Kunden interessant, die ein eigenes Security-Team oder einen Dienstleister für die Überwachung haben.',
'sec:5:3':'Erst nach Risiken und Pflichten fragen, dann den Ist-Zustand aufnehmen. So wirkt dein Vorschlag maßgeschneidert.',
'sec:5:4':'Keine Lizenz macht automatisch NIS2-konform. Sie unterstützt aber wichtige Pflichten wie Risikomanagement und Erkennung.',
'lic:0:0':'Basic, Standard, Premium bauen aufeinander auf. Die Leiter zu kennen, ist die Grundlage für jede Lizenzberatung.',
'lic:0:1':'Ab 301 Nutzern sind Enterprise-Pläne gefragt. Business- und Enterprise-Pläne lassen sich im selben Tenant mischen.',
'lic:0:2':'F-Pläne sind günstig und auf Mitarbeitende ohne festen Schreibtisch zugeschnitten. Oft ein unterschätztes Potenzial beim Kunden.',
'lic:0:3':'Business Basic genügt für Nutzer, die nur im Browser arbeiten. Mit dem richtigen Mix wird das Angebot günstiger.',
'lic:0:4':'Microsoft 365 E3 bündelt Office 365 E3 mit Windows Enterprise und Enterprise Mobility + Security.',
'lic:1:0':'Einzelprodukte passen für Sonderfälle. Meist ist ein Komplettplan für den Kunden einfacher und günstiger.',
'lic:1:1':'Die Office-Apps auf mehreren Geräten pro Person sind ein klarer Vorteil gegenüber gerätebezogenen Kauflizenzen.',
'lic:1:2':'Business Standard ist der Klassiker für kleine Teams. Wächst der Sicherheitsbedarf, folgt der Schritt zu Premium.',
'lic:1:3':'Lizenzen hängen an Personen, nicht an Geräten. Die Zuweisung im Admin Center dauert nur wenige Klicks.',
'lic:2:0':'Monatslaufzeiten sind flexibel, kosten aber einen Aufschlag. Für den stabilen Grundbestand lohnt sich meist das Jahresabo.',
'lic:2:2':'GDAP gibt dem Partner nur die Rechte, die er wirklich braucht. Das ist sicherer als frühere pauschale Admin-Zugänge.',
'lic:2:3':'GDAP ist seit einigen Jahren Standard im CSP. Kunden schätzen, dass Partnerzugriffe zeitlich und inhaltlich begrenzt sind.',
'lic:2:4':'Jahresabo mit Monatszahlung kombiniert den günstigeren Preis mit verteilter Belastung. Das ist für viele Kunden attraktiv.',
'lic:3:0':'Längere Laufzeiten bringen Preissicherheit. Kürzere bringen Flexibilität. Die Wahl hängt vom Kunden ab.',
'lic:3:1':'Diese Regeln solltest du sicher erklären können. Sie bestimmen, wie flexibel ein Kunde im Vertrag ist.',
'lic:3:2':'Ein Upgrade ist für Nutzer kaum spürbar. Das senkt die Hürde für den nächsten Schritt.',
'lic:3:3':'Die Verlängerung ist der ideale Zeitpunkt für Optimierung und Upsell. Wer früh spricht, hat Zeit für Alternativen.',
'lic:3:4':'Im CSP bekommt der Kunde Beratung, Support und Abrechnung aus einer Hand. Das ist dein Mehrwert gegenüber dem Direktkauf.',
'lic:4:0':'Im EWR gibt es die Suiten auch ohne Teams. Achte im Angebot darauf, dass Teams dann separat dabei ist, sonst fehlt es.',
'lic:4:1':'Der Schritt von Standard zu Premium ist der häufigste Upsell im Mittelstand. Geräteverwaltung und Sicherheit sind hier die Argumente.',
'lic:4:2':'Bedarf zuerst, Produkt danach. So wirkt die Empfehlung logisch statt nach Verkaufsliste.',
'lic:4:3':'Wer erst zuhört, kann gezielt empfehlen. Der Nutzen am konkreten Fall überzeugt mehr als jede Feature-Liste.',
'lic:4:4':'Über 300 Nutzer geht es nur mit Enterprise-Plänen. E3 mit passenden Security-Add-ons deckt den Bedarf meist gut ab.',
'lic:5:0':'E5 Security bringt die Sicherheitsbausteine aus E5 auf E3. Für viele Kunden ist das der wirtschaftliche Mittelweg.',
'lic:5:1':'Einwände sind Kaufsignale. Mit einer passenden Antwort wird aus Skepsis ein nächster Schritt.',
'lic:5:2':'Die EU-Datengrenze ist ein starkes Argument bei Datenschutzbedenken, besonders im öffentlichen Umfeld und im Mittelstand.',
'lic:5:3':'Add-ons brauchen immer eine passende Basis. Fehlt sie, scheitert die Bereitstellung, und das Angebot muss nachgebessert werden.',
'lic:5:4':'Von der Basis zu den Add-ons arbeiten. So entsteht ein schlüssiges Paket ohne Lücken oder Doppelungen.'
};
CATS.forEach(c=>c.lessons.forEach((l,li)=>l.ex.forEach((e,ei)=>{if(!e.x)e.x=TIPS[c.id+':'+li+':'+ei];})));

/* ---------- Lernbereich „Das digitale Büro“ ----------
   Jeder Raum steht für ein Thema, jedes Tool wird in einfacher Sprache erklärt.
   lic: je Plan true (enthalten) oder ein kurzer Text (enthalten, mit Variante). Fehlt ein Plan, ist das Tool dort nicht enthalten.
   add: wie man es bekommt, wenn es nicht im Plan steckt. Lizenzstand siehe LEARN.checked, vor Angeboten immer gegenprüfen.
   Der Sales Room (kind:'sales') erklärt statt Tools die BANT-Kriterien: ms = Bezug zu Microsoft, ask = Fragen fürs Gespräch,
   good/bad = gute Zeichen und Warnzeichen, map = Kundenproblem → passende Lösung, quiz = [Aussage, B|A|N|T, Erklärung]. */
const PLANS=[
 {id:'bb',n:'Business Basic',s:'Basic'},
 {id:'bs',n:'Business Standard',s:'Standard'},
 {id:'bp',n:'Business Premium',s:'Premium'},
 {id:'e3',n:'Microsoft 365 E3',s:'E3'},
 {id:'e5',n:'Microsoft 365 E5',s:'E5'}
];
const THEMES={sec:{n:'Sicherheit',ch:'sec'},mw:{n:'Modern Work',ch:'teams'},ai:{n:'KI',ch:'copilot'},sales:{n:'Vertrieb',ch:'lic'}};
const LEARN={checked:'Oktober 2026',zones:[
{id:'door',name:'Eingang & Empfang',th:['sec'],ic:'door',area:'door',intro:'Wer darf rein? Hier geht es um Konten, Anmeldung und Zutrittsregeln.',tools:[
 {id:'entra',th:'sec',name:'Microsoft Entra ID',what:'Das Firmenkonto für alles. Jede Person meldet sich einmal an und kommt damit in Outlook, Teams und alle anderen Apps.',office:'Wie der Mitarbeiterausweis: einmal ausgestellt, öffnet er alle Türen, für die er freigeschaltet ist.',why:'Ein Konto statt vieler Kennwörter. Weniger Aufwand für die IT, weniger Risiko für die Firma.',lic:{bb:'Free',bs:'Free',bp:'P1',e3:'P1',e5:'P2'},note:'Die Basis steckt in jedem Plan. P1 bringt bedingten Zugriff, P2 zusätzlich Risikoerkennung und Admin-Rechte auf Zeit.'},
 {id:'mfa',th:'sec',name:'MFA (mehrstufige Anmeldung)',what:'Zur Anmeldung gehört neben dem Kennwort ein zweiter Beweis, zum Beispiel eine Bestätigung in der Authenticator-App oder ein Passkey.',office:'Ausweis plus PIN an der Tür. Wer nur einen geklauten Ausweis hat, kommt trotzdem nicht rein.',why:'MFA stoppt den allergrößten Teil der Angriffe auf Konten. Die wichtigste einzelne Schutzmaßnahme.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true},note:'Über die Sicherheitsstandards in jedem Plan kostenlos. Feinere Regeln, wann MFA nötig ist, gibt es mit bedingtem Zugriff.'},
 {id:'ca',th:'sec',name:'Bedingter Zugriff (Conditional Access)',what:'Regeln für die Anmeldung nach dem Muster „Wenn …, dann …“. Wenn jemand von einem fremden Gerät oder aus dem Ausland kommt, dann wird MFA verlangt oder der Zugriff blockiert.',office:'Der Pförtner mit Checkliste: Er schaut nicht nur auf den Ausweis, sondern auch darauf, wer kommt, woher, mit welchem Gerät und wann. Dann entscheidet er: rein, Zusatzkontrolle oder draußen bleiben.',why:'Sicherheit genau dort, wo das Risiko ist, ohne alle Mitarbeitenden ständig mit Abfragen zu nerven.',flow:[['Wer?','Alle aus dem Vertrieb'],['Wo?','Außerhalb der EU'],['Womit?','Gerät nicht von Intune verwaltet'],['Dann','MFA verlangen oder blockieren']],lic:{bp:'P1',e3:'P1',e5:'P2'},add:'Entra ID P1 als Add-on oder Upgrade auf Business Premium',note:'Steckt in Entra ID P1, also in Business Premium, E3 und E5. Business Basic und Standard haben ihn nicht. Regeln nach Anmelderisiko („diese Anmeldung wirkt verdächtig“) brauchen Entra ID P2, zum Beispiel über E5.'},
 {id:'idp',th:'sec',name:'Identity Protection',what:'Erkennt verdächtige Anmeldungen, etwa ein geleaktes Kennwort oder eine Anmeldung von zwei Kontinenten in zehn Minuten, und reagiert automatisch.',office:'Der aufmerksame Pförtner, der merkt: Dieselbe Person war eben noch in New York und steht jetzt in Bonn vor der Tür.',why:'Angriffe werden gestoppt, bevor jemand im Postfach stöbert, auch nachts und am Wochenende.',lic:{e5:'P2'},add:'Entra ID P2 als Add-on, z. B. zu Business Premium oder E3'},
 {id:'pim',th:'sec',name:'Privileged Identity Management (PIM)',what:'Admin-Rechte gibt es nur auf Antrag und nur für kurze Zeit, statt dauerhaft.',office:'Der Generalschlüssel liegt im Tresor. Er wird nur für einen Auftrag ausgegeben und muss abends zurück.',why:'Ein gekapertes Admin-Konto ist der Albtraum jeder IT. Rechte auf Zeit verkleinern dieses Risiko deutlich.',lic:{e5:'P2'},add:'Entra ID P2 als Add-on'}
]},
{id:'it',name:'IT-Werkstatt',th:['sec'],ic:'laptop',area:'it',intro:'Hier werden Laptops und Handys eingerichtet, gepflegt und geschützt.',tools:[
 {id:'intune',th:'sec',name:'Microsoft Intune',what:'Verwaltet Laptops und Handys aus der Cloud: Einstellungen, Apps, Updates und Verschlüsselung.',office:'Die Hausmeisterei für alle Geräte, egal ob im Büro, im Homeoffice oder unterwegs.',why:'Handy verloren? Firmendaten per Klick löschen. Und bedingter Zugriff weiß dank Intune, ob ein Gerät sicher ist.',lic:{bp:'Plan 1',e3:'Plan 1',e5:'Plan 1'},add:'Intune als Einzellizenz'},
 {id:'autopilot',th:'sec',name:'Windows Autopilot',what:'Neue Laptops gehen direkt vom Händler zu den Mitarbeitenden und richten sich beim ersten Anmelden selbst ein.',office:'Der Arbeitsplatz ist schon fertig, wenn die neue Kollegin am ersten Tag ankommt. Niemand muss vorher Software aufspielen.',why:'Spart der IT pro Gerät viel Zeit und macht Homeoffice-Starts einfach.',lic:{bp:true,e3:true,e5:true}},
 {id:'defender',th:'sec',name:'Defender for Business / for Endpoint',what:'Schutz für Laptops und Server: erkennt Angriffe, isoliert befallene Geräte und hilft beim Aufräumen.',office:'Der Wachdienst, der in jedem Büro mitläuft und sofort Alarm schlägt, wenn jemand einbricht.',why:'Ransomware kommt meist über ein einzelnes Gerät. Hier wird sie früh gestoppt.',lic:{bp:'for Business',e3:'Endpoint P1',e5:'Endpoint P2'},add:'Defender for Business einzeln (bis 300 Nutzer)',note:'Business Basic und Standard haben nur den eingebauten Virenschutz von Windows.'}
]},
{id:'post',name:'Poststelle',th:['sec'],ic:'mail',area:'post',intro:'Jede Mail kommt hier an. Die Poststelle sortiert aus, was gefährlich ist.',tools:[
 {id:'eop',th:'sec',name:'Exchange Online Protection',what:'Der Grundfilter gegen Spam und bekannte Schadsoftware in Mails.',office:'Die Poststelle wirft offensichtlichen Werbemüll und bekannte Bomben-Päckchen gleich weg.',why:'Ist immer dabei und hält den Großteil des Mülls fern.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}},
 {id:'mdo',th:'sec',name:'Defender for Office 365',what:'Prüft Links erst beim Klick und öffnet Anhänge vorab in einem sicheren Testraum. Plan 2 bringt Phishing-Simulationen und Werkzeuge für Ermittlungen.',office:'Verdächtige Pakete werden erst im Sicherheitsraum geöffnet, bevor sie auf einem Schreibtisch landen.',why:'Phishing ist der häufigste Weg in ein Unternehmen. Hier wird er schwerer.',lic:{bp:'Plan 1',e3:'Plan 1',e5:'Plan 2'},add:'Defender for Office 365 als Add-on',note:'In E3 ist Plan 1 seit Juli 2026 enthalten.'}
]},
{id:'vault',name:'Archiv & Tresor',th:['sec'],ic:'lock',area:'vault',intro:'Hier geht es um die Daten selbst: einstufen, schützen, aufbewahren.',tools:[
 {id:'labels',th:'sec',name:'Vertraulichkeitsbezeichnungen (Purview)',what:'Dokumente und Mails bekommen ein Etikett wie „Vertraulich“. Je nach Etikett werden sie verschlüsselt oder mit Wasserzeichen versehen.',office:'Der Stempel „Vertraulich“ auf der Akte, nur dass er wirklich abschließt: Auch eine Kopie können nur Berechtigte öffnen.',why:'Der Schutz reist mit der Datei mit, auch per Mail, USB-Stick oder Download.',lic:{bp:'manuell',e3:'manuell',e5:'automatisch'},note:'Mit E5 setzt Purview Etiketten auch automatisch, zum Beispiel sobald eine IBAN im Dokument steht.'},
 {id:'dlp',th:'sec',name:'Data Loss Prevention (DLP)',what:'Erkennt sensible Daten wie IBANs oder Gesundheitsdaten und warnt oder blockiert, bevor sie das Unternehmen verlassen.',office:'Die Kontrolle am Ausgang, die merkt, wenn jemand die Kundenkartei in der Tasche hat.',why:'Hilft gegen Pannen und Datenschutzvorfälle, die sonst teuer werden.',lic:{bp:'Mail & Dateien',e3:'Mail & Dateien',e5:'+ Geräte'}},
 {id:'retention',th:'sec',name:'Aufbewahrung & eDiscovery',what:'Legt fest, wie lange Mails und Dateien aufgehoben oder gelöscht werden, und findet bei Bedarf alles für rechtliche Prüfungen.',office:'Das Archiv mit Fristen: Rechnungen zehn Jahre aufheben, danach geregelt vernichten.',why:'Gesetzliche Fristen einhalten, ohne dass jemand von Hand Ordner pflegt.',lic:{bp:'Standard',e3:'Standard',e5:'Premium'}}
]},
{id:'soc',name:'Sicherheits\u00ADzentrale',th:['sec','ai'],ic:'radar',area:'soc',intro:'Alle Alarme laufen hier zusammen. Die Zentrale erkennt Angriffe und reagiert.',tools:[
 {id:'xdr',th:'sec',name:'Microsoft Defender XDR',what:'Ein Portal, das Alarme von Geräten, Mails, Konten und Cloud-Apps zu einem Vorfall zusammenführt.',office:'Die Leitstelle mit allen Kameras auf einem Bildschirm statt zehn einzelner Alarmanlagen.',why:'Die IT sieht den ganzen Angriff statt vieler Einzelmeldungen und reagiert schneller.',lic:{bp:'teilweise',e3:'teilweise',e5:true},add:'Microsoft 365 E5 Security als Add-on zu E3',note:'Das volle Bild mit Identitäten und Cloud-Apps gibt es mit E5 bzw. E5 Security.'},
 {id:'sentinel',th:'sec',name:'Microsoft Sentinel',what:'Sammelt Sicherheitsdaten aus dem ganzen Unternehmen, auch von Firewalls und Fremdsystemen, und sucht darin nach Angriffsmustern (SIEM).',office:'Das Sicherheitsbüro, das auch die Kameras der Nachbargebäude und des Parkhauses im Blick hat.',why:'Für Kunden mit eigenem Security-Team oder Dienstleister, die alles an einem Ort überwachen wollen.',lic:{},add:'Eigener Azure-Dienst, abgerechnet nach Datenmenge'},
 {id:'seccop',th:'ai',name:'Security Copilot',what:'KI für das Sicherheitsteam: fasst Vorfälle verständlich zusammen, erklärt Angriffe und schlägt nächste Schritte vor.',office:'Die erfahrene Kollegin in der Leitstelle, die in Sekunden erklärt, was da gerade auf dem Monitor passiert.',why:'Auch kleine IT-Teams verstehen Angriffe schneller und reagieren sicherer.',lic:{e5:true},add:'Sonst nach Nutzung (Security Compute Units)',note:'Seit 2026 in Microsoft 365 E5 mit einem monatlichen Kontingent enthalten.'}
]},
{id:'desk',name:'Großraum\u00ADbüro',th:['mw','ai'],ic:'people',area:'desk',intro:'Hier wird gearbeitet: schreiben, rechnen, mailen, ablegen.',tools:[
 {id:'apps',th:'mw',name:'Word, Excel, PowerPoint',what:'Die Office-Apps zum Schreiben, Rechnen und Präsentieren, im Browser, auf dem Handy oder als Desktop-App.',office:'Stift, Taschenrechner und Flipchart, nur dass mehrere Leute gleichzeitig daran arbeiten können.',why:'Alle arbeiten mit der aktuellen Version, gemeinsam in derselben Datei.',lic:{bb:'Web & Mobil',bs:'+ Desktop',bp:'+ Desktop',e3:'+ Desktop',e5:'+ Desktop'}},
 {id:'outlook',th:'mw',name:'Outlook & Exchange',what:'Mail, Kalender und Kontakte. Das Postfach liegt sicher in der Cloud und ist auf allen Geräten gleich.',office:'Briefkasten und Terminkalender in einem, den man überallhin mitnimmt.',why:'Kein eigener Mailserver mehr, um den sich jemand kümmern muss.',lic:{bb:'100 GB',bs:'100 GB',bp:'100 GB + Archiv',e3:'100 GB + Archiv',e5:'100 GB + Archiv'},note:'Die Business-Pläne bekommen seit 2026 bis zu 100 GB statt 50 GB.'},
 {id:'onedrive',th:'mw',name:'OneDrive',what:'Der persönliche Ablageort für Arbeitsdateien, 1 TB pro Person und auf allen Geräten synchron.',office:'Die eigene Schreibtischschublade, die man überallhin mitnehmen kann und die nie verloren geht.',why:'Kaputter Laptop? Die Dateien sind trotzdem da.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}},
 {id:'planner',th:'mw',name:'Planner & Loop',what:'Planner verteilt Aufgaben im Team. Loop sind Notizseiten, an denen alle gleichzeitig schreiben.',office:'Die Pinnwand mit Aufgabenkärtchen und das gemeinsame Whiteboard.',why:'Wer macht was bis wann, für alle sichtbar, ohne Excel-Liste per Mail.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}}
]},
{id:'meet',name:'Besprechungs\u00ADraum',th:['mw'],ic:'teams',area:'meet',intro:'Treffen, telefonieren, präsentieren, vor Ort und von unterwegs.',tools:[
 {id:'teams',th:'mw',name:'Microsoft Teams',what:'Chat, Meetings und Zusammenarbeit an einem Ort.',office:'Flurfunk, Besprechungsraum und Projektordner unter einem Dach.',why:'Weniger Mails, schnellere Abstimmung, egal wo alle gerade sitzen.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true},note:'In der EU gibt es die Pläne auch ohne Teams. Dann muss Teams separat ins Angebot.'},
 {id:'rooms',th:'mw',name:'Teams Rooms',what:'Kamera, Mikrofon und Bildschirm im Raum starten das Teams-Meeting mit einem Klick.',office:'Der Konferenzraum, in dem die Kollegen aus dem Homeoffice auf dem großen Bildschirm mit am Tisch sitzen.',why:'Hybride Meetings, in denen alle gleich gut sehen und hören.',lic:{},add:'Raumlizenz Teams Rooms Basic (bis 25 Räume kostenlos) oder Pro'},
 {id:'tpremium',th:'mw',name:'Teams Premium',what:'Extras für wichtige Meetings: Wasserzeichen, eigenes Branding, Webinare mit mehr Funktionen und intelligente Zusammenfassungen.',office:'Der Konferenzsaal mit Empfangsdame und Protokollführer.',why:'Vertrauliche Meetings schützen und Kunden-Events professioneller machen.',lic:{},add:'Teams Premium als Add-on'},
 {id:'phone',th:'mw',name:'Teams Phone',what:'Telefonieren aus Teams mit echter Rufnummer, inklusive Zentrale und Warteschleife.',office:'Die Telefonanlage steckt im Laptop. Kein Kasten mehr im Keller.',why:'Eine App für Chat, Meeting und Telefon, auch im Homeoffice unter der Büronummer erreichbar.',lic:{e5:true},add:'Teams Phone Standard plus Rufnummern bzw. Anbindung, z. B. Operator Connect'}
]},
{id:'hub',name:'Teamraum & Intranet',th:['mw'],ic:'folder',area:'hub',intro:'Gemeinsame Ablage für Teams und Projekte und das Schwarze Brett für alle.',tools:[
 {id:'sharepoint',th:'mw',name:'SharePoint',what:'Die gemeinsame Ablage für Teams und Projekte und die Basis fürs Intranet.',office:'Der Aktenschrank im Teamraum, an den jeder aus dem Team kommt, und das Schwarze Brett im Flur.',why:'Eine Ablage statt Fileserver, Mailanhängen und USB-Sticks.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}},
 {id:'viva',th:'mw',name:'Viva Connections',what:'Bringt das Intranet als App in Teams, mit News, Dashboard und wichtigen Links.',office:'Das Schwarze Brett hängt jetzt direkt am Arbeitsplatz statt unten im Foyer.',why:'News und Infos kommen bei den Mitarbeitenden an, statt ungelesen zu bleiben.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}}
]},
{id:'ai',name:'KI-Ecke',th:['ai'],ic:'spark',area:'ai',intro:'Hier arbeiten die KI-Assistenten. Sie schreiben Entwürfe, fassen zusammen und recherchieren.',tools:[
 {id:'cchat',th:'ai',name:'Microsoft 365 Copilot Chat',what:'KI-Chat mit Wissen aus dem Web, sicher mit dem Firmenkonto: Eingaben sind geschützt und werden nicht zum Training genutzt.',office:'Ein schlauer Praktikant mit Internetzugang, aber ohne Schlüssel zu den Firmenakten.',why:'Der kostenlose Einstieg in KI, ohne dass Mitarbeitende private KI-Tools nutzen.',lic:{bb:true,bs:true,bp:true,e3:true,e5:true}},
 {id:'copilot',th:'ai',name:'Microsoft 365 Copilot',what:'KI direkt in Word, Excel, PowerPoint, Outlook und Teams. Sie kennt deine Mails, Chats und Dateien, aber nur das, was du ohnehin sehen darfst.',office:'Die Assistenz, die alle Akten kennt, die du sehen darfst, und dir Entwürfe, Zusammenfassungen und Antworten vorbereitet.',why:'Spart Zeit bei Routine wie Meeting-Protokollen, Mailverläufen und ersten Entwürfen.',lic:{},add:'Add-on Microsoft 365 Copilot, für bis zu 300 Nutzer auch Copilot Business. In Microsoft 365 E7 enthalten.',note:'Vor dem Start Freigaben aufräumen: Copilot findet alles, worauf ein Nutzer Zugriff hat.'},
 {id:'agents',th:'ai',name:'Agents & Copilot Studio',what:'Spezialisierte KI-Helfer für eine Aufgabe, etwa für HR-Fragen oder Angebotsentwürfe. Einfache Agents klickt man im Agent Builder zusammen, anspruchsvolle baut man in Copilot Studio.',office:'Fachkräfte mit genau einer Aufgabe, zum Beispiel die Kollegin aus der Personalabteilung, die alle Urlaubsfragen beantwortet.',why:'Wissen, das sonst in einzelnen Köpfen steckt, ist für alle rund um die Uhr abrufbar.',lic:{},add:'Mit Copilot-Lizenz nutzbar, sonst nach Nutzung (Copilot Credits)'},
 {id:'researcher',th:'ai',name:'Researcher & Analyst',what:'Zwei mitgelieferte Agents: Researcher recherchiert mehrstufig in Web und Firmendaten und schreibt einen Bericht. Analyst wertet Daten aus wie ein Datenanalyst.',office:'Die Rechercheabteilung und das Controlling, die auf Zuruf einen fertigen Bericht liefern.',why:'Kundentermine und Entscheidungen in Minuten statt Stunden vorbereiten.',lic:{},add:'Mit Microsoft 365 Copilot enthalten'}
]},
{id:'sales',kind:'sales',name:'Sales Room',th:['sales'],ic:'target',area:'sales',intro:'Hier lernst du, mit BANT zu prüfen, ob aus einem Gespräch ein echtes Microsoft-Projekt wird.',tools:[
 {id:'bant',th:'sales',name:'BANT im Überblick',what:'BANT sind vier Fragen, mit denen du früh prüfst, ob ein Kunde wirklich kaufen kann und will: Budget, Authority (Entscheider), Need (Bedarf) und Timeline (Zeitplan).',office:'Die Checkliste am Whiteboard, die das Team durchgeht, bevor ein Angebot rausgeht. Fehlt ein Haken, wird erst nachgefragt statt gerechnet.',
  flow:[['B','Budget: Ist Geld da?'],['A','Authority: Wer entscheidet?'],['N','Need: Welches Problem?'],['T','Timeline: Bis wann?']],
  ms:'Bei Microsoft-Themen hilft die Reihenfolge N, T, A, B: Erst den Bedarf verstehen, dann den Anlass mit Termin finden, dann alle Beteiligten kennen. Danach ist das Budget-Gespräch viel leichter, weil du den Wert schon kennst.',
  good:['Alle vier Punkte sind geklärt und notiert','Der Kunde nennt selbst einen Termin und ein Problem'],bad:['Nur „Schicken Sie mal ein Angebot“','Niemand weiß, wer entscheidet'],
  note:'BANT ist kein Verhör. Stell die Fragen im Gespräch nebenbei und notiere die Antworten im CRM. Fehlt ein Kriterium, ist das kein Aus, sondern deine nächste Aufgabe.'},
 {id:'budget',th:'sales',name:'B wie Budget',what:'Gibt es Geld für das Projekt? Und was gibt der Kunde heute schon aus?',office:'Das Sparschwein auf dem Sideboard: Oft ist mehr drin, als der Kunde denkt, es liegt nur in vielen kleinen Töpfen.',
  ms:'Budget steckt oft in Altverträgen: Virenschutz, Geräteverwaltung, Videokonferenz-Tool, Telefonanlage oder Fileserver-Wartung. Business Premium oder E5 löst viele davon ab, also Kosten gegenrechnen. Im CSP ist die Monatslaufzeit rund 20 % teurer als die Jahreslaufzeit, ein Jahresabo mit Monatszahlung verteilt die Belastung.',
  ask:['Was zahlt ihr heute pro Nutzer für Mail, Virenschutz und Geräteverwaltung?','Ist für Sicherheit oder KI in diesem Jahr schon Geld eingeplant?','Lieber monatlich flexibel oder günstiger mit Jahresvertrag?'],
  good:['Budget für Sicherheit ist freigegeben','Altverträge laufen aus und können ersetzt werden'],bad:['„Es darf nichts kosten“','Preis ist das einzige Thema'],
  note:'Sprich über Wert vor Preis: Was kostet ein Tag Ausfall nach einem Ransomware-Angriff, was kostet eine Stunde Suche nach Dateien pro Woche?'},
 {id:'authority',th:'sales',name:'A wie Authority',what:'Wer entscheidet, wer zahlt und wer kann das Projekt noch stoppen?',office:'Das Siegertreppchen der Entscheider: oben die Geschäftsführung, daneben IT-Leitung und Einkauf. Und am Rand steht oft jemand mit Vetorecht.',
  ms:'Microsoft-Projekte entscheidet selten die IT allein. Typisch sind Geschäftsführung (Budget), IT-Leitung (Technik), Datenschutz, Einkauf und bei vielen Themen der Betriebsrat: bei Copilot, Intune auf Diensthandys oder Teams-Telefonie redet er fast immer mit. Frag auch, ob ein IT-Partner den Tenant betreut, er ist ein wichtiger Einflussnehmer.',
  ask:['Wer unterschreibt am Ende?','Wen müssen wir noch einbinden, etwa Datenschutz oder Betriebsrat?','Wer betreut euren Microsoft-Tenant heute, ihr selbst oder ein Partner?'],
  good:['Du sprichst direkt mit der Person, die entscheidet','Der Kunde lädt selbst weitere Beteiligte ein'],bad:['Dein Kontakt „muss das erst mal intern klären“','Betriebsrat oder Datenschutz erfahren erst am Ende davon'],
  note:'Bei Copilot früh den Betriebsrat und den Datenschutz an den Tisch holen. Wer erst nach dem Angebot fragt, verliert oft Monate.'},
 {id:'need',th:'sales',name:'N wie Need',what:'Welches Problem soll gelöst werden, und was passiert, wenn nichts passiert?',office:'Die Pinnwand mit roten Zetteln für die Probleme und grünen für die Lösungen. Erst wenn jeder rote Zettel einen grünen Partner hat, passt das Angebot.',
  ms:'Ordne jedes Kundenproblem einer konkreten Microsoft-Lösung zu. So wird aus „mehr Sicherheit“ ein greifbarer Nutzen.',
  map:[['Phishing oder Ransomware-Angst','Defender for Office 365, Defender for Business, Business Premium'],['Private Handys mit Firmenmails','Intune mit App-Schutzrichtlinien'],['Laptops einrichten dauert ewig','Windows Autopilot mit Intune'],['Fileserver voll, kein Zugriff von unterwegs','SharePoint und OneDrive'],['Telefonanlage läuft aus','Teams Phone'],['Zu viel Zeit für Mails und Protokolle','Microsoft 365 Copilot'],['NIS2-Pflichten','Microsoft 365 E5 Security bzw. Business Premium']],
  ask:['Was kostet euch im Alltag am meisten Zeit oder Nerven?','Gab es schon einen Sicherheitsvorfall oder knapp daneben?','Was passiert, wenn ihr in einem Jahr noch genauso arbeitet?'],
  good:['Der Kunde beschreibt den Schmerz mit eigenen Worten und Zahlen','Es gab einen konkreten Anlass'],bad:['„Eigentlich läuft alles“','Nur Interesse an einer Funktion, ohne Problem dahinter'],
  note:'Frag nach der Folge, nicht nach dem Produkt. Wer weiß, was ein Problem kostet, findet auch das Budget.'},
 {id:'timeline',th:'sales',name:'T wie Timeline',what:'Bis wann muss die Lösung laufen, und welcher Anlass gibt den Termin vor?',office:'Die große Uhr und der Wandkalender mit einem roten Kreis: Ohne Termin bleibt jedes Projekt im Wartezimmer.',
  ms:'Gute Anlässe im Microsoft-Umfeld: Vertragsende oder Verlängerung im CSP (danach bleibt nur ein Storno-Fenster von 168 Stunden), Support-Ende von Windows 10 und Exchange Server 2016/2019 (beides seit Oktober 2025), auslaufende Telefonanlagen- oder Leasingverträge, NIS2-Pflichten, Audits, ein Umzug oder die Budgetplanung fürs nächste Jahr.',
  ask:['Wann läuft euer aktueller Vertrag aus?','Gibt es einen festen Termin, etwa einen Umzug, ein Audit oder die Budgetrunde?','Bis wann soll ein Pilot stehen, damit ihr entscheiden könnt?'],
  good:['Ein festes Datum mit Folgen, z. B. Vertragsende','Der Kunde plant schon rückwärts vom Termin'],bad:['„Irgendwann nächstes Jahr“','Kein Anlass, nur Neugier'],
  note:'Plan rückwärts: Rollout, Pilot, Entscheidung, Angebot. So weißt du, wann das Angebot spätestens beim Kunden sein muss.'},
 {id:'deal',th:'sales',name:'Beispiel: BANT an einem Fall',what:'Ein Mittelständler mit 120 Nutzern, Business Standard und alter Telefonanlage. So sieht BANT im echten Gespräch aus.',office:'Der Stehtisch, an dem Vertrieb und Kunde den Deal durchgehen, mit Vertrag und Stift schon auf dem Tisch.',
  flow:[['Need','Phishing-Vorfall, Firmenmails auf Privathandys'],['Timeline','Telefonanlage läuft in 6 Monaten aus'],['Authority','Geschäftsführer, IT-Leiter, Betriebsrat für Intune'],['Budget','heute rund 14 € pro Nutzer für Einzeltools']],
  ms:'Die Empfehlung: Upgrade auf Business Premium (Defender, Intune, bedingter Zugriff) plus Teams Phone mit Operator Connect. Die abgelösten Einzeltools gegenrechnen, mit einer Pilotgruppe starten und vor dem Ende der Telefonanlage umstellen.',
  note:'Ein gut qualifizierter Deal lässt sich in vier Sätzen erzählen. Klappt das nicht, fehlt noch ein Kriterium.'},
 {id:'quiz',th:'sales',name:'BANT-Quiz',what:'Was hat der Kunde gerade verraten? Ordne jede Aussage dem passenden Buchstaben zu.',office:'Das Quiz-Terminal in der Ecke: Hier trainiert das Team, Kundensätze sofort richtig einzuordnen.',
  quiz:[['„Wir zahlen heute extra für Virenschutz, Geräteverwaltung und Videokonferenzen.“','B','Altverträge sind verstecktes Budget, das Business Premium ablösen kann.'],
   ['„Ohne den Betriebsrat führen wir Copilot nicht ein.“','A','Der Betriebsrat redet mit und gehört damit zu den Entscheidern.'],
   ['„Letzten Monat hat ein Kollege auf eine Phishing-Mail geklickt.“','N','Ein konkretes Problem. Hier helfen Defender for Office 365 und Schulungen.'],
   ['„Der Vertrag unserer Telefonanlage läuft im März aus.“','T','Ein fester Termin, der das Projekt antreibt. Teams Phone rechtzeitig planen.'],
   ['„Alles über 10.000 Euro gibt die Geschäftsführung frei.“','A','Du weißt jetzt, wer ab welcher Summe entscheidet.'],
   ['„Unser Fileserver ist voll und unterwegs kommt keiner an die Dateien.“','N','Bedarf für SharePoint und OneDrive.'],
   ['„Im Juni haben wir das NIS2-Audit.“','T','Ein Termin mit Folgen. Bis dahin müssen Schutzmaßnahmen stehen.'],
   ['„Pro Nutzer und Monat haben wir rund 20 Euro eingeplant.“','B','Ein konkreter Budgetrahmen. Business Premium passt da oft hinein.']]}
]}

]};
